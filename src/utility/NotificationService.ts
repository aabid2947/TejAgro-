import FCMUtils from './FCMUtils';
import NotificationUtils from './NotificationUtils';

/**
 * Initialize all notification services
 * Call this function in your App.tsx useEffect
 */
export const initializeNotifications = async (clientId?: string): Promise<void> => {
  try {
    console.log('🔥 Initializing notification services...', clientId ? `for client: ${clientId}` : 'without client ID');
    
    // Create notification channels (Android)
    await NotificationUtils.createNotificationChannel();
    
    // Initialize FCM with improved error handling
    await FCMUtils.initialize();
    
    // If client ID is available, update FCM token
    if (clientId) {
      await FCMUtils.updateFCMTokenWithClientId(clientId);
    }
    
    // Setup notification tap handler for background state
    FCMUtils.setupNotificationOpenHandler();
    
    console.log('✅ Notification services initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing notification services:', error);
    // Don't throw - app should continue working without FCM
  }
};

/**
 * Update FCM token with client ID after login
 */
export const updateFCMTokenForClient = async (clientId: string): Promise<void> => {
  try {
    await FCMUtils.updateFCMTokenWithClientId(clientId);
    console.log('FCM token updated for client:', clientId);
  } catch (error) {
    console.error('Error updating FCM token for client:', error);
  }
};

/**
 * Handle user logout - clean up FCM token
 */
export const handleNotificationLogout = async (clientId?: string): Promise<void> => {
  try {
    await FCMUtils.deleteToken(clientId);
    console.log('Notification services cleaned up for logout');
  } catch (error) {
    console.error('Error cleaning up notification services:', error);
  }
};

/**
 * Set navigation reference for FCM navigation
 */
export const setFCMNavigationRef = (navigationRef: any): void => {
  FCMUtils.setNavigationRef(navigationRef);
};

/**
 * Check if notifications are enabled and guide user if not
 */
export const checkAndRequestNotifications = async (): Promise<boolean> => {
  try {
    const isEnabled = await FCMUtils.areNotificationsEnabled();
    
    if (!isEnabled) {
      console.log('📢 Notifications not enabled, requesting permissions...');
      return await FCMUtils.requestNotificationPermissions();
    }
    
    console.log('✅ Notifications are already enabled');
    return true;
  } catch (error) {
    console.error('❌ Error checking notification status:', error);
    return false;
  }
};

/**
 * Get current FCM token for API calls
 */
export const getFCMToken = (): string | null => {
  return FCMUtils.getCurrentToken();
};

export default {
  initializeNotifications,
  handleNotificationLogout,
  getFCMToken,
  updateFCMTokenForClient,
  checkAndRequestNotifications,
  setFCMNavigationRef,
};