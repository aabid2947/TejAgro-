/**
 * SMS Retriever Utility for getting app hash
 * This provides alternative methods to get app hash since getAppHash() may not be available
 */

import { NativeModules, Platform } from 'react-native';

interface AppHashUtility {
  getAppHash(): Promise<string>;
  getAppSignature(): Promise<string>;
}

class SMSRetrieverUtils {
  /**
   * Get app hash using native Android methods
   * This is a custom implementation since getAppHash might not be available
   */
  static async getAppHash(): Promise<string> {
    if (Platform.OS !== 'android') {
      throw new Error('App hash is only available on Android');
    }

    try {
      // Try to use native module if available
      const { RNSmsRetriever } = NativeModules;
      
      if (RNSmsRetriever && RNSmsRetriever.getAppHash) {
        return await RNSmsRetriever.getAppHash();
      } else {
        // Fallback: generate hash manually (you'll need package name and cert fingerprint)
        return await this.generateAppHashManually();
      }
    } catch (error) {
      console.error('Error getting app hash:', error);
      throw error;
    }
  }

  /**
   * Manual app hash generation
   * You need to provide your package name and certificate fingerprint
   */
  private static async generateAppHashManually(): Promise<string> {
    // This would require native implementation or use a separate script
    throw new Error('Manual app hash generation requires package name and certificate fingerprint');
  }

  /**
   * Get app signature information
   */
  static async getAppSignature(): Promise<string> {
    if (Platform.OS !== 'android') {
      throw new Error('App signature is only available on Android');
    }

    try {
      const { RNSmsRetriever } = NativeModules;
      
      if (RNSmsRetriever && RNSmsRetriever.getAppSignature) {
        return await RNSmsRetriever.getAppSignature();
      } else {
        throw new Error('getAppSignature method not available');
      }
    } catch (error) {
      console.error('Error getting app signature:', error);
      throw error;
    }
  }
}

export default SMSRetrieverUtils;