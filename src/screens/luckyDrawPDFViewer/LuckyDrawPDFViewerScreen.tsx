/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { headerView } from '../../shared/components/CommonUtilities';
import { MENUBAR_SCREEN } from '../../routes/Routes';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { styles } from './LuckyDrawPDFViewerStyle.ts';

const LuckyDrawPDFViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Sidebar/menu press handler
  const onPressSide = () => {
    navigation.navigate(MENUBAR_SCREEN as never);
  };

  // PDF source - using local PDF with fallback to external app
  const pdfUri = Platform.OS === 'android' 
    ? 'file:///android_asset/Lucky Draw Winners.pdf'
    : require('../../assets/Lucky Draw Winners.pdf');
  
  // Create HTML content for PDF viewing
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
        <title>PDF Viewer</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
          }
          .container {
            text-align: center;
            padding: 40px 20px;
          }
          .pdf-message {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .description {
            font-size: 16px;
            color: #666;
            line-height: 1.5;
            margin-bottom: 25px;
          }
          .open-button {
            background-color: #007AFF;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
          }
          .open-button:hover {
            background-color: #0056CC;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="pdf-message">
            <div class="icon">📄</div>
            <div class="title">लकी ड्रॉ विजेते PDF</div>
            <div class="description">
              PDF फाइल पाहण्यासाठी खालील बटण दाबा.<br>
              आपण zoom करू शकता आणि फाइल download करू शकता.
            </div>
            <a href="${pdfUri}" class="open-button" target="_blank">
              PDF उघडा
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  const onLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const onLoadEnd = () => {
    setLoading(false);
  };

  const onError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView error: ', nativeEvent);
    setLoading(false);
    setError(true);
  };

  const openExternalPDF = () => {
    Alert.alert(
      'बाह्य PDF दर्शक',
      'PDF बाह्य ऍप्लिकेशनमध्ये उघडा?',
      [
        { text: 'रद्द करा', style: 'cancel' },
        { text: 'उघडा', onPress: () => {
          // Try to open with external PDF viewer
          const pdfPath = Platform.OS === 'android' 
            ? 'file:///android_asset/Lucky Draw Winners.pdf'
            : 'file:///Lucky Draw Winners.pdf';
          Linking.openURL(pdfPath).catch(() => {
            Alert.alert('त्रुटी', 'PDF उघडता आली नाही');
          });
        }}
      ]
    );
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <TextPoppinsSemiBold style={styles.errorText}>
        PDF लोड करता आली नाही
      </TextPoppinsSemiBold>
      <TextPoppinsRegular style={styles.errorSubtext}>
        कृपया इंटरनेट कनेक्शन तपासा किंवा बाह्य PDF दर्शक वापरा
      </TextPoppinsRegular>
      <TouchableOpacity style={styles.retryButton} onPress={openExternalPDF}>
        <TextPoppinsSemiBold style={styles.retryButtonText}>
          बाह्य ऍप्लिकेशनमध्ये उघडा
        </TextPoppinsSemiBold>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <TextPoppinsSemiBold style={styles.loadingText}>
        PDF लोड होत आहे...
      </TextPoppinsSemiBold>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {headerView(
        'लकी ड्रॉ विजेते PDF',
        'संपूर्ण यादी पहा',
        onPressSide,
        totalItems,
        navigation,
        undefined
      )}
      
      <View style={styles.content}>
        {error ? renderError() : (
          <View style={styles.pdfContainer}>
            {loading && renderLoading()}
            <WebView
              source={{ html: htmlContent }}
              style={styles.pdf}
              onLoadStart={onLoadStart}
              onLoadEnd={onLoadEnd}
              onError={onError}
              scalesPageToFit={true}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              originWhitelist={['*']}
              mixedContentMode="compatibility"
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              bounces={true}
              bouncesZoom={true}
              useWebKit={true}
              allowsFullscreenVideo={false}
              allowsBackForwardNavigationGestures={false}
            />
          </View>
        )}
        
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.externalButton} onPress={openExternalPDF}>
            <TextPoppinsSemiBold style={styles.externalButtonText}>
              📱 बाह्य ऍप्लिकेशनमध्ये उघडा
            </TextPoppinsSemiBold>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LuckyDrawPDFViewerScreen;