import React, { useState } from 'react';
import { AppSettings, TranslationLanguage, ArabicFontFamily } from '../types/quran';
import { saveStoredSettings, clearAllLocalData } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Monitor, Trash2, Shield, Info, BookOpen, Volume2, Check, Cloud, LogIn, LogOut, Sparkles } from 'lucide-react';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onDataCleared: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onDataCleared
}) => {
  const [clearedNotice, setClearedNotice] = useState(false);
  const { user, loginWithGoogle, logout, syncLocalBookmarksToCloud } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const update = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    onUpdateSettings(updated);
    saveStoredSettings(updated);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncLocalBookmarksToCloud();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all reading history, cached Surahs, and bookmarks from this device?')) {
      clearAllLocalData();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
      onDataCleared();
    }
  };

  return (
    <div className="pb-28 pt-2 px-3 max-w-lg mx-auto space-y-5">
      <div className="space-y-0.5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          App Settings
        </h2>
        <p className="text-xs text-slate-500">
          Personalize reading typography, translations, and theme
        </p>
      </div>

      {clearedNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Local cache and storage have been cleared successfully.</span>
        </div>
      )}

      {/* Section 0: Firebase Account & Cloud Sync */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cloud Sync & Account (Firebase)</span>
          </h3>
          {user && (
            <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Connected
            </span>
          )}
        </div>

        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Profile'}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-emerald-500 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.displayName || 'Muslim Reader'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {user.email}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your bookmarks, reading position, and Tasbeeh counts are securely synced to Firebase Firestore across all your devices.
            </p>

            <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex-1 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <button
                onClick={logout}
                className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sign in with your Google account to automatically backup and sync your Quran bookmarks and reading progress to Firebase across all your devices.
            </p>
            <button
              onClick={loginWithGoogle}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Section 1: Appearance & Theme */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Theme Mode
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor }
          ].map((themeOpt) => {
            const Icon = themeOpt.icon;
            const isSelected = settings.theme === themeOpt.id;
            return (
              <button
                key={themeOpt.id}
                onClick={() => update({ theme: themeOpt.id as 'light' | 'dark' | 'system' })}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span>{themeOpt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Reading & Typography */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Quran Reading Display
        </h3>

        {/* Translation Language */}
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
            Default Translation Language
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['both', 'hi', 'en'] as TranslationLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => update({ translationLanguage: lang })}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  settings.translationLanguage === lang
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {lang === 'both' ? 'Both (हि/En)' : lang === 'hi' ? 'Hindi Only' : 'English Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Arabic Font Family */}
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
            Arabic Script Font
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'amiri', name: 'Amiri (مصحف المدينة)', styleClass: 'font-arabic' },
              { id: 'scheherazade', name: 'Scheherazade New', styleClass: 'font-scheherazade' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => update({ arabicFont: f.id as ArabicFontFamily })}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  settings.arabicFont === f.id
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className={`${f.styleClass} text-base mb-0.5`}>بِسْمِ ٱللَّٰهِ</div>
                <div>{f.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Arabic Font Size */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            <span>Arabic Text Size</span>
            <span className="font-mono text-emerald-600 font-bold">{settings.arabicFontSize}px</span>
          </div>
          <input
            type="range"
            min="22"
            max="42"
            step="2"
            value={settings.arabicFontSize}
            onChange={(e) => update({ arabicFontSize: parseInt(e.target.value, 10) })}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Translation Font Size */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            <span>Translation Text Size</span>
            <span className="font-mono text-emerald-600 font-bold">{settings.translationFontSize}px</span>
          </div>
          <input
            type="range"
            min="13"
            max="22"
            step="1"
            value={settings.translationFontSize}
            onChange={(e) => update({ translationFontSize: parseInt(e.target.value, 10) })}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Section 3: Audio & Interaction Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Audio & Feedback
        </h3>

        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Auto-Scroll to Playing Ayah
            </div>
            <div className="text-[11px] text-slate-500">
              Keep the active recitation verse in view automatically
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoScrollAyah}
            onChange={(e) => update({ autoScrollAyah: e.target.checked })}
            className="w-5 h-5 accent-emerald-600 rounded-sm cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Tasbeeh Vibration
            </div>
            <div className="text-[11px] text-slate-500">
              Haptic feedback on every bead tap and completion
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.vibrateOnTasbeeh}
            onChange={(e) => update({ vibrateOnTasbeeh: e.target.checked })}
            className="w-5 h-5 accent-emerald-600 rounded-sm cursor-pointer"
          />
        </div>
      </div>

      {/* Section 4: Data Management & Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Data Management
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Clear Local Data & Cache
            </div>
            <div className="text-[11px] text-slate-500">
              Resets bookmarks, reading position, and offline cache
            </div>
          </div>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 font-semibold text-xs rounded-xl flex items-center gap-1 active:scale-95 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Section 5: Sources & Legal Information */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          About Noor Quran & Sources
        </h3>

        <div className="space-y-1.5 leading-relaxed">
          <p>
            <strong>Arabic Quran Text:</strong> Pure Uthmani script from the King Fahd Quran Complex standard, delivered through the open-access AlQuran Cloud API.
          </p>
          <p>
            <strong>Hindi Translation:</strong> Maulana Suhel Farooq Khan & Maulana Saifur Rahman Nadwi, widely recognized Hindi scholarly translation.
          </p>
          <p>
            <strong>English Translation:</strong> Sahih International.
          </p>
          <p>
            <strong>Audio Recitation:</strong> Qari Mishary Rashid Alafasy via Islamic Network open CDN.
          </p>
          <p>
            <strong>Privacy Policy:</strong> Noor Quran respects your privacy. All your reading history, bookmarks, and Tasbeeh counts are stored locally on your device. No user tracking or analytics data is sold or shared.
          </p>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Noor Quran · Production-ready Muslim Companion App · May Allah accept this humble effort.
          </p>
        </div>
      </div>
    </div>
  );
};
