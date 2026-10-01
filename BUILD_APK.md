# Build the Android app

1. Deploy the server (README → Production deployment) and copy its https URL.
2. In this folder run:
   npm install
   node set-server-url.js https://your-app.onrender.com
3. Open the `android/` folder in Android Studio (it creates local.properties itself).
4. Build → Build Bundle(s) / APK(s) → Build APK(s).
   The file is android/app/build/outputs/apk/debug/app-debug.apk. Copy it to a phone and install.
5. For Play Store: Build → Generate Signed Bundle / APK.

If you change the server URL later, run step 2 again and rebuild.
Frontend and server updates need no new APK, since the app loads your live site.
