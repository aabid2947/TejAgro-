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
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import { MDBLUE, WHITE, BLACK, GREY } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import CrossIcon from '../../svg/CrossIcon';
import { useLuckyDraw } from '../../contexts/LuckyDrawContext';
import { usePopup } from '../../contexts/PopupContext';
import { styles } from './LuckyDrawPopupStyle';
import AuthApi from '../../api/AuthApi';

interface PopupNotificationData {
  pop_up: {
    video?: string;
    image?: string;
    gif?: string;
    description?: string;
    link?: string;
    button_name?: string;
  };
  detailed_page: {
    video?: string;
    image?: string;
    gif?: string;
    description?: string;
    link?: string;
  };
}

interface LuckyDrawPopupProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

// Utility function to determine media type
const getMediaType = (url: string): 'video' | 'image' | 'gif' => {
  if (!url) return 'image';

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.avi') ||
    lowerUrl.includes('.wmv') || lowerUrl.includes('.webm') || lowerUrl.includes('.mkv')) {
    return 'video';
  }

  if (lowerUrl.includes('.gif')) {
    return 'gif';
  }

  return 'image';
};

// Function to handle link opening
const handleLinkPress = async (url: string) => {
  if (!url) return;

  try {
    const supported = await Linking.openURL(url);
    console.log(url)
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  } catch (error) {
    console.error('Error opening link:', error);
  }
};

const LuckyDrawPopup: React.FC<LuckyDrawPopupProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { setHasVisitedLuckyDraw } = useLuckyDraw();
  const { setIsPopupOpen } = usePopup();
  const [showPdf, setShowPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState<PopupNotificationData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [forcePlay, setForcePlay] = useState(false);

  useEffect(() => {
    console.log('LuckyDrawPopup visible changed:', visible);
    if (visible) {
      console.log('Popup is visible, calling fetchPopupNotification...');
      fetchPopupNotification();
    }
  }, [visible]);

  // Track popup open/close state for controlling carousel videos
  useEffect(() => {
    const isOpen = visible || showPdf;
    setIsPopupOpen(isOpen);
    console.log('Popup state changed - isOpen:', isOpen);
  }, [visible, showPdf, setIsPopupOpen]);

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
      console.log('Starting fetchPopupNotification...');
      setApiLoading(true);
      setShouldShowPopup(true); // Show popup while loading

      console.log('Calling AuthApi.getPopupNotification()...');
      const response = await AuthApi.getPopupNotification();

      console.log('Popup Notification API Response:', response.data.toString());

      // Check if response has valid data
      if (response.data.status && response.data.data && response.data.data.length > 0) {
        console.log('Valid popup data found:', response.data.data[0]);
        setPopupData(response.data.data[0]); // Take the first item
        setShouldShowPopup(true); // Keep popup visible with data

        // Force component refresh after data is loaded
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
          if (!forcePlay) setForcePlay(true);
          console.log('Component refreshed after data load');
        }, 100);
      } else {
        // No valid popup data found - hide the popup
        console.log('No popup notification found or invalid response:', response.data);
        setPopupData(null);
        setShouldShowPopup(false);
        // Close the popup if no valid data
        setTimeout(() => {
          console.log('Closing popup due to no valid data');
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching popup notification:', error);
      setPopupData(null);
      setShouldShowPopup(false);
      // Close the popup on error
      setTimeout(() => {
        console.log('Closing popup due to API error');
        onClose();
      }, 100);
    } finally {
      setApiLoading(false);
    }
  };

  const handleSeeAll = () => {
    console.log(90)
    setHasVisitedLuckyDraw(true);

    // Check if there's any content in detailed_page to show
    const hasDetailedContent = popupData?.detailed_page && (
      popupData.detailed_page.video ||
      popupData.detailed_page.image ||
      popupData.detailed_page.gif ||
      popupData.detailed_page.description
    );

    // Check if there's a link in detailed_page
    const hasDetailedLink = popupData?.detailed_page?.link;

    // If there's a link in detailed_page, open it
    // if (hasDetailedLink) {
    //   handleLinkPress(hasDetailedLink);
    //   onClose();
    //   return;
    // }

    // Only navigate to detailed view if there's content
    console.log("hasDetailed", hasDetailedContent)
    if (hasDetailedContent) {
      setShowPdf(true);
    } else {
      // If no detailed content exists, just close the popup
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

  return (
    <>
      {apiLoading ? null : <>
        <Modal
          key={`popup-${refreshKey}`}
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
                ) : popupData?.pop_up ? (
                  <>
                    {/* Media Content - Video, GIF, or Image */}
                    {popupData.pop_up.video && (
                      <>

                        <View style={{ width: width - 80, height: (width - 80) * 0.8, marginBottom: 15, borderRadius: 12, overflow: 'hidden' }}>
                          <Video
                            key={`video-${refreshKey}-${forcePlay}`}
                            source={{ uri: popupData.pop_up.video }}
                            style={[{ width: '100%', height: '100%' }]}
                            resizeMode="contain"
                            repeat={true}
                            muted={true}
                            controls={false}
                            paused={false}
                            playInBackground={false}
                            playWhenInactive={false}
                            ignoreSilentSwitch="ignore"
                            mixWithOthers="duck"
                            posterResizeMode="contain"
                            onError={(error: any) => {
                              console.log('Video error:', error);
                            }}
                            onLoad={() => {
                              console.log('Video loaded successfully');
                              // Force play after a short delay
                              // setTimeout(() => { if(!forcePlay) setForcePlay(prev => !prev); }, 50);
                            }}
                            onReadyForDisplay={() => {
                              console.log('Video ready for display');
                            }}
                          />
                        </View>
                      </>
                    )}

                    {!popupData.pop_up.video && popupData.pop_up.gif && (
                      <View style={{ width: width - 80, height: (width - 80) * 0.6, marginBottom: 15, borderRadius: 12, overflow: 'hidden' }}>
                        <WebView
                          source={{
                            html: `
                            <html>
                              <head>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                  body {
                                    margin: 0;
                                    padding: 0;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    background: transparent;
                                    overflow: hidden;
                                  }
                                  img {
                                    max-width: 100%;
                                    max-height: 100%;
                                    object-fit: contain;
                                    border-radius: 8px;
                                  }
                                </style>
                              </head>
                              <body>
                                <img src="${popupData.pop_up.gif}" alt="GIF" />
                              </body>
                            </html>
                          `
                          }}
                          style={{ width: '100%', height: '100%' }}
                          scrollEnabled={false}
                          showsVerticalScrollIndicator={false}
                          showsHorizontalScrollIndicator={false}
                          scalesPageToFit={false}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          startInLoadingState={false}
                          mixedContentMode="compatibility"
                          androidLayerType="hardware"
                        />
                      </View>
                    )}

                    {!popupData.pop_up.video && !popupData.pop_up.gif && popupData.pop_up.image && (
                      <View style={{ width: width - 80, height: (width - 80) * 0.6, marginBottom: 15, borderRadius: 12, overflow: 'hidden' }}>
                        {getMediaType(popupData.pop_up.image) === 'gif' ? (
                          <WebView
                            source={{
                              html: `
                              <html>
                                <head>
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <style>
                                    body {
                                      margin: 0;
                                      padding: 0;
                                      display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: 100vh;
                                      background: transparent;
                                      overflow: hidden;
                                    }
                                    img {
                                      max-width: 100%;
                                      max-height: 100%;
                                      object-fit: contain;
                                      border-radius: 8px;
                                    }
                                  </style>
                                </head>
                                <body>
                                  <img src="${popupData.pop_up.image}" alt="Image" />
                                </body>
                              </html>
                            `
                            }}
                            style={{ width: '100%', height: '100%' }}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            scalesPageToFit={false}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={false}
                            mixedContentMode="compatibility"
                            androidLayerType="hardware"
                          />
                        ) : (
                          <Image
                            source={{ uri: popupData.pop_up.image }}
                            style={{ width: '100%', height: '100%', borderRadius: 8 }}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                    )}

                    {/* Description */}
                    {popupData.pop_up.description && (
                      <TextPoppinsRegular style={styles.mainDescription}>
                        {popupData.pop_up.description}
                      </TextPoppinsRegular>
                    )}

                    {/* Link as clickable text */}
                    {popupData.pop_up.link && (
                      <TouchableOpacity
                        onPress={() => handleLinkPress(popupData.pop_up.link!)}
                        style={{ marginVertical: 10 }}
                      >
                        <TextPoppinsRegular style={[styles.mainDescription, { color: MDBLUE, textDecorationLine: 'underline' }]}>
                          {popupData.pop_up.link}
                        </TextPoppinsRegular>
                      </TouchableOpacity>
                    )}

                    {/* Button - Only show if button_name is present */}
                    {popupData.pop_up.button_name && (
                      <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={handleSeeAll}
                        activeOpacity={0.8}
                      >
                        <TextPoppinsSemiBold style={styles.seeAllText}>
                          {popupData.pop_up.button_name}
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
          key={`pdf-${refreshKey}`}
          visible={showPdf}
          animationType="slide"
          onRequestClose={handleClosePdf}
        >
          <View style={styles.pdfContainer}>
            {/* PDF Header */}
            <View style={styles.pdfHeader}>
              <TextPoppinsSemiBold style={styles.pdfTitle}>
                {t('DETAILED_VIEW')}
              </TextPoppinsSemiBold>
              <TouchableOpacity
                style={styles.pdfCloseButton}
                onPress={handleClosePdf}
                activeOpacity={0.7}
              >
                <CrossIcon width={24} height={24} color={WHITE} />
              </TouchableOpacity>
            </View>

            {/* Detailed Content */}
            <View style={styles.subDescContainer}>
              {/* Media Content - Video, GIF, or Image */}
              {popupData?.detailed_page?.video && (
                <View style={{ width: width - 40, height: (width - 40) * 0.6, marginBottom: 15, borderRadius: 12, overflow: 'hidden' }}>
                  <Video
                    key={`detailed-video-${refreshKey}-${forcePlay}`}
                    source={{ uri: popupData.detailed_page.video }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                    repeat={true}
                    muted={true}
                    controls={true}
                    paused={false}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch="ignore"
                    mixWithOthers="duck"
                    posterResizeMode="contain"
                    onLoad={() => {
                      console.log('Detailed video loaded and should autoplay');
                      setTimeout(() => setForcePlay(prev => !prev), 50);
                    }}
                    onError={(error) => console.log('Detailed video error:', error)}
                    onReadyForDisplay={() => {
                      console.log('Detailed video ready for display');
                    }}
                  />
                </View>
              )}

              {!popupData?.detailed_page?.video && popupData?.detailed_page?.gif && (
                <View style={{ width: width - 40, height: (width - 40) * 0.6, marginBottom: 15, borderRadius: 12, overflow: 'hidden' }}>
                  <WebView
                    source={{
                      html: `
                      <html>
                        <head>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <style>
                            body {
                              margin: 0;
                              padding: 0;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              height: 100vh;
                              background: transparent;
                              overflow: hidden;
                            }
                            img {
                              max-width: 100%;
                              max-height: 100%;
                              object-fit: contain;
                              border-radius: 8px;
                            }
                          </style>
                        </head>
                        <body>
                          <img src="${popupData.detailed_page.gif}" alt="GIF" />
                        </body>
                      </html>
                    `
                    }}
                    style={{ width: '100%', height: '100%' }}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scalesPageToFit={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={false}
                    mixedContentMode="compatibility"
                    androidLayerType="hardware"
                  />
                </View>
              )}

              {!popupData?.detailed_page?.video && !popupData?.detailed_page?.gif && popupData?.detailed_page?.image && (
                <View style={{ width: width - 40, height: (width - 40) * 0.6, marginBottom: 15, borderRadius: 12, overflow: 'hidden' }}>
                  {getMediaType(popupData.detailed_page.image) === 'gif' ? (
                    <WebView
                      source={{
                        html: `
                        <html>
                          <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                              body {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                background: transparent;
                                overflow: hidden;
                              }
                              img {
                                max-width: 100%;
                                max-height: 100%;
                                object-fit: contain;
                                border-radius: 8px;
                              }
                            </style>
                          </head>
                          <body>
                            <img src="${popupData.detailed_page.image}" alt="Image" />
                          </body>
                        </html>
                      `
                      }}
                      style={{ width: '100%', height: '100%' }}
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      scalesPageToFit={false}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      startInLoadingState={false}
                      mixedContentMode="compatibility"
                      androidLayerType="hardware"
                    />
                  ) : (
                    <Image
                      source={{ uri: popupData.detailed_page.image }}
                      style={{ width: '100%', height: '100%', borderRadius: 8 }}
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}


              {/* Description */}
              {popupData?.detailed_page?.description && (
                <TextPoppinsRegular style={styles.subDescription}>
                  {popupData.detailed_page.description}
                </TextPoppinsRegular>
              )}

              {/* Link as clickable text */}
              {popupData?.detailed_page?.link && (
                <TouchableOpacity
                  onPress={() => handleLinkPress(popupData.detailed_page.link!)}
                  style={{ marginVertical: 10 }}
                >
                  <TextPoppinsRegular style={[styles.subDescription, { color: MDBLUE, textDecorationLine: 'underline' }]}>
                    {popupData.detailed_page.link}
                  </TextPoppinsRegular>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </>}

    </>
  );
};

export default LuckyDrawPopup;