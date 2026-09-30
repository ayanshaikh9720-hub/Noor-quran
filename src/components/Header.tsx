import React from 'react';
import { Search, Settings, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  currentTheme: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenSettings,
  currentTheme,
  onToggleTheme
}) => {
  const { user, loginWithGoogle } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-tight text-emerald-900 dark:text-emerald-400">
            Noor Quran
          </span>
        </div>

        {/* Zone 2 & 3: Functional interactive affordances */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSearch}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Search Quran"
            aria-label="Search Quran"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleTheme}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {currentTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile / Google Sign-In */}
          {user ? (
            <button
              onClick={onOpenSettings}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Signed in as ${user.displayName || user.email}`}
              aria-label="Account Settings"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full border border-emerald-500 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Sign in with Google to sync bookmarks"
              aria-label="Sign In with Google"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
