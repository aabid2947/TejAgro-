/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
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
import { MDBLUE, WHITE, BLACK, GREY } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import CrossIcon from '../../svg/CrossIcon';
import { useLuckyDraw } from '../../contexts/LuckyDrawContext';
import { styles } from './LuckyDrawPopupStyle';
interface LuckyDrawPopupProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const LuckyDrawPopup: React.FC<LuckyDrawPopupProps> = ({ visible, onClose }) => {
  const { setHasVisitedLuckyDraw } = useLuckyDraw();
  const [showPdf, setShowPdf] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSeeAll = () => {
    setHasVisitedLuckyDraw(true);
    setShowPdf(true);
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

  // Google Drive file ID
  const fileId = '1Nes1RIkWQq7A00rdzmribpqGXaV3EPnA';
  
  // Use Google Drive's embed viewer
  // https://drive.google.com/file/d/1Nes1RIkWQq7A00rdzmribpqGXaV3EPnA/view?usp=drive_link
  const pdfUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return (
    <>
      <Modal
        visible={visible && !showPdf}
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
              {/* Trophy Icon */}
              

             

              <Image 
                source={require('../../assets/winnerPrize/image.png')} 
                style={{ width: width - 80, height: (width - 80) * 1, marginBottom: 20 }} 
                resizeMode="contain"
              />
              {/* See All Button */}
              <TouchableOpacity 
                style={styles.seeAllButton} 
                onPress={handleSeeAll}
                activeOpacity={0.8}
              >
                <TextPoppinsSemiBold style={styles.seeAllText}>
                  सर्व विजेते पहा
                </TextPoppinsSemiBold>
              </TouchableOpacity>
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
              लकी ड्रॉ विजेते
            </TextPoppinsSemiBold>
            <TouchableOpacity 
              style={styles.pdfCloseButton} 
              onPress={handleClosePdf}
              activeOpacity={0.7}
            >
              <CrossIcon width={24} height={24} color={WHITE} />
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={MDBLUE} />
              <TextPoppinsRegular style={styles.loadingText}>
                लोड करत आहे...
              </TextPoppinsRegular>
            </View>
          )}

          {/* WebView PDF Viewer */}
          <WebView
            source={{ uri: pdfUrl }}
            style={styles.pdf}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              setLoading(false);
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            mixedContentMode="always"
          />
        </View>
      </Modal>
    </>
  );
};

export default LuckyDrawPopup;