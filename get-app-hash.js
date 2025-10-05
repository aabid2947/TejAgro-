/**
 * Script to generate Android App Hash for SMS Retriever API
 * Run this with: node get-app-hash.js
 */

const crypto = require('crypto');

// Your actual package name from android/app/build.gradle
const PACKAGE_NAME = 'com.tejagroapp';

// You need to get your app's signing certificate SHA256 fingerprint
// Run this command in your terminal to get it:
// keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android

// SHA256 fingerprint from debug keystore (without colons)
const SHA256_CERT_FINGERPRINT = 'FAC61745DC0903786FB9EDE62A962B399F7348F0BB6F899B83326675910033B9C';

function generateAppHash() {
    if (SHA256_CERT_FINGERPRINT === 'YOUR_SHA256_FINGERPRINT_HERE') {
        console.log('❌ Please update the SHA256_CERT_FINGERPRINT in this script first!');
        console.log('\n📝 Steps to get your SHA256 fingerprint:');
        console.log('1. Run: keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android');
        console.log('2. Copy the SHA256 fingerprint (remove colons)');
        console.log('3. Update SHA256_CERT_FINGERPRINT in this script');
        console.log('4. Run this script again');
        return;
    }

    const appInfo = PACKAGE_NAME + ' ' + SHA256_CERT_FINGERPRINT;
    const hash = crypto.createHash('sha256').update(appInfo).digest('base64');
    const appHash = hash.substring(0, 11);
    
    console.log('✅ App Hash generated successfully!');
    console.log('📱 Package Name:', PACKAGE_NAME);
    console.log('🔐 App Hash:', appHash);
    console.log('\n📋 Use this hash in your SMS templates and server configuration.');
}

generateAppHash();