import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Bookmark, ReadingHistory } from '../types/quran';
import { TasbeehData } from './storage';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
    }
    return false;
  }
}

// Auth helpers
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    if (cred.user) {
      // Sync user profile to Firestore
      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        userId: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || 'Muslim Reader',
        photoURL: cred.user.photoURL || '',
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    return cred.user;
  } catch (err) {
    console.error('Sign in error:', err);
    throw err;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Cloud Bookmarks Sync
export async function saveBookmarkToFirestore(userId: string, bookmark: Bookmark): Promise<void> {
  const path = `users/${userId}/bookmarks/${bookmark.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'bookmarks', bookmark.id), {
      id: bookmark.id,
      userId,
      surahNumber: bookmark.surahNumber,
      surahName: bookmark.surahName,
      englishName: bookmark.englishName,
      ayahNumber: bookmark.ayahNumber,
      arabicText: bookmark.arabicText,
      translationText: bookmark.translationText || '',
      createdAt: bookmark.timestamp || Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteBookmarkFromFirestore(userId: string, bookmarkId: string): Promise<void> {
  const path = `users/${userId}/bookmarks/${bookmarkId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'bookmarks', bookmarkId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeUserBookmarks(userId: string, onUpdate: (bookmarks: Bookmark[]) => void) {
  const path = `users/${userId}/bookmarks`;
  return onSnapshot(
    collection(db, 'users', userId, 'bookmarks'),
    (snapshot) => {
      const list: Bookmark[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: d.id,
          surahNumber: d.surahNumber,
          surahName: d.surahName,
          englishName: d.englishName,
          ayahNumber: d.ayahNumber,
          arabicText: d.arabicText,
          translationText: d.translationText || '',
          timestamp: typeof d.createdAt === 'number' ? d.createdAt : Date.now()
        };
      });
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

// Cloud Reading Progress Sync
export async function saveLastReadToFirestore(userId: string, history: ReadingHistory): Promise<void> {
  const path = `users/${userId}/progress/lastRead`;
  try {
    await setDoc(doc(db, 'users', userId, 'progress', 'lastRead'), {
      userId,
      surahNumber: history.surahNumber,
      surahName: history.surahName,
      englishName: history.englishName,
      ayahNumber: history.ayahNumber,
      updatedAt: history.timestamp || Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeUserLastRead(userId: string, onUpdate: (history: ReadingHistory | null) => void) {
  const path = `users/${userId}/progress/lastRead`;
  return onSnapshot(
    doc(db, 'users', userId, 'progress', 'lastRead'),
    (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        onUpdate({
          surahNumber: d.surahNumber,
          surahName: d.surahName,
          englishName: d.englishName,
          ayahNumber: d.ayahNumber,
          timestamp: typeof d.updatedAt === 'number' ? d.updatedAt : Date.now()
        });
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

// Cloud Tasbeeh Sync
export async function saveTasbeehToFirestore(userId: string, data: TasbeehData): Promise<void> {
  const path = `users/${userId}/tasbeeh/current`;
  try {
    await setDoc(doc(db, 'users', userId, 'tasbeeh', 'current'), {
      userId,
      count: data.count,
      target: data.target,
      totalToday: data.totalToday,
      selectedDhikrIndex: data.selectedDhikrIndex,
      lastDate: data.lastDate,
      updatedAt: Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeUserTasbeeh(userId: string, onUpdate: (data: TasbeehData) => void) {
  const path = `users/${userId}/tasbeeh/current`;
  return onSnapshot(
    doc(db, 'users', userId, 'tasbeeh', 'current'),
    (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        onUpdate({
          count: d.count ?? 0,
          target: d.target ?? 33,
          totalToday: d.totalToday ?? 0,
          lastDate: d.lastDate || new Date().toISOString().split('T')[0],
          selectedDhikrIndex: d.selectedDhikrIndex ?? 0
        });
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}
