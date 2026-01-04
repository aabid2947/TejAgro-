import messaging, { getMessaging } from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import firestore, { getFirestore } from '@react-native-firebase/firestore';
import { NotificationUtils } from './NotificationUtils.ts';
import * as ROUTES from '../routes/Routes';

// Define navigation reference type
type NavigationRef = {
  navigate: (name: string, params?: any) => void;
  isReady: () => boolean;
};

interface FCMError {
  code: string;
  message: string;
}

export class FCMUtils {
  private static fcmToken: string | null = null;
  private static isFirebaseReady: boolean = false;
  private static navigationRef: NavigationRef | null = null;
  
  /**
   * Set navigation reference for handling notification navigation
   */
  static setNavigationRef(ref: NavigationRef): void {
    this.navigationRef = ref;
    console.log('📏 Navigation reference set for FCM navigation');
  }
  
  /**
   * Navigate to a specific screen
   */
  private static navigateToScreen(screenName: string, params?: any): void {
    if (this.navigationRef && this.navigationRef.isReady()) {
      console.log(`🗺️ Navigating to ${screenName}`, params ? `with params: ${JSON.stringify(params)}` : '');
      this.navigationRef.navigate(screenName, params);
    } else {
      console.warn('⚠️ Navigation not ready, cannot navigate to:', screenName);
      // Store navigation intent for later - retry quickly
      setTimeout(() => this.navigateToScreen(screenName, params), 100);
    }
  }

  /**
   * Check if Firebase services are available
   */
  private static async checkFirebaseAvailability(): Promise<boolean> {
    try {
      // Check if Google Play Services are available (Android)
      if (Platform.OS === 'android') {
        const isAvailable = await messaging().hasPermission();
        return isAvailable !== messaging.AuthorizationStatus.NOT_DETERMINED;
      }
      return true; // iOS should work if Firebase is configured
    } catch (error) {
      console.error('Firebase availability check failed:', error);
      return false;
    }
  }

  /**
   * Initialize FCM and request permissions
   */
  static async initialize(): Promise<void> {
    try {
      console.log('🔥 Initializing FCM services...');

      // Check Firebase availability first
      const isAvailable = await this.checkFirebaseAvailability();
      if (!isAvailable) {
        console.warn('⚠️ Firebase services not available - FCM disabled');
        return;
      }

      this.isFirebaseReady = true;
      console.log('✅ Firebase services available');

      await this.requestUserPermission();
      await this.setupMessageHandlers();
      await this.checkInitialNotification();

      await this.subscribeToTopic('all_user');

      console.log('🔥 FCM initialization completed successfully');
    } catch (error) {
      console.error('❌ FCM initialization error:', error);
      this.handleFCMError(error as FCMError);
    }
  }

  /**
   * Handle FCM-specific errors
   */
  private static handleFCMError(error: FCMError): void {
    console.error('FCM Error Details:', {
      code: error.code,
      message: error.message,
      platform: Platform.OS
    });

    switch (error.code) {
      case 'messaging/service-not-available':
        console.warn('🚨 Google Play Services not available. FCM will not work.');
        // Could show user-friendly message about updating Google Play Services
        break;
      case 'messaging/registration-token-not-registered':
        console.warn('🚨 FCM registration token is invalid. Will retry...');
        // Token might be invalid, try to get a new one
        setTimeout(() => this.getFCMToken(), 5000);
        break;
      case 'messaging/unknown':
        if (error.message.includes('SERVICE_NOT_AVAILABLE')) {
          console.warn('🚨 Firebase services temporarily unavailable. Will retry...');
          // Retry after delay
          setTimeout(() => this.initialize(), 10000);
        }
        break;
      default:
        console.error('🚨 Unknown FCM error:', error);
    }
  }

  /**
   * Request notification permissions and get FCM token
   */
  static async requestUserPermission(): Promise<boolean> {
    try {
      if (!this.isFirebaseReady) {
        console.warn('⚠️ Firebase not ready, skipping permission request');
        return false;
      }

      console.log('📱 Requesting notification permissions...');

      // For Android - Request multiple notification-related permissions
      if (Platform.OS === 'android') {
        // Android 13+ requires POST_NOTIFICATIONS permission
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('❌ POST_NOTIFICATIONS permission denied');
            Alert.alert(
              'Notification Permission Required',
              'Please enable notifications to receive important updates about your orders and farming tips.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Settings', 
                  onPress: () => {
                    console.log('User should go to Settings > Apps > TejAgro > Notifications');
                  }
                }
              ]
            );
            return false;
          }
          console.log('✅ Android POST_NOTIFICATIONS permission granted');
        }
      }

      // Request Firebase messaging permission
      const authStatus = await messaging().requestPermission({
        sound: true,
        announcement: true,
        alert: true,
        badge: true,
        carPlay: true,
        criticalAlert: true,
        provisional: false, // Set to true for iOS provisional notifications
      });

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('✅ Firebase notification permission granted. Status:', authStatus);
        await this.getFCMToken();
        return true;
      } else {
        console.log('❌ Firebase notification permission denied. Status:', authStatus);
        
        // Show user-friendly message
        Alert.alert(
          'Notifications Disabled',
          'You will not receive important updates about your orders. You can enable notifications in your device settings.',
          [{ text: 'OK', style: 'default' }]
        );
        return false;
      }
    } catch (error) {
      console.error('❌ Permission request error:', error);
      this.handleFCMError(error as FCMError);
      return false;
    }
  }

  /**
   * Get and store FCM token
   */
  static async getFCMToken(clientId?: string, retryCount: number = 0): Promise<string | null> {
    try {
      if (!this.isFirebaseReady) {
        console.warn('⚠️ Firebase not ready, cannot get FCM token');
        return null;
      }

      console.log('🔑 Getting FCM token...');

      // Register device for remote messages (iOS requirement)
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
        console.log('📱 iOS device registered for remote messages');
      }

      // Add a small delay for Android to ensure services are ready
      if (Platform.OS === 'android' && retryCount === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const token = await messaging().getToken();
      if (token) {
        this.fcmToken = token;
        console.log('✅ FCM Token obtained:', token.substring(0, 20) + '...');

        // Save token to Firestore if clientId is available
        if (clientId) {
          await this.saveFCMTokenToFirestore(token, clientId);
        }

        return token;
      } else {
        console.warn('⚠️ No FCM token received');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Error getting FCM token:', error);

      // Retry logic for SERVICE_NOT_AVAILABLE errors
      const isServiceError = error?.message?.includes('SERVICE_NOT_AVAILABLE') || 
                             error?.message?.includes('INTERNAL_SERVER_ERROR') ||
                             error?.code === 'messaging/unknown';

      if (retryCount < 5 && isServiceError) {
        const delay = Math.min(3000 * Math.pow(2, retryCount), 15000); // Exponential backoff
        console.log(`🔄 Retrying FCM token request in ${delay/1000} seconds... (attempt ${retryCount + 1}/5)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getFCMToken(clientId, retryCount + 1);
      }

      this.handleFCMError(error as FCMError);
      return null;
    }
  }

  /**
   * Save FCM token to Firestore
   */
  static async saveFCMTokenToFirestore(token: string, clientId: string): Promise<void> {
    try {
      console.log(`💾 Saving FCM token to Firestore for client: ${clientId}`);

      const fcmTokenData = {
        fcmToken: token,
        clientId: clientId,
       
        deviceInfo: {
          os: Platform.OS,
          version: Platform.Version,
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
 
      };

      // Save to fcm_tokens/{client_id} document
      await firestore()
        .collection('fcm_tokens')
        .doc(clientId)
        .set(fcmTokenData, { merge: true });

      console.log('✅ FCM token saved to Firestore successfully for client:', clientId);
    } catch (error: any) {
      console.error('❌ Error saving FCM token to Firestore:', error);

      if (error.code === 'firestore/permission-denied') {
        console.warn('🔒 Firestore permission denied. Please update security rules:');
        console.warn(`
📋 Required Firestore Rules:
match /fcm_tokens/{clientId} {
  allow read, write: if request.auth != null;
}
`);
        console.warn('🔧 Alternative: Save FCM token via your backend API instead');
      }

      // Don't throw here - FCM can work without Firestore
      // The app should continue functioning even if token storage fails
    }
  }

  /**
   * Setup message handlers for all app states
   */
  static async setupMessageHandlers(): Promise<void> {
    try {
      if (!this.isFirebaseReady) {
        console.warn('⚠️ Firebase not ready, skipping message handlers setup');
        return;
      }

      console.log('📨 Setting up FCM message handlers...');

      // Foreground message handler
      messaging().onMessage(async (remoteMessage) => {
        console.log('📨 Foreground message received:', remoteMessage);

        // Display local notification when app is in foreground
        if (remoteMessage.notification) {
          await NotificationUtils.displayLocalNotification({
            title: remoteMessage.notification.title || 'New Message',
            body: remoteMessage.notification.body || '',
            data: remoteMessage.data || {},
          });
        }

        // Handle data payload
        if (remoteMessage.data) {
          this.handleDataPayload(remoteMessage.data);
        }
      });

      // Background/Quit message handler
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('📨 Background message received:', remoteMessage);

        // Process data payload silently
        if (remoteMessage.data) {
          this.handleDataPayload(remoteMessage.data);
        }

        // Note: Notification payload is automatically displayed by FCM
        // when app is in background/quit state
      });

      // Token refresh handler
      messaging().onTokenRefresh(async (token) => {
        console.log('🔄 FCM token refreshed:', token.substring(0, 20) + '...');
        this.fcmToken = token;
        // Token will be saved when client_id becomes available
        console.log('🔄 FCM token refreshed, will save when client_id is available');
      });

      console.log('✅ FCM message handlers setup completed');
    } catch (error) {
      console.error('❌ Error setting up FCM message handlers:', error);
      this.handleFCMError(error as FCMError);
    }
  }

  /**
   * Handle data payload from notifications
   */
  static handleDataPayload(data: { [key: string]: string | object }): void {
    console.log('📨 Processing notification data:', data);

    // Convert data to string format for processing
    const processedData: { [key: string]: string } = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      processedData[key] = typeof value === 'string' ? value : JSON.stringify(value);
    });

    const { type, action, id, url, redirect_to, clientId } = processedData;

    // Handle screen redirection first (highest priority)
    if (redirect_to) {
      this.handleScreenRedirect(redirect_to, processedData);
      return;
    }

    // Handle specific notification types
    switch (type) {
      case 'test_event':
        this.handleTestEvent(processedData);
        break;
      case 'order_update':
        this.handleOrderUpdate(id, processedData);
        break;
      case 'product_offer':
        this.handleProductOffer(id, processedData);
        break;
      case 'chat_message':
        this.handleChatMessage(id || clientId, processedData);
        break;
      case 'deep_link':
        this.handleDeepLink(url, processedData);
        break;
      case 'lucky_draw':
        this.handleLuckyDraw(processedData);
        break;
      case 'promo_offer':
        this.handlePromoOffer(processedData);
        break;
      default:
        console.log('🤷 Unknown notification type:', type);
        // Try to handle as generic navigation
        if (action === 'navigate' && redirect_to) {
          this.handleScreenRedirect(redirect_to, processedData);
        }
    }
  }

  /**
   * Check for initial notification when app is opened from quit state
   */
  static async checkInitialNotification(): Promise<void> {
    try {
      if (!this.isFirebaseReady) {
        console.warn('⚠️ Firebase not ready, skipping initial notification check');
        return;
      }

      console.log('🔍 Checking for initial notification...');

      const remoteMessage = await messaging().getInitialNotification();

      if (remoteMessage) {
        console.log('📨 App opened from notification (quit state):', remoteMessage);

        // Handle the notification that opened the app
        if (remoteMessage.data) {
          this.handleDataPayload(remoteMessage.data);
        }
      } else {
        console.log('📭 No initial notification found');
      }
    } catch (error) {
      console.error('❌ Error checking initial notification:', error);
      this.handleFCMError(error as FCMError);
    }
  }

  /**
   * Handle notification tap when app is in background
   */
  static setupNotificationOpenHandler(): void {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background:', remoteMessage);

      // Handle the notification tap
      if (remoteMessage.data) {
        this.handleDataPayload(remoteMessage.data);
      }
    });
  }


  static async subscribeToTopic(topicName: string): Promise<void> {
    try {
      if (!this.isFirebaseReady) {
        console.warn('⚠️ Firebase not ready, skipping topic subscription');
        return;
      }
      
      await messaging().subscribeToTopic(topicName);
      console.log(`✅ Device subscribed to topic: ${topicName}`);
    } catch (error) {
      console.error(`❌ Error subscribing to topic: ${topicName}`, error);
      this.handleFCMError(error as FCMError);
    }
  }

  /**
   * Check if notifications are currently enabled
   */
  static async areNotificationsEnabled(): Promise<boolean> {
    try {
      const authStatus = await messaging().hasPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error('❌ Error checking notification status:', error);
      return false;
    }
  }

  /**
   * Get current FCM token
   */
  static getCurrentToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Update FCM token with client ID (call after user logs in)
   */
  static async updateFCMTokenWithClientId(clientId: string): Promise<void> {
    try {
      if (this.fcmToken) {
        await this.saveFCMTokenToFirestore(this.fcmToken, clientId);
      } else {
        // If no token yet, get it and save
        await this.getFCMToken(clientId);
      }
    } catch (error) {
      console.error('Error updating FCM token with client ID:', error);
    }
  }

  /**
   * Delete FCM token (useful for logout)
   */
  static async deleteToken(clientId?: string): Promise<void> {
    try {
      await messaging().deleteToken();

      // Also remove from Firestore if clientId is provided
      if (clientId) {
        try {
          await firestore()
            .collection('fcm_tokens')
            .doc(clientId)
            .update({
              isActive: false,
              deletedAt: firestore.FieldValue.serverTimestamp()
            });
          console.log('✅ FCM token marked as inactive in Firestore');
        } catch (firestoreError: any) {
          console.warn('⚠️ Could not update Firestore token status:', firestoreError.message);
          // Continue even if Firestore update fails
        }
      }

      this.fcmToken = null;
      console.log('✅ FCM token deleted from device');
    } catch (error) {
      console.error('❌ Error deleting FCM token:', error);
    }
  }

  /**
   * Manually request notification permissions (call from settings screen)
   */
  static async requestNotificationPermissions(): Promise<boolean> {
    try {
      console.log('🔔 Manually requesting notification permissions...');
      
      const isEnabled = await this.areNotificationsEnabled();
      if (isEnabled) {
        console.log('✅ Notifications already enabled');
        return true;
      }
      
      return await this.requestUserPermission();
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Handle screen redirection from notifications
   */
  private static handleScreenRedirect(screenName: string, data: { [key: string]: string }): void {
    console.log('🎯 Handling screen redirect to:', screenName);
    
    // Map notification screen names to actual route constants
    const screenMappings: { [key: string]: string } = {
      'CHAT_SCREEN': ROUTES.CHAT_SCREEN,
      'HOME_SCREEN': ROUTES.HOME_SCREEN,
      'ORDER_SCREEN': ROUTES.ORDER_SCREEN,
      'CART_SCREEN': ROUTES.MYCART_SCREEN,
      'PRODUCT_SCREEN': ROUTES.PRODUCT_SCREEN,
      'OFFER_SCREEN': ROUTES.OFFER_SCREEN,
      'PROFILE_SCREEN': ROUTES.MY_PROFILE,
      'NOTIFICATION_SCREEN': ROUTES.NOTIFICATION_SCREEN,
      'KRISHI_CHARCHA_SCREEN': ROUTES.KRISHI_CHARCHA_SCREEN,
      'REFER_EARN_SCREEN': ROUTES.REFER_EARN_SCREEN,
      'LUCKY_DRAW_WINNERS_SCREEN': ROUTES.LUCKY_DRAW_WINNERS_SCREEN,
      // YouTube Videos Screen mappings - Direct navigation to standalone screen
      'YouTubeVideosScreen': ROUTES.YOUTUBE_SCREEN,
      'YOUTUBE_SCREEN': ROUTES.YOUTUBE_SCREEN,
      'VIDEOS_SCREEN': ROUTES.YOUTUBE_SCREEN, // Direct to YouTube screen, not tab
      // Additional screen mappings
      'TAB_SCREEN': ROUTES.TAB_SCREEN,
      'CHECKOUT_SCREEN': ROUTES.CHECKOUT_SCREEN,
      'SHIPPING_ADDRESS_SCREEN': ROUTES.SHIPPING_ADDRESS_SCREEN,
      'ORDER_DETAIL_SCREEN': ROUTES.ORDER_DETAIL_SCREEN,
      'PROMO_CODE_SCREEN': ROUTES.PROMO_CODE_SCREEN,
      'CREATE_POST_SCREEN': ROUTES.CREATE_POST_SCREEN,
      'POST_DETAILS_SCREEN': ROUTES.POST_DETAILS_SCREEN,
      'CHAT_CONVERSATION_SCREEN': ROUTES.CHAT_CONVERSATION_SCREEN,
    };
    
    const targetScreen = screenMappings[screenName] || screenName;
    const params: { [key: string]: any } = {
      fromNotification: true,
      notificationData: data
    };
    
    // Add specific params based on screen type
    if (data.id) params.id = data.id;
    if (data.orderId) params.orderId = data.orderId;
    if (data.productId) params.productId = data.productId;
    
    console.log(`🚀 Navigating directly to: ${targetScreen}`);
    this.navigateToScreen(targetScreen, params);
  }
  
  /**
   * Handle test event notifications
   */
  private static handleTestEvent(data: { [key: string]: string }): void {
    console.log('🧪 Handling test event notification');
    Alert.alert(
      'Test Notification Received!',
      `FCM is working correctly.\nAction: ${data.action || 'none'}`,
      [{ text: 'OK', onPress: () => console.log('Test notification acknowledged') }]
    );
    
    if (data.action === 'open_products') {
      this.navigateToScreen(ROUTES.PRODUCT_SCREEN, { fromNotification: true });
    }
  }
  
  /**
   * Handle lucky draw notifications
   */
  private static handleLuckyDraw(data: { [key: string]: string }): void {
    console.log('🎁 Handling lucky draw notification');
    this.navigateToScreen(ROUTES.LUCKY_DRAW_WINNERS_SCREEN, {
      fromNotification: true,
      drawId: data.drawId
    });
  }
  
  /**
   * Handle promo offer notifications
   */
  private static handlePromoOffer(data: { [key: string]: string }): void {
    console.log('🏷️ Handling promo offer notification');
    this.navigateToScreen(ROUTES.OFFER_SCREEN, {
      fromNotification: true,
      promoId: data.promoId,
      offerId: data.offerId
    });
  }

  // Enhanced existing handlers with navigation
  private static handleOrderUpdate(orderId: string, data: { [key: string]: string }): void {
    console.log('📦 Handling order update for order:', orderId);
    this.navigateToScreen(ROUTES.ORDER_DETAIL_SCREEN, {
      fromNotification: true,
      orderId: orderId,
      orderStatus: data.status
    });
  }

  private static handleProductOffer(productId: string, data: { [key: string]: string }): void {
    console.log('🌾 Handling product offer for product:', productId);
    this.navigateToScreen(ROUTES.PRODUCT_SCREEN, {
      fromNotification: true,
      product_id: productId,
      offerId: data.offerId
    });
  }

  private static handleChatMessage(chatId: string, data: { [key: string]: string }): void {
    console.log('💬 Handling chat message for chat:', chatId);
    this.navigateToScreen(ROUTES.CHAT_SCREEN, {
      fromNotification: true,
      chatId: chatId,
      messageId: data.messageId
    });
  }

  private static handleDeepLink(url: string, data: { [key: string]: string }): void {
    console.log('🔗 Handling deep link:', url);
    // Parse deep link and navigate accordingly
    if (url && url.includes('tejagroapp://')) {
      const path = url.replace('tejagroapp://', '');
      const [screen, ...params] = path.split('/');
      this.navigateToScreen(screen, { fromDeepLink: true, params, ...data });
    }
  }
}

export default FCMUtils;