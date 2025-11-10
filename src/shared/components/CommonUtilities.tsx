import { useTranslation } from "react-i18next"
import { Alert, BackHandler, Image, Linking, Pressable, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native"
import { WebView } from 'react-native-webview'
import { useSelector } from "react-redux"
import React, { useState, useEffect, useRef } from "react"
import { RootState } from "../../reduxToolkit/store"
import { MyOrdersStyle } from "../../screens/orders/MyOrdersStyle"
import RightArrowIcon from "../../svg/RightArrowIcon"
import { BLACK, GRAY, GREEN, GREY, MD_GRAY_Dark, MDBLUE, PoppinsMedium, WHITE, WHITE_GRAY } from "../common-styles/colors"
import SideBarSvg from "../../svg/SideBarSvg"
import { DashboardStyle } from "../../screens/dashboard/DashboardStyle"
import NotificationIcon from "../../svg/NotificationIcon"
import moment from "moment"
import TextPoppinsSemiBold from "../fontFamily/TextPoppinsSemiBold"
import TextPoppinsMediumBold from "../fontFamily/TextPoppinsMediumBold"
import { widthPercentageToDP } from "react-native-responsive-screen"
import CartSvg from "../../svg/CartSvg"
import MessageIcon from "../../svg/MessageIcon"
import OfferIcon from "../../svg/OfferIcon"
import HighlightedOfferIcon from "../../svg/HighlightedOfferIcon"
import { MYCART_SCREEN, CHAT_SCREEN, OFFER_SCREEN } from "../../routes/Routes"
import { ShippingAddressStyle } from "../../screens/shippingAddress/ShippingAddressStyle"
import PlusButtonIcon from "../../svg/PlusButtonIcon"
import { checkVersion } from "react-native-check-version"
import HighlightedMessageIcon from "../../svg/HighlightedMessageIcon"
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { jwtDecode } from 'jwt-decode'
// import offerGif from '../../assets/OfferGif.gif'
// Configuration for offer GIF
const OFFER_GIF_CONFIG = {
  url: "https://www.tejagrotech.com/tejagro_sale_demo/offer_images/offer_icon.gif", // Replace with your GIF URL
  width: 64,
  height: 40,
  alt: "offers"
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: FirebaseFirestoreTypes.Timestamp | null;
  message_seen?: number;
}

// Custom hook to fetch unread messages count
const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const isUserData: any = useSelector((state: RootState) => state.counter.isUserinfo);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupListener = () => {
      try {
        const token = isUserData?.jwt;
        if (!token) {
          console.log('No JWT token found for unread messages');
          return;
        }

        const decodedToken: any = jwtDecode(token);
        const clientId = decodedToken?.data?.client_id;
        
        if (!clientId) {
          console.log('No client_id found in token for unread messages');
          return;
        }

        const messagesPath = `chats/${clientId}/messages`;
        console.log('Setting up unread messages listener for:', messagesPath);

        unsubscribe = firestore()
          .collection(messagesPath)
          .orderBy('timestamp', 'desc')
          .onSnapshot(
            (querySnapshot) => {
              const messages: Message[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                  id: doc.id,
                  text: data.text,
                  sender: data.sender,
                  timestamp: data.timestamp,
                  message_seen: data.message_seen || 0,
                });
              });

              // Calculate unread count
              let count = 0;
              for (const message of messages) {
                if (message.sender === 'admin' && message.message_seen === 0) {
                  count++;
                } else if (message.sender === 'user') {
                  break; // Stop counting when we hit a user message
                }
              }

              console.log('Unread messages count updated:', count);
              setUnreadCount(count);
            },
            (error) => {
              console.error('Error listening to unread messages:', error);
              setUnreadCount(0);
            }
          );
      } catch (error) {
        console.error('Error setting up unread messages listener:', error);
        setUnreadCount(0);
      }
    };

    setupListener();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isUserData?.jwt]);

  return unreadCount;
};


  export const versionApp = async () => {
    try {
      let update = await checkVersion()
      if (update.needsUpdate) {
        Alert.alert(
          'Please Update',
          'You will have to update your app to the latest version to continue using.',
          [{ text: 'Update', onPress: () => { BackHandler.exitApp(); Linking.openURL(update.url) } },],
        );
      }
    } catch (error) {
      console.log('errror', error)
    }
  }

export const PressableButton = (title: any, onPress: any, isLoader = false) => {
    return (
        <TouchableOpacity style={styles.getStartedButton} onPress={onPress} disabled={isLoader}>
            <TextPoppinsSemiBold style={styles.buttonText}>{title}</TextPoppinsSemiBold>
            <RightArrowIcon height={40} width={40} />
        </TouchableOpacity>
    )
}
export const PressableB = (title: any, onPress: any,isLoader = false) => {
    return (
        <TouchableOpacity style={isLoader ? styles.loaderButton : styles.getButton} onPress={onPress} disabled={isLoader}>
            <TextPoppinsMediumBold style={styles.buttonText}>{title}</TextPoppinsMediumBold>
        </TouchableOpacity>
    )
}

export const alreadyAccountView = (title: string, buttonTitle: string, onPress: any) => {
    return (
        <View style={styles.loginContainer}>
            <Text style={styles.loginTextAlready}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.loginText}>{buttonTitle}</Text>
            </TouchableOpacity>
        </View>
    )
}

export const titleViewIcon = (title: any, onPressPlus?: any) => {
    return (
        <View style={styles.titleView}>
            <TextPoppinsMediumBold style={styles.titleTextStle}>{title}</TextPoppinsMediumBold>
            <Pressable style={ShippingAddressStyle.plusIconViewCheckout} onPress={onPressPlus}>
                <PlusButtonIcon height={40} width={40} color={MDBLUE} />
            </Pressable>
        </View>
    )
}

export const RenderItem = ({ item, onDetailPress }: any) => {
    const { t } = useTranslation();
    console.log(item)
    return (
        <View style={MyOrdersStyle.renderView}>
            <View style={MyOrdersStyle.subBody}>
                <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, width: widthPercentageToDP(60) }}>{t('Order_No')} {item?.order_number}</TextPoppinsSemiBold>
                <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GRAY }}>{moment(item?.order_date).format('DD MMM YYYY')}{ }</TextPoppinsSemiBold>
            </View>
            <View style={MyOrdersStyle.dividerStyle} />
            <View style={MyOrdersStyle.subBody}>
                <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GREY }}>{t('Quantity')}: <TextPoppinsSemiBold style={MyOrdersStyle.titleStyle}>{calculateTotalQuantity(item.order_details, 'quantity')}</TextPoppinsSemiBold></TextPoppinsSemiBold>
                <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GREY }}>{t('Total_Amount')}: <TextPoppinsSemiBold style={MyOrdersStyle.titleStyle}>₹{item.final_amount}</TextPoppinsSemiBold></TextPoppinsSemiBold>
            </View>
            <View style={MyOrdersStyle.subBody}>
                <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: item?.status === 'Pending' ? MDBLUE : item?.status === 'Confirmed' ? GREEN : 'defaultColor', }}>{item?.status}</TextPoppinsSemiBold>
                {onDetailPress && <TouchableOpacity style={MyOrdersStyle.detailButton} onPress={() => onDetailPress(item)}>
                    <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: WHITE }}>Detail</TextPoppinsSemiBold>
                </TouchableOpacity>}
                {!onDetailPress && item?.promo_code_discount > 0 && <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GREY }}>{t('PROMO_CODE_DISCOUNT')}: <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GREEN }}> ₹{item?.promo_code_discount || 0}</TextPoppinsSemiBold></TextPoppinsSemiBold>}
                {!onDetailPress && item?.used_wallet_amount > 0 && <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GREY }}>{t('WALLET')}: <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GREEN }}> ₹{item?.used_wallet_amount || 0}</TextPoppinsSemiBold></TextPoppinsSemiBold>}
            </View>
        </View>
    )
}
export const CustomButton = (title: any, onPress: any) => {
    return (
        <TouchableOpacity style={styles.customButton} onPress={onPress}>
            <TextPoppinsMediumBold style={styles.buttonTxt}>{title}</TextPoppinsMediumBold>
        </TouchableOpacity>
    )
}
// Profile Image Component with fallback handling
const ProfileImageWithFallback = ({ profileDetail, style, onPress }: any) => {
    const [imageError, setImageError] = useState(false);
    const regexImage = /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    
    // Check if user has a valid profile image
    const hasValidImage = !imageError && 
                         profileDetail?.client_image && 
                         typeof profileDetail.client_image === 'string' && 
                         profileDetail.client_image.trim() !== '' && 
                         regexImage.test(profileDetail.client_image);
    
    return (
        <Pressable onPress={onPress} style={style}>
            {hasValidImage ? (
                <Image
                    source={{ uri: profileDetail.client_image }}
                    style={styles.profileImage}
                    resizeMode={'cover'}
                    onError={() => {
                        console.log('Failed to load profile image, using default');
                        setImageError(true);
                    }}
                />
            ) : (
                <Image 
                    source={require("../../assets/defaultProfile.png")}
                    style={styles.profileImage}
                    resizeMode="cover"
                />
            )}
        </Pressable>
    );
};

export const headerView = (title: any, subTitle: any, sideBarPress: any, totalItems: any, navigation: any, currentRoute?: string) => {
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
    const unreadMessages = useUnreadMessages(); // Fetch unread messages directly
    const { t } = useTranslation();
    console.log(currentRoute)
    
    // Animation for offer icon blinking effect
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    useEffect(() => {
        // Only animate if not on offer screen
        if (currentRoute !== OFFER_SCREEN) {
            const blinkAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.3,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            blinkAnimation.start();
            
            return () => {
                blinkAnimation.stop();
            };
        } else {
            // Reset scale when on offer screen
            scaleAnim.setValue(1);
        }
    }, [currentRoute, scaleAnim]);
    
    // Get user category
    const userCategory = profileDetail?.client_category || '';
    console.log('User Category:', userCategory);
    
    // Categories mapping for icons
    const categories = {
        'gold': '🥇',
        'diamond': '💎',
        'platinum':'🏆',
        'silver':'🥈',
        'raw':'⚙️'
    }
    
    // Function to get category icon from the categories map
    const getCategoryIcon = () => {
        if (!userCategory) return '';
        
        const categoryLower = userCategory.toLowerCase().trim();
        
        // Handle special cases
        if (categoryLower.includes('gold') && categoryLower.includes('r')) {
            return '🔁'; // Return icon for Gold (R)
        }
        
        if (categoryLower.includes('gold')) {
            return '🥇';
        }
        if (categoryLower.includes('diamond')) {
            return '💎';
        }
        if (categoryLower.includes('platinum')) {
            return '🏆';
        }
        if (categoryLower.includes('silver')) {
            return '🥈';
        }
        if (categoryLower.includes('raw')) {
            return '⚙️';
        }
        
        return '⚙️'; // Default fallback
    };
    
    // Function to get localized category name
    const getLocalizedCategoryName = () => {
        if (!userCategory) return '';
        
        const categoryLower = userCategory.toLowerCase().trim();
        
        // Handle special cases with variations
        if (categoryLower.includes('gold') && categoryLower.includes('r')) {
            return t('CATEGORY_GOLD_R');
        }
        
        switch (categoryLower) {
            case 'diamond':
                return t('CATEGORY_DIAMOND');
            case 'platinum':
                return t('CATEGORY_PLATINUM');
            case 'gold':
                return t('CATEGORY_GOLD');
            case 'silver':
                return t('CATEGORY_SILVER');
            case 'raw':
                return t('CATEGORY_RAW');
            default:
                return userCategory; // Fallback to original if not found
        }
    };
    
    return (
        <View style={DashboardStyle.mainViewHeader}>
            <ProfileImageWithFallback 
                profileDetail={profileDetail}
                style={styles.profileImageContainer}
                onPress={sideBarPress}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <TextPoppinsMediumBold style={DashboardStyle.titleSytle}>
                    {title}
                </TextPoppinsMediumBold>
                <TextPoppinsSemiBold style={DashboardStyle.subtitleStyle}>
                    {t('Category')}: {getLocalizedCategoryName()} {getCategoryIcon()}
                </TextPoppinsSemiBold>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end',padding:0 }}> 
            <TouchableOpacity 
                style={styles.OfferIcon} 
                onPress={() => navigation.navigate(OFFER_SCREEN)}
            >
                {/* <Animated.View style={{ transform: [{ scale: currentRoute === OFFER_SCREEN ? 1 : scaleAnim }] }}> */}
                  
                        <View style={styles.gifContainer}>
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
                                                        width: ${OFFER_GIF_CONFIG.width}px;
                                                        height: ${OFFER_GIF_CONFIG.height}px;
                                                        object-fit: contain;
                                                        border-radius: 4px;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                <img src="${OFFER_GIF_CONFIG.url}" alt="${OFFER_GIF_CONFIG.alt}">
                                            </body>
                                        </html>
                                    `
                                }}
                                style={styles.webViewStyle}
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
            
                {/* </Animated.View> */}
                {/* <Text style={[styles.headerIconText, currentRoute === OFFER_SCREEN && styles.activeIconText]}>
                    {t('OFFERS_ICON')}
                </Text> */}
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.headerIconContainer, { position: "relative" }]} 
                onPress={() => navigation.navigate(CHAT_SCREEN)}
            >
                {currentRoute === CHAT_SCREEN ? (
                    <HighlightedMessageIcon width={24} height={24} />
                ) : (
                    <MessageIcon width={24} height={24} color={BLACK} />
                )}
                {typeof unreadMessages === 'number' && unreadMessages > 0 && currentRoute !== CHAT_SCREEN && (
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>
                            {unreadMessages > 99 ? '99+' : String(unreadMessages)}
                        </Text>
                    </View>
                )}
                {/* <Text style={[styles.headerIconText, currentRoute === CHAT_SCREEN && styles.activeIconText]}>
                    {t('CHAT_ICON')}
                </Text> */}
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.headerIconContainer, { position: "relative", marginRight: 10 }]} 
                onPress={() => navigation.navigate(MYCART_SCREEN, { showPromoCodePopup: false })}
            >
                <CartSvg width={24} height={24} />
                {totalItems > 0 && (
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>
                            {totalItems}
                        </Text>
                    </View>
                )}
                {/* <Text style={styles.headerIconText}>
                    {t('CART_ICON')}
                </Text> */}
            </TouchableOpacity>
            </View>
        </View>
    )
}

export const headerViewReferral = (title: any, subTitle: any, sideBarPress: any) => {
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
    
    return (
        <View style={DashboardStyle.mainViewHeader}>
            <ProfileImageWithFallback 
                profileDetail={profileDetail}
                style={styles.profileImageContainer}
                onPress={sideBarPress}
            />
            <View style={{ flex: 1 }}>
                <Text style={DashboardStyle.titleSytleReferral}>
                    {title}
                </Text>
                <Text style={DashboardStyle.subtitleStyleReferral}>
                    {subTitle}
                </Text>
            </View>
            <NotificationIcon height={24} width={24} color={WHITE} />
        </View>
    )
}

export const getDateFormat = (date: any, format = "DD MMM") => {
    return date ? moment(date).format(format) : "";
}


export const calculateTotal = (dataArray: any, key: any) => {
    if (!Array.isArray(dataArray)) {
        return 0;
    }
    if (typeof key !== "string") {

        return 0;
    }

    return dataArray.reduce((total, item) => {
        const value = parseFloat(item[key]) || 0;
        return total + value;
    }, 0);
};
export const calculateTotalQuantity = (dataArray: any, key: any) => {
    if (!Array.isArray(dataArray)) {
        return 0;
    }
    if (typeof key !== "string") {

        return 0;
    }

    return dataArray.reduce((total, item) => {
        const value = parseFloat(item[key]) || 0;
        return total + value;
    }, 0);
};

export function isObjectEmpty(obj: any) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

const styles = StyleSheet.create({
    titleView: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 10
    },
    titleTextStle: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 22
    },
    getStartedButton: {
        flexDirection: 'row',
        backgroundColor: MDBLUE,
        paddingVertical: 10,
        borderRadius: 50,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    getButton: {
        backgroundColor: MDBLUE,
        borderRadius: 50,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        height: 52,
        marginBottom: 10
    },
    buttonText: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 21,
        marginHorizontal: 10,
   
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,

    },
    loginText: {
        color: BLACK,
        fontWeight: '500',
        lineHeight: 19
    },
    loginTextAlready: {
        color: MD_GRAY_Dark,
        fontWeight: '400',
        lineHeight: 19
    },
    customButton: {
        backgroundColor: MDBLUE,
        paddingVertical: 10,
        borderRadius: 50,
        paddingHorizontal: 10,
        height: 50,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    buttonTxt: {
        color: BLACK,
        fontSize: 20,
        lineHeight: 34
    },
    loaderButton:{
        backgroundColor: WHITE_GRAY,
        borderRadius: 50,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        height: 52,
        marginBottom: 10
    },
    profileImageContainer: {
        width: 41,
        height: 41,
        borderRadius: 20.5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 41,
        height: 41,
        borderRadius: 20.5,
    },
    headerIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // marginRight: 15,
        padding: 4,
        marginHorizontal:8
        // minWidth: 50,
    },
    OfferIcon:{
        alignItems: 'center',
        justifyContent: 'center',
        // marginRight: 15,
        // padding: 4,
        // minWidth: 50,
    },
    headerIconText: {
        fontSize: 10,
        color: GRAY,
        textAlign: 'center',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
    activeIconText: {
        color: MDBLUE,
        fontWeight: '600',
    },
    badgeContainer: {
        position: "absolute", 
        top: -3, 
        right: -3, 
        backgroundColor: "red", 
        borderRadius: 10, 
        width: 20, 
        height: 20, 
        justifyContent: "center", 
        alignItems: "center",
        zIndex: 1,
    },
    badgeText: {
        color: "white", 
        fontSize: 12, 
        fontWeight: "bold"
    },
    gifContainer: {
        width: OFFER_GIF_CONFIG.width,
        height: OFFER_GIF_CONFIG.height,
        borderRadius: 4,
        overflow: 'hidden',
    },
    webViewStyle: {
        width: OFFER_GIF_CONFIG.width,
        height: OFFER_GIF_CONFIG.height,
        backgroundColor: 'transparent',
    },
})