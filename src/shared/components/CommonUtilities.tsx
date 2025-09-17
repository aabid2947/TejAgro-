import { useTranslation } from "react-i18next"
import { Alert, BackHandler, Image, Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import React, { useState } from "react"
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
import { MYCART_SCREEN } from "../../routes/Routes"
import { ShippingAddressStyle } from "../../screens/shippingAddress/ShippingAddressStyle"
import PlusButtonIcon from "../../svg/PlusButtonIcon"
import { checkVersion } from "react-native-check-version"


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

export const headerView = (title: any, subTitle: any, sideBarPress: any, totalItems: any, navigation: any) => {
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
    
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
                    {subTitle}
                </TextPoppinsSemiBold>
            </View>
            <TouchableOpacity style={{ position: "relative", marginRight: 10 }} onPress={() => navigation.navigate(MYCART_SCREEN, { showPromoCodePopup: false })} >
                <CartSvg width={24} height={24} />
                {totalItems > 0 && (
                    <View style={{ position: "absolute", top: -5, right: -10, backgroundColor: "red", borderRadius: 10, width: 20, height: 20, justifyContent: "center", alignItems: "center", }}>
                        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
                            {totalItems}
                        </Text>
                    </View>)}
            </TouchableOpacity>
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
    }
})