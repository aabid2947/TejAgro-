/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { MDBLUE, WHITE, BLACK, GREY } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import CrossIcon from '../../svg/CrossIcon';
import { useLuckyDraw } from '../../contexts/LuckyDrawContext';
import { styles } from './LuckyDrawPopupStyle';
import AuthApi from '../../api/AuthApi';

interface PopupNotificationData {
  main_heading: string;
  main_image: string;
  main_desc: string;
  button_name: string;
  sub_heading: string;
  sub_file: {
    type: string;
    url: string;
  };
  sub_desc: string;
  added_on: string;
}

interface LuckyDrawPopupProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const LuckyDrawPopup: React.FC<LuckyDrawPopupProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { setHasVisitedLuckyDraw } = useLuckyDraw();
  const [showPdf, setShowPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState<PopupNotificationData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchPopupNotification();
    }
  }, [visible]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);

  const fetchPopupNotification = async () => {
    try {
      setApiLoading(true);
      setShouldShowPopup(true); // Show popup while loading
      const response = await AuthApi.getPopupNotification();
      
      console.log('Popup Notification API Response:', response.data);
      
      // Check if response has valid data
      if (response.data.status && response.data.data && response.data.data.length > 0) {
        setPopupData(response.data.data[0]); // Take the first item
        setShouldShowPopup(true); // Keep popup visible with data
      } else {
        // No valid popup data found - hide the popup
        console.log('No popup notification found or invalid response');
        setPopupData(null);
        setShouldShowPopup(false);
        // Close the popup if no valid data
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching popup notification:', error);
      setPopupData(null);
      setShouldShowPopup(false);
      // Close the popup on error
      setTimeout(() => {
        onClose();
      }, 100);
    } finally {
      setApiLoading(false);
    }
  };

  const handleSeeAll = () => {
    setHasVisitedLuckyDraw(true);
    
    // Check if there's PDF or description to show
    const hasPdf = popupData?.sub_file?.type === 'pdf' && popupData?.sub_file?.url;
    const hasDescription = popupData?.sub_desc;
    
    // Only navigate if there's PDF or description
    if (hasPdf || hasDescription) {
      setShowPdf(true);
    } else {
      // If neither PDF nor description exists, just close the popup
      onClose();
    }
  };

  const handleClose = () => {
    setHasVisitedLuckyDraw(true);
    onClose();
  };

  const handleClosePdf = () => {
    setShowPdf(false);
    setLoading(true);
    onClose();
  };

  // Get PDF URL from API data - only if PDF exists
  const getPdfUrl = () => {
    if (popupData?.sub_file?.type === 'pdf' && popupData?.sub_file?.url) {
      const apiUrl = popupData.sub_file.url;
      
      // Check if it's a Google Drive URL and convert to preview format
      if (apiUrl.includes('drive.google.com')) {
        // Extract file ID from various Google Drive URL formats
        const match = apiUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
        return apiUrl;
      }
      
      // For direct PDF URLs, use Google Docs viewer for better compatibility
      if (apiUrl.endsWith('.pdf')) {
        return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(apiUrl)}`;
      }
      
      // Return the original URL
      return apiUrl;
    }
    
    // Return null if no PDF URL available
    return null;
  };

  return (
    <>
      <Modal
        visible={visible && !showPdf && shouldShowPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <CrossIcon width={20} height={20} color={GREY} />
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>
              {apiLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={MDBLUE} />
                  <TextPoppinsRegular style={styles.loadingText}>
                    {t('LUCKY_DRAW_LOADING')}
                  </TextPoppinsRegular>
                </View>
              ) : popupData ? (
                <>
                  {/* Main Heading */}
                  {popupData.main_heading && (
                    <TextPoppinsSemiBold style={styles.mainHeading}>
                      {popupData.main_heading}
                    </TextPoppinsSemiBold>
                  )}

                  {/* Main Image */}
                  {popupData.main_image ? (
                    <Image 
                      source={{ uri: popupData.main_image }} 
                      style={{ width: width - 80, height: (width - 80) * 0.6, marginBottom: 15 }} 
                      resizeMode="contain"
                    />
                  ) : (null  )}

                  {/* Main Description */}
                  {popupData.main_desc && (
                    <TextPoppinsRegular style={styles.mainDescription}>
                      {popupData.main_desc}
                    </TextPoppinsRegular>
                  )}


                  {/* See All Button - Only show if there's PDF or sub_desc */}
                  {((popupData.sub_file?.type === 'pdf' && popupData.sub_file?.url) || popupData.sub_desc) && (
                    <TouchableOpacity 
                      style={styles.seeAllButton} 
                      onPress={handleSeeAll}
                      activeOpacity={0.8}
                    >
                      <TextPoppinsSemiBold style={styles.seeAllText}>
                        {popupData.button_name || t('SEE_ALL_WINNERS')}
                      </TextPoppinsSemiBold>
                    </TouchableOpacity>
                  )}
                </>
              ) : null // Don't render anything if no popup data
              }
            </View>
          </View>
        </View>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal
        visible={showPdf}
        animationType="slide"
        onRequestClose={handleClosePdf}
      >
        <View style={styles.pdfContainer}>
          {/* PDF Header */}
          <View style={styles.pdfHeader}>
            <TextPoppinsSemiBold style={styles.pdfTitle}>
              {popupData?.sub_heading || t('LUCKY_DRAW_WINNERS')}
            </TextPoppinsSemiBold>
            <TouchableOpacity 
              style={styles.pdfCloseButton} 
              onPress={handleClosePdf}
              activeOpacity={0.7}
            >
              <CrossIcon width={24} height={24} color={WHITE} />
            </TouchableOpacity>
          </View>

          {/* Sub Description */}
          {popupData?.sub_desc && (
            <View style={styles.subDescContainer}>
              <TextPoppinsRegular style={styles.subDescription}>
                {popupData.sub_desc}
              </TextPoppinsRegular>
            </View>
          )}

          {/* WebView PDF Viewer - Only show if PDF URL exists */}
          {getPdfUrl() ? (
            <>
              {/* Loading Indicator */}
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={MDBLUE} />
                  <TextPoppinsRegular style={styles.loadingText}>
                    {t('LUCKY_DRAW_LOADING')}
                  </TextPoppinsRegular>
                </View>
              )}

              <WebView
                source={{ uri: getPdfUrl()! }}
                style={styles.pdf}
                onLoadStart={() => {
                  console.log(t('WEBVIEW_LOADING_STARTED'), getPdfUrl());
                  setLoading(true);
                  
                  // Set a timeout to stop loading if it takes too long
                  const timeout = setTimeout(() => {
                    console.log(t('WEBVIEW_LOADING_TIMEOUT'));
                    setLoading(false);
                  }, 15000); // 15 seconds timeout
                  setLoadingTimeout(timeout);
                }}
                onLoadEnd={() => {
                  console.log(t('WEBVIEW_LOADING_ENDED'), getPdfUrl());
                  setLoading(false);
                  if (loadingTimeout) {
                    clearTimeout(loadingTimeout);
                    setLoadingTimeout(null);
                  }
                }}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn(t('WEBVIEW_ERROR'), nativeEvent);
                  console.log(t('WEBVIEW_FAILED_URL'), getPdfUrl());
                  setLoading(false);
                  if (loadingTimeout) {
                    clearTimeout(loadingTimeout);
                    setLoadingTimeout(null);
                  }
                }}
                onHttpError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn(t('WEBVIEW_HTTP_ERROR'), nativeEvent);
                  console.log(t('WEBVIEW_HTTP_ERROR'), getPdfUrl());
                  setLoading(false);
                  if (loadingTimeout) {
                    clearTimeout(loadingTimeout);
                    setLoadingTimeout(null);
                  }
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                mixedContentMode="always"
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={['*']}
                onShouldStartLoadWithRequest={(request) => {
                  console.log(t('WEBVIEW_SHOULD_START_LOAD'), request.url);
                  return true;
                }}
              />
            </>
          ) : (
            /* Show message if no PDF available but description exists */
            !popupData?.sub_desc && (
              <View style={styles.loadingContainer}>
                <TextPoppinsRegular style={styles.loadingText}>
                  {t('NO_PDF_AVAILABLE')}
                </TextPoppinsRegular>
              </View>
            )
          )}
        </View>
      </Modal>
    </>
  );
};

export default LuckyDrawPopup;