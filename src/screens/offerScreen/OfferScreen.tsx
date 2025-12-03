/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Modal,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import AuthApi from '../../api/AuthApi';
import { styles } from './OfferScreenStyle';
import { headerView } from '../../shared/components/CommonUtilities';
import { MENUBAR_SCREEN, OFFER_SCREEN } from '../../routes/Routes';
import { MDBLUE, WHITE, GRAY } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Offer {
  offer_id: string;
  offer_name: string;
  client_category: string;
  offer_image: string;
  type: string[];
  product_name: string[];
}

interface OfferResponse {
  offers: Offer[];
  status: boolean;
}

const OfferScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const profileInfo: any = useSelector((state: RootState) => state.counter.isProfileInfo);
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]); // Store all offers
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [showAllOffers, setShowAllOffers] = useState(false); // Toggle for showing all offers
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null); // For modal
  const [showOfferModal, setShowOfferModal] = useState(false); // Modal visibility
  
  // Get user category from profile
  const userCategory = profileInfo?.client_category || '';

  // Helper function to construct or validate image URL
  const getValidImageUrl = (offer: Offer) => {
    const baseUrl = 'https://www.tejagrotech.com/tejagro_sale_demo/offer_images/';
    
    // If offer_image is just the base URL, try to construct with offer_id
    if (offer.offer_image === baseUrl || offer.offer_image.endsWith('/offer_images/')) {
      // You could potentially construct: baseUrl + offer.offer_id + '.jpg'
      // But since we don't know the actual filename format, return null
      return null;
    }
    
    // If it's a complete URL, return it
    if (offer.offer_image && offer.offer_image.includes('http')) {
      return offer.offer_image;
    }
    
    return null;
  };

  // Sidebar/menu press handler
  const onPressSide = () => {
    navigation.navigate(MENUBAR_SCREEN as never);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await AuthApi.getOffer({});
      console.log('Offers API Response:', response);
      
      if (response?.data?.status && response?.data?.offers) {
        // Log each offer's image URL for debugging
        console.log('=== OFFERS LOADED ===');
        response.data.offers.forEach((offer: Offer, index: number) => {
          const isValidUrl = offer.offer_image && 
                           offer.offer_image.trim() !== '' && 
                           offer.offer_image !== 'https://www.tejagrotech.com/tejagro_sale_demo/offer_images/' &&
                           !offer.offer_image.endsWith('/offer_images/');
          console.log(`${index + 1}. ${offer.offer_name}`);
          console.log(`   Category: ${offer.client_category}`);
          console.log(`   Image URL: "${offer.offer_image}"`);
          console.log(`   Image Valid: ${isValidUrl ? '✅ YES' : '❌ NO (will use static)'}`);
          console.log('   ---');
        });

        // Filter offers to show only user's category offers or "All" category
        const userOffers = response.data.offers.filter((offer: Offer) => 
          offer.client_category.toLowerCase() === userCategory.toLowerCase() ||
          offer.client_category.toLowerCase() === 'all'
        );
        
        console.log(`Filtered ${userOffers.length} offers for category: ${userCategory}`);
        
        // Store both filtered and all offers
        setAllOffers(response.data.offers);
        setOffers(showAllOffers ? response.data.offers : userOffers);

        // Initialize image states for all offers (not just filtered ones)
        const initialImageErrors: {[key: string]: boolean} = {};
        const initialImageLoading: {[key: string]: boolean} = {};
        response.data.offers.forEach((offer: Offer) => {
          initialImageErrors[offer.offer_id] = false;
          initialImageLoading[offer.offer_id] = false;
        });
        setImageErrors(initialImageErrors);
        setImageLoading(initialImageLoading);
      } else {
        console.log('No offers found or API error');
        setOffers([]);
      }
    } catch (error) {
      console.log('Error loading offers:', error);
      setOffers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadOffers(true);
  };

  // Function to toggle between showing all offers and filtered offers
  const toggleShowAllOffers = () => {
    const newShowAllOffers = !showAllOffers;
    setShowAllOffers(newShowAllOffers);
    
    if (newShowAllOffers) {
      // Show all offers
      setOffers(allOffers);
      console.log(`Showing all ${allOffers.length} offers`);
    } else {
      // Show only user category offers
      const userOffers = allOffers.filter((offer: Offer) => 
        offer.client_category.toLowerCase() === userCategory.toLowerCase() ||
        offer.client_category.toLowerCase() === 'all'
      );
      setOffers(userOffers);
      console.log(`Showing ${userOffers.length} offers for category: ${userCategory}`);
    }
  };

  // Function to open offer detail modal
  const handleViewOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowOfferModal(true);
  };

  // Function to close offer detail modal
  const handleCloseOfferModal = () => {
    setShowOfferModal(false);
    setSelectedOffer(null);
  };

  const renderOfferItem = ({ item }: { item: Offer }) => {
    const formatProductNames = (productNames: string[]) => {
      return productNames.filter(name => name.trim() !== '').join(' + ');
    };

    const formatOfferType = (types: string[]) => {
      return types.filter(type => type.trim() !== '').join(' ');
    };

    // Get the actual image URL to use
    const validImageUrl = getValidImageUrl(item);
    const hasValidImageUrl = validImageUrl !== null && !imageErrors[item.offer_id];
    const isImageLoading = imageLoading[item.offer_id] || false;

    // Debug logging for each offer item
    console.log(`Rendering offer: ${item.offer_name}`);
    console.log(`Original URL: "${item.offer_image}"`);
    console.log(`Valid URL: "${validImageUrl}"`);
    console.log(`Will use: ${hasValidImageUrl ? 'DYNAMIC' : 'STATIC'} image`);
    console.log(`Image error state: ${imageErrors[item.offer_id] || false}`);

    return (
      <TouchableOpacity style={styles.offerCard} activeOpacity={0.8}>
        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />
        
        {/* Decorative Elements */}
        <View style={styles.decorativeElements} />
        <View style={styles.decorativeElements2} />
        <View style={styles.curvedBorder} />
        
        <View style={styles.offerContent}>
          {/* Left side - All text content and button */}
          <View style={styles.offerRightContainer}>
            <View style={styles.offerTextContainer}>
              {/* Main Title */}
              <TextPoppinsSemiBold style={styles.offerTitle}>
                {item.offer_name}
              </TextPoppinsSemiBold>
              
              {/* Subtitle */}
              <TextPoppinsSemiBold style={styles.offerSubtitle}>
                विशेष ऑफर उपलब्ध
              </TextPoppinsSemiBold>
              
              {/* Show category when viewing all offers */}
              {showAllOffers && (
                <TextPoppinsRegular style={[styles.offerType, { 
                  fontSize: 12, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                  alignSelf: 'flex-start'
                }]}>
                  Category: {item.client_category}
                </TextPoppinsRegular>
              )}
              
              {/* <TextPoppinsRegular style={styles.offerType}>
                {formatOfferType(item.type)}
              </TextPoppinsRegular>
               */}
              <TextPoppinsRegular style={styles.productNames}>
                {formatProductNames(item.product_name)}
              </TextPoppinsRegular>
            </View>
            
            <View style={styles.offerFooter}>
              <TouchableOpacity 
                style={styles.viewOfferButton} 
                activeOpacity={0.7}
                onPress={() => handleViewOffer(item)}
              >
                <Text style={styles.viewOfferButtonText}>ऑफर पहा</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right side - Full height image */}
          <View style={styles.offerImageContainer}>
            {/* Show loading indicator only for dynamic images */}
            {isImageLoading && hasValidImageUrl && (
              <View style={[styles.offerImage, { 
                position: 'absolute', 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: '#f0f0f0',
                zIndex: 1
              }]}>
                <ActivityIndicator size="small" color={MDBLUE} />
                <Text style={{ fontSize: 10, color: GRAY, marginTop: 4 }}>Loading...</Text>
              </View>
            )}
            <Image 
              source={
                hasValidImageUrl
                  ? { uri: validImageUrl }
                  : require('../../assets/OfferLogo.png')
              }
              style={styles.offerImage}
              resizeMode="cover"
              onLoad={() => {
                console.log('✅ Dynamic image loaded successfully for:', item.offer_name);
                setImageLoading(prev => ({ ...prev, [item.offer_id]: false }));
              }}
              onError={(error) => {
                console.log('❌ Failed to load dynamic image for:', item.offer_name, 'falling back to static');
                setImageErrors(prev => ({ ...prev, [item.offer_id]: true }));
                setImageLoading(prev => ({ ...prev, [item.offer_id]: false }));
              }}
              onLoadStart={() => {
                if (hasValidImageUrl) {
                  console.log('🔄 Starting to load dynamic image for:', item.offer_name, 'URL:', validImageUrl);
                  setImageLoading(prev => ({ ...prev, [item.offer_id]: true }));
                }
              }}
            />
            {/* Show image type indicator for debugging */}
         
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {showAllOffers 
          ? t('NO_OFFERS_AVAILABLE')
          : t('NO_OFFERS_AVAILABLE_FOR_CATEGORY', { category: userCategory })
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {headerView(
        t('OFFERS'),
        t('SPECIAL_OFFERS_FOR_FARMERS'),
        onPressSide,
        totalItems,
        navigation,
        OFFER_SCREEN
      )}
      
      <View style={styles.content}>
        {/* User Category Info with Toggle Button */}
        {userCategory && (
          <View style={styles.userCategoryContainer}>
            <View style={styles.categoryRow}>
              <View style={styles.categoryTextContainer}>
                <TextPoppinsRegular style={styles.userCategoryText}>
                  Your Category: <TextPoppinsSemiBold style={styles.userCategoryValue}>{userCategory}</TextPoppinsSemiBold>
                </TextPoppinsRegular>
              </View>
              
              {/* Small Toggle Button - 30% width */}
              {/* <TouchableOpacity 
                style={[
                  styles.smallToggleButton,
                  { backgroundColor: showAllOffers ? '#28a745' : MDBLUE }
                ]} 
                onPress={toggleShowAllOffers}
                activeOpacity={0.7}
              >
                <TextPoppinsSemiBold style={styles.smallToggleButtonText}>
                  {showAllOffers ? 'Your' : 'All'}
                </TextPoppinsSemiBold>
              </TouchableOpacity> */}
            </View>
          </View>
        )}

        {/* Offers List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={MDBLUE} />
            <Text style={styles.loadingText}>Loading offers...</Text>
          </View>
        ) : (
          <FlatList
            data={offers}
            renderItem={renderOfferItem}
            keyExtractor={(item) => item.offer_id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[MDBLUE]}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyComponent}
          />
        )}
      </View>

      {/* Offer Detail Modal */}
      <Modal
        visible={showOfferModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseOfferModal}
      >
        <ImageViewer
          imageUrls={[
            {
              url: selectedOffer ? (getValidImageUrl(selectedOffer) || '') : '',
              props: {
                source: selectedOffer && !getValidImageUrl(selectedOffer) 
                  ? require('../../assets/OfferLogo.png')
                  : undefined
              }
            }
          ]}
          enableSwipeDown={true}
          onSwipeDown={handleCloseOfferModal}
          onCancel={handleCloseOfferModal}
          backgroundColor="rgba(0, 0, 0, 0.95)"
          renderHeader={() => (
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={handleCloseOfferModal}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          renderFooter={() => (
            <View style={styles.modalOfferNameContainer}>
              {selectedOffer && (
                <TextPoppinsSemiBold style={styles.modalOfferName}>
                  {selectedOffer.offer_name}
                </TextPoppinsSemiBold>
              )}
            </View>
          )}
          saveToLocalByLongPress={false}
          enableImageZoom={true}
          maxOverflow={300}
          index={0}
          renderIndicator={() => <View />}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default OfferScreen;