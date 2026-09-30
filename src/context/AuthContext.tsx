import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  logOut,
  testFirestoreConnection,
  subscribeUserBookmarks,
  subscribeUserLastRead,
  saveBookmarkToFirestore,
  deleteBookmarkFromFirestore,
  saveLastReadToFirestore
} from '../services/firebase';
import {
  getStoredBookmarks,
  saveStoredBookmarks,
  getStoredLastRead,
  saveStoredLastRead
} from '../services/storage';
import { Bookmark, ReadingHistory } from '../types/quran';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncLocalBookmarksToCloud: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Sync local bookmarks to Firestore upon sign-in
        const localBookmarks = getStoredBookmarks();
        for (const bm of localBookmarks) {
          try {
            await saveBookmarkToFirestore(firebaseUser.uid, bm);
          } catch (e) {
            console.error('Error syncing local bookmark to cloud', e);
          }
        }

        // Sync local last read to Firestore
        const localLastRead = getStoredLastRead();
        if (localLastRead) {
          try {
            await saveLastReadToFirestore(firebaseUser.uid, localLastRead);
          } catch (e) {
            console.error('Error syncing local last read to cloud', e);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to real-time Cloud updates when user is authenticated
  useEffect(() => {
    if (!user) return;

    // 1. Subscribe to Cloud Bookmarks
    const unsubBookmarks = subscribeUserBookmarks(user.uid, (cloudBookmarks) => {
      // Merge cloud bookmarks with local
      saveStoredBookmarks(cloudBookmarks);
      window.dispatchEvent(new CustomEvent('quran-bookmarks-synced'));
    });

    // 2. Subscribe to Cloud Last Read
    const unsubLastRead = subscribeUserLastRead(user.uid, (cloudLastRead) => {
      if (cloudLastRead) {
        saveStoredLastRead(cloudLastRead);
        window.dispatchEvent(new CustomEvent('quran-lastread-synced'));
      }
    });

    return () => {
      unsubBookmarks();
      unsubLastRead();
    };
  }, [user]);

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const logout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const syncLocalBookmarksToCloud = async () => {
    if (!user) return;
    const local = getStoredBookmarks();
    for (const b of local) {
      await saveBookmarkToFirestore(user.uid, b);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
        syncLocalBookmarksToCloud
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
