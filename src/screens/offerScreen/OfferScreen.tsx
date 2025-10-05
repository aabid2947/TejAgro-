/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AuthApi from '../../api/AuthApi';
import { styles } from './OfferScreenStyle';
import { headerView } from '../../shared/components/CommonUtilities';
import { MENUBAR_SCREEN, OFFER_SCREEN } from '../../routes/Routes';
import { MDBLUE, WHITE, GRAY } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get user category from profile
  const userCategory = profileInfo?.client_category || '';

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
      
      if (response?.data?.status && response?.data?.offers) {
        // Filter offers to show only user's category offers
        const userOffers = response.data.offers.filter((offer: Offer) => 
          offer.client_category.toLowerCase() === userCategory.toLowerCase()
        );
        setOffers(userOffers);
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

  const renderOfferItem = ({ item }: { item: Offer }) => {
    const formatProductNames = (productNames: string[]) => {
      return productNames.filter(name => name.trim() !== '').join(' + ');
    };

    const formatOfferType = (types: string[]) => {
      return types.filter(type => type.trim() !== '').join(' ');
    };

    return (
      <TouchableOpacity style={styles.offerCard} activeOpacity={0.8}>
        <View style={styles.offerHeader}>
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>{item.client_category}</Text>
          </View>
        </View>
        
        <View style={styles.offerContent}>
          <View style={styles.offerImageContainer}>
            {item.offer_image ? (
              <Image 
                source={{ uri: item.offer_image }}
                style={styles.offerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
          </View>
          
          <View style={styles.offerDetails}>
            <TextPoppinsSemiBold style={styles.offerTitle}>
              {item.offer_name}
            </TextPoppinsSemiBold>
            
            <TextPoppinsRegular style={styles.offerType}>
              {formatOfferType(item.type)}
            </TextPoppinsRegular>
            
            <TextPoppinsRegular style={styles.productNames}>
              {formatProductNames(item.product_name)}
            </TextPoppinsRegular>
          </View>
        </View>
        
        <View style={styles.offerFooter}>
          <TouchableOpacity style={styles.viewOfferButton} activeOpacity={0.7}>
            <Text style={styles.viewOfferButtonText}>View Offer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No offers available for {userCategory} category
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
        {/* User Category Info */}
        {userCategory && (
          <View style={styles.userCategoryContainer}>
            <TextPoppinsRegular style={styles.userCategoryText}>
              Your Category: <TextPoppinsSemiBold style={styles.userCategoryValue}>{userCategory}</TextPoppinsSemiBold>
            </TextPoppinsRegular>
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
    </SafeAreaView>
  );
};

export default OfferScreen;