/**
 * ANDROID MANIFEST CONFIGURATION FOR FCM NOTIFICATIONS
 * 
 * Add these entries to your android/app/src/main/AndroidManifest.xml file
 */

/*
===========================================
1. ADD PERMISSIONS (Place before <application> tag)
===========================================

<!-- Internet permission for FCM -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Notification permissions -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.VIBRATE" />

<!-- Android 13+ notification permission (automatically added by RN Firebase) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Optional: Scheduled notifications -->
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />

===========================================
2. FIREBASE MESSAGING SERVICE (Inside <application> tag)
===========================================

<application
    android:name=".MainApplication"
    android:allowBackup="false"
    android:theme="@style/AppTheme">
    
    <!-- Firebase Messaging Service for background notifications -->
    <service
        android:name="io.invertase.firebase.messaging.RNFirebaseBackgroundService"
        android:exported="false" />
        
    <!-- Default Firebase notification icon -->
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_icon"
        android:resource="@drawable/ic_notification" />
        
    <!-- Default Firebase notification color -->
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_color"
        android:resource="@color/notification_color" />
        
    <!-- Default Firebase notification channel (Android 8+) -->
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_channel_id"
        android:value="fcm_default_channel" />
        
    <!-- Disable auto initialization (optional) -->
    <meta-data
        android:name="firebase_messaging_auto_init_enabled"
        android:value="true" />
        
    <!-- Your main activity -->
    <activity
        android:name=".MainActivity"
        android:exported="true"
        android:launchMode="singleTop"
        android:theme="@style/LaunchTheme">
        
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
        
        <!-- Handle notification taps -->
        <intent-filter>
            <action android:name="FLUTTER_NOTIFICATION_CLICK" />
            <category android:name="android.intent.category.DEFAULT" />
        </intent-filter>
        
    </activity>
    
</application>

===========================================
3. NOTIFICATION ICON SETUP
===========================================

Create notification icon files in:
android/app/src/main/res/drawable/

Required files:
- ic_notification.png (24x24dp)
- For different densities: drawable-hdpi, drawable-mdpi, drawable-xhdpi, drawable-xxhdpi, drawable-xxxhdpi

Icon Requirements:
- Must be white/transparent PNG
- Should be simple, recognizable design
- 24x24dp base size

===========================================
4. NOTIFICATION COLOR SETUP
===========================================

Create file: android/app/src/main/res/values/colors.xml

<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="notification_color">#FF6200EE</color>
</resources>

===========================================
5. NOTIFICATION CHANNEL SETUP (RECOMMENDED)
===========================================

For better notification management, you can create custom notification channels.
Add this to your MainActivity.java or MainActivity.kt:

// MainActivity.java
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    createNotificationChannel();
}

private void createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        NotificationChannel channel = new NotificationChannel(
            "fcm_default_channel",
            "TejAgro Notifications",
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Important updates about your farming activities");
        channel.enableLights(true);
        channel.enableVibration(true);
        
        NotificationManager manager = getSystemService(NotificationManager.class);
        manager.createNotificationChannel(channel);
    }
}

===========================================
6. PROGUARD RULES (if using ProGuard)
===========================================

Add to android/app/proguard-rules.pro:

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# React Native Firebase
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

===========================================
7. TROUBLESHOOTING CHECKLIST
===========================================

If notifications still don't work:

✅ Verify google-services.json is in android/app/
✅ Check Firebase console - project has FCM enabled
✅ Ensure SHA-1 fingerprint is added to Firebase
✅ Test on real device (not emulator)
✅ Check device notification settings
✅ Verify app is not in battery optimization
✅ Test with app in background/foreground/killed states
✅ Check Android version compatibility

Debug Commands:
adb logcat | grep -i firebase
adb logcat | grep -i fcm
adb logcat | grep -i notification

===========================================
8. TESTING NOTIFICATION PAYLOAD
===========================================

Use Firebase Console Test Message or this cURL:

curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "FCM_TOKEN_HERE",
    "notification": {
      "title": "Test Notification",
      "body": "This is a test from TejAgro",
      "icon": "ic_notification",
      "color": "#FF6200EE"
    },
    "data": {
      "type": "test",
      "action": "open_app"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "fcm_default_channel",
        "sound": "default",
        "vibrate_timings": ["0.0s", "0.25s", "0.25s", "0.25s"]
      }
    }
  }'

*/

export default {};