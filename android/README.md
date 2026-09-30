# Noor Quran - Native Android Project

This directory contains the complete, production-ready native Android project for **Noor Quran** (`com.noorquran.app`).

---

## 3 Free Ways to Build the Standalone `.apk` File

### Method 1: Using Android Studio (100% Free & Visual)
1. Download & open [Android Studio](https://developer.android.com/studio) (free).
2. Click **File → Open**, and select the `android` folder in this repository.
3. Wait 1–2 minutes for Gradle to sync dependencies.
4. Go to the top menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. When complete, a notification will appear at the bottom right: click **"locate"** to find your compiled `app-release.apk` (or `app-debug.apk`) file!

---

### Method 2: Free Cloud Build with GitHub Actions (No Local Software Needed)
A pre-configured GitHub Actions workflow is located at `.github/workflows/build-apk.yml`.
1. Push this repository to your GitHub account.
2. Go to your GitHub repository's **"Actions"** tab.
3. Select **"Build Android APK"** and click **"Run workflow"**.
4. GitHub's free runners will install JDK 17 + Android SDK, build the APK, and upload the signed `.apk` file under the **Artifacts** section for you to download instantly!

---

### Method 3: Command Line (Linux / macOS / Windows Terminal)
If you have JDK 17 and Android SDK installed on your machine:
```bash
cd android
./gradlew assembleRelease
```
The output APK will be placed in:
`android/app/build/outputs/apk/release/app-release.apk`

---

## Project Structure
- `app/src/main/AndroidManifest.xml`: Android application manifest with Internet, Wake Lock, and Vibration permissions.
- `app/src/main/java/com/noorquran/app/MainActivity.java`: Hardware-accelerated WebView activity with hardware back button routing, offline caching, and audio playback persistence.
- `app/src/main/res/`: Full launcher icons (`ic_launcher.png`, `ic_launcher_round.png`) across all screen densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi).
