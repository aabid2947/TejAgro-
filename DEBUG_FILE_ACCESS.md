# TejAgro Debug File Access Guide

## For Users

### How to Find Debug Files

When you encounter login issues, the app automatically saves debug files to help developers fix the problem.

#### File Location
- **Android**: Files are saved in your `Downloads` folder
- **File Name**: `TejAgro_Debug_[timestamp].txt`

#### How to Access
1. Open your **File Manager** app
2. Navigate to **Downloads** folder
3. Look for files starting with `TejAgro_Debug_`
4. The newest file will have the most recent timestamp

#### How to Share with Developers
1. Find the debug file in Downloads folder
2. Long press on the file
3. Select **Share**
4. Choose your preferred method (Email, WhatsApp, etc.)
5. Send to the developer or support team

### What Information is Included
- Device information (model, OS version, etc.)
- Login attempt details
- Error messages and stack traces
- Network response details
- Timestamps for all events

**Note**: Phone numbers are partially masked for privacy (only last 4 digits shown)

### File Management
- Files are automatically created during login issues
- Each file is timestamped for easy identification
- You can safely delete old debug files if needed

---

## For Developers

### Implementation Details

#### Automatic File Creation
- Debug files are automatically created in the Downloads directory
- Files use timestamp naming: `TejAgro_Debug_YYYY-MM-DDTHH-MM-SS.txt`
- Toast notifications inform users when files are saved

#### File Structure
```
=== TejAgro Debug Report ===
Generated: [ISO timestamp]
Platform: android/ios
File Location: [full path]
Note: This file can be found in your Downloads folder...

=== Debug Logs ===
[Chronological log entries with timestamps]
```

#### Key Features
- **Silent Operation**: No UI buttons, automatic background logging
- **User Accessible**: Files saved to Downloads folder
- **Privacy Protected**: Phone numbers masked
- **Comprehensive**: Device info, API calls, errors, navigation
- **Toast Feedback**: User notified of successful saves

#### Storage Strategy
- **Primary**: AsyncStorage for app-internal logging
- **Secondary**: External file system for user access
- **Fallback**: Console logging if file operations fail

### Technical Implementation
- Uses `react-native-fs` for external file access
- Requires `WRITE_EXTERNAL_STORAGE` permission
- Falls back gracefully if file operations fail
- Maintains backward compatibility with AsyncStorage
