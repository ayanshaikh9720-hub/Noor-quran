/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
import { HomeScreen } from './screens/HomeScreen';
import { QuranScreen } from './screens/QuranScreen';
import { BookmarksScreen } from './screens/BookmarksScreen';
import { SearchScreen } from './screens/SearchScreen';
import { DuasScreen } from './screens/DuasScreen';
import { TasbeehScreen } from './screens/TasbeehScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { MoreScreen } from './screens/MoreScreen';
import { InstallAppModal } from './components/InstallAppModal';
import {
  getStoredSettings,
  getStoredBookmarks,
  getStoredLastRead,
  saveStoredSettings
} from './services/storage';
import { AppSettings, Bookmark, ReadingHistory } from './types/quran';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(getStoredBookmarks);
  const [lastRead, setLastRead] = useState<ReadingHistory | null>(getStoredLastRead);

  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeSubScreen, setActiveSubScreen] = useState<'search' | 'duas' | 'tasbeeh' | 'settings' | null>(null);

  // Quran Reader target
  const [readerSurahNumber, setReaderSurahNumber] = useState<number | undefined>(undefined);
  const [readerAyahNumber, setReaderAyahNumber] = useState<number | undefined>(undefined);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Apply dark/light theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Refresh bookmarks and lastRead
  const refreshBookmarks = useCallback(() => {
    setBookmarks(getStoredBookmarks());
  }, []);

  const refreshLastRead = useCallback(() => {
    setLastRead(getStoredLastRead());
  }, []);

  // Listen to cloud sync events
  useEffect(() => {
    const handleBookmarksSynced = () => {
      refreshBookmarks();
    };
    const handleLastReadSynced = () => {
      refreshLastRead();
    };
    window.addEventListener('quran-bookmarks-synced', handleBookmarksSynced);
    window.addEventListener('quran-lastread-synced', handleLastReadSynced);
    return () => {
      window.removeEventListener('quran-bookmarks-synced', handleBookmarksSynced);
      window.removeEventListener('quran-lastread-synced', handleLastReadSynced);
    };
  }, [refreshBookmarks, refreshLastRead]);

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: nextTheme as 'light' | 'dark' };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleOpenSurah = (surahNumber: number, ayahNumber?: number) => {
    setReaderSurahNumber(surahNumber);
    setReaderAyahNumber(ayahNumber);
    setCurrentTab('quran');
    setActiveSubScreen(null);
  };

  const handleDataCleared = () => {
    setBookmarks([]);
    setLastRead(null);
    setReaderSurahNumber(undefined);
    setReaderAyahNumber(undefined);
  };

  return (
    <AuthProvider>
      <AudioProvider>
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
          {/* Top Header */}
          <Header
            onOpenSearch={() => setActiveSubScreen('search')}
            onOpenSettings={() => setActiveSubScreen('settings')}
            currentTheme={settings.theme}
            onToggleTheme={handleToggleTheme}
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-xl mx-auto">
            {/* Subscreen overlay view if open (Search, Duas, Tasbeeh, Settings) */}
            {activeSubScreen === 'search' && (
              <SearchScreen
                onOpenAyah={(surah, ayah) => {
                  handleOpenSurah(surah, ayah);
                  refreshLastRead();
                }}
                onClose={() => setActiveSubScreen(null)}
              />
            )}

            {activeSubScreen === 'duas' && (
              <DuasScreen onBack={() => setActiveSubScreen(null)} />
            )}

            {activeSubScreen === 'tasbeeh' && (
              <TasbeehScreen onBack={() => setActiveSubScreen(null)} />
            )}

            {activeSubScreen === 'settings' && (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={setSettings}
                onDataCleared={handleDataCleared}
              />
            )}

            {/* Primary Tabs */}
            {!activeSubScreen && (
              <>
                {currentTab === 'home' && (
                  <HomeScreen
                    lastRead={lastRead}
                    onOpenSurah={(surah, ayah) => {
                      handleOpenSurah(surah, ayah);
                      refreshLastRead();
                    }}
                    onNavigateTab={(tab) => {
                      setCurrentTab(tab);
                      refreshLastRead();
                    }}
                    onOpenDuas={() => setActiveSubScreen('duas')}
                    onOpenTasbeeh={() => setActiveSubScreen('tasbeeh')}
                    onOpenSearch={() => setActiveSubScreen('search')}
                    onBookmarksUpdated={refreshBookmarks}
                    onOpenInstallModal={() => setShowInstallModal(true)}
                  />
                )}

                {currentTab === 'quran' && (
                  <QuranScreen
                    initialSurahNumber={readerSurahNumber}
                    initialAyahNumber={readerAyahNumber}
                    onClearInitialState={() => {
                      setReaderAyahNumber(undefined);
                      refreshLastRead();
                    }}
                    onBookmarksUpdated={refreshBookmarks}
                  />
                )}

                {currentTab === 'bookmarks' && (
                  <BookmarksScreen
                    bookmarks={bookmarks}
                    onOpenAyah={(surah, ayah) => {
                      handleOpenSurah(surah, ayah);
                      refreshLastRead();
                    }}
                    onBookmarksChange={setBookmarks}
                    onExploreQuran={() => {
                      setCurrentTab('quran');
                      setReaderSurahNumber(undefined);
                      setReaderAyahNumber(undefined);
                    }}
                  />
                )}

                {currentTab === 'more' && (
                  <MoreScreen
                    onOpenDuas={() => setActiveSubScreen('duas')}
                    onOpenTasbeeh={() => setActiveSubScreen('tasbeeh')}
                    onOpenSettings={() => setActiveSubScreen('settings')}
                    onOpenInstallModal={() => setShowInstallModal(true)}
                  />
                )}
              </>
            )}
          </main>

          {/* Global Floating Recitation Player Bar */}
          <AudioPlayerBar
            onOpenSurah={(surahNum, ayahNum) => {
              handleOpenSurah(surahNum, ayahNum);
            }}
          />

          {/* Bottom Tab Navigation */}
          <BottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              setActiveSubScreen(null);
              refreshLastRead();
            }}
            bookmarksCount={bookmarks.length}
          />

          {/* Android APK & PWA Installation Modal */}
          <InstallAppModal
            isOpen={showInstallModal}
            onClose={() => setShowInstallModal(false)}
          />
        </div>
      </AudioProvider>
    </AuthProvider>
  );
}
