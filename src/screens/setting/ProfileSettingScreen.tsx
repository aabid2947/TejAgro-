/* eslint-disable prettier/prettier */
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, TouchableOpacity, View, Text, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import DropdownPicker from "../../components/dropdownpicker/DropDownPicker";
import { languageSelection } from "../../reduxToolkit/counterSlice";
import { RootState } from "../../reduxToolkit/store";
import { MY_PROFILE } from "../../routes/Routes";
import { commonStyles } from "../../shared/common-styles/styles";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold";
import ArrowIcon from "../../svg/ArrowIcon";
import BelowIcon from "../../svg/BelowIcon";
import { settingStyle } from "./SettingStyle";
import { regexImage } from "../../shared/utilities/String";
import { GRAY } from "../../shared/common-styles/colors";
import CallHelpSvg from "../../svg/CallHelpSvg";

export const LANGUAGES = [
    { name: 'English', value: 'en' },
    { name: 'मराठी', value: 'mr' }
]

const languageEnum: any = {
    en: "English",
    mr: 'मराठी'
}

const ProfileSettingScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const refStateRBSheet: any = useRef();
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
    const languageSelected = useSelector((state: RootState) => state.counter.languageSelected);

    const handleLanguageChange = async (language: any, name: any) => {
        try {
            dispatch(languageSelection(name));
        } catch (error) {
            console.log("Error updating language:", error);
        }
    };

    const renderDropdown = () => (
        <View style={[commonStyles.mainBody, commonStyles.mainSubBody]}>
            <TextPoppinsMediumBold style={settingStyle.languageTitle}>
                {t("Select Language")}
            </TextPoppinsMediumBold>
            <TouchableOpacity style={settingStyle.dropdownContainer} onPress={() => refStateRBSheet?.current?.open()}>
                <View style={settingStyle.dropdownRow}>
                    <Text style={settingStyle.selectedLanguage}>
                        {languageEnum[languageSelected]}
                    </Text>
                    <BelowIcon width={15} height={15} />
                </View>
            </TouchableOpacity>
            <DropdownPicker
                key="Language"
                placeHolderText="Language"
                refRBSheet={refStateRBSheet}
                options={LANGUAGES}
                onSelect={(language: any) => {
                    handleLanguageChange(language.name, language.value);
                    refStateRBSheet?.current?.close();
                }}
            />
        </View>
    );

    const dataItems = (Icon: any, title: any, navigationFn?: any) => (
        <View style={[commonStyles.mainBody, commonStyles.mainSubBody]}>
            <TouchableOpacity onPress={navigationFn ? navigationFn : () => { }}>
                <View style={settingStyle.dataRow}>
                    <TextPoppinsMediumBold style={settingStyle.commonText}>
                        {t(title)}
                    </TextPoppinsMediumBold>
                    <Icon width={18} height={20} />
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={settingStyle.mainCardView}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t('SETTING_PROFILE')}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={settingStyle.imageView}>
                    {regexImage.test(profileDetail?.client_image) ? (
                        <Image
                            source={

                                { uri: profileDetail?.client_image }
                            }
                            style={settingStyle.profileImage}
                            resizeMode={'contain'}
                        />
                    ) : (
                        <Image source={require("../../assets/defaultProfile.png")}
                            style={settingStyle.profileImage}
                            resizeMode="contain"
                        />
                    )}
                    <TextPoppinsSemiBold style={{ ...settingStyle.commonTxt, ...settingStyle.emailTxt }}>{profileDetail?.client_name || ""}</TextPoppinsSemiBold>
                </View>
                {dataItems(ArrowIcon, "MY_PROFILE", () => navigation.navigate(MY_PROFILE, profileDetail?.client_name))}
                {renderDropdown()}

                <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20, borderTopWidth: 1, borderTopColor: "#D9D9D9", paddingTop: 20 }}>
                    <TextPoppinsMediumBold style={{ fontSize: 22, lineHeight: 30, color: GRAY }}>
                        {t("CUSTOMER_CARE_NO")}
                    </TextPoppinsMediumBold>
                    <TouchableOpacity onPress={() => { Linking.openURL("tel:+91 91305 30591"); }}>
                        <TextPoppinsMediumBold style={{ fontSize: 22, lineHeight: 30, marginTop: 10 }}>
                            <CallHelpSvg /> +91 91305 30591
                        </TextPoppinsMediumBold>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileSettingScreen;