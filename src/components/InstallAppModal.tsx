import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, Check, ExternalLink, HelpCircle, Shield, Share2 } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'apk' | 'ios'>('android');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        setInstallSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Install Noor Quran
              </h3>
              <p className="text-[11px] text-slate-500">
                Android APK & Mobile Installation Guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'android'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Android WebAPK
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'apk'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Standalone APK
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'ios'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            iOS (iPhone)
          </button>
        </div>

        {/* Tab 1: Android Instant WebAPK (Recommended) */}
        {activeTab === 'android' && (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Instant Android App Installation (Zero Download)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                Android natively converts <strong>Noor Quran</strong> into an installed <strong>WebAPK</strong> application with its own launcher icon, splash screen, and offline capabilities without needing third-party APK installers.
              </p>
            </div>

            {isInstalled ? (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-center font-semibold text-emerald-800 dark:text-emerald-200">
                ✓ Noor Quran is already installed on this device!
              </div>
            ) : isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{installSuccess ? 'Installed Successfully!' : 'Install on Android Now'}</span>
              </button>
            ) : (
              <div className="space-y-2.5 pt-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  How to install in Chrome / Edge / Brave on Android:
                </div>
                <ol className="space-y-2 pl-4 list-decimal text-[11px] leading-relaxed">
                  <li>
                    Open this app in Chrome on your Android device.
                  </li>
                  <li>
                    Tap the <strong>Menu</strong> icon (3 vertical dots <strong>⋮</strong> in the top-right corner).
                  </li>
                  <li>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    Tap <strong>"Install"</strong>. Android will build and add Noor Quran to your app drawer and home screen like any Play Store app!
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Standalone .APK File Generation */}
        {activeTab === 'apk' && (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p className="text-[11px] leading-relaxed">
              To download a standalone <strong>.APK</strong> (for sideloading) or <strong>.AAB</strong> (for Google Play Store upload), use Microsoft & Google's official PWA packaging service:
            </p>

            <a
              href="https://www.pwabuilder.com?url=https://ais-pre-beaaqpharvbnvdere5qukd-264000692064.asia-southeast1.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download APK / AAB from PWABuilder</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-[11px]">
              <div className="text-slate-800 dark:text-slate-200 font-semibold">
                How to download in 3 steps:
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Click the button above to open PWABuilder with this app pre-loaded.</li>
                <li>Click <strong>"Package for Android"</strong>.</li>
                <li>Click <strong>"Generate"</strong> to immediately download your <strong>.apk</strong> or Google Play <strong>.aab</strong> file!</li>
              </ol>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2 font-mono text-[11px]">
              <div className="text-slate-500 font-sans text-xs font-semibold">
                Alternative: Google CLI (Bubblewrap)
              </div>
              <div className="bg-slate-900 text-emerald-400 p-2 rounded-lg select-all">
                npm i -g @bubblewrap/cli<br/>
                bubblewrap init --manifest=https://ais-pre-beaaqpharvbnvdere5qukd-264000692064.asia-southeast1.run.app/manifest.webmanifest<br/>
                bubblewrap build
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: iOS (iPhone / iPad) */}
        {activeTab === 'ios' && (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Install on iPhone or iPad:
            </div>
            <ol className="space-y-2.5 pl-4 list-decimal text-[11px] leading-relaxed">
              <li>
                Open <strong>Noor Quran</strong> in <strong>Safari</strong> on your iPhone or iPad.
              </li>
              <li>
                Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> (the box with an upward arrow at the bottom of the screen).
              </li>
              <li>
                Scroll down and tap <strong>"Add to Home Screen"</strong>.
              </li>
              <li>
                Tap <strong>"Add"</strong> in the top-right corner. The Noor Quran icon will now appear on your iPhone home screen!
              </li>
            </ol>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
