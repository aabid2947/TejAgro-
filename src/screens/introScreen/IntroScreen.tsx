import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { IntroScreenStyles } from './IntroScreenStyle';
import { WHITE } from '../../shared/common-styles/colors';
import RightArrowIcon from '../../svg/RightArrowIcon';
import { REGESTRATION_SCREEN, SIGIN_SCREEN } from '../../routes/Routes';
import { alreadyAccountView, PressableButton } from '../../shared/components/CommonUtilities';
import TextPoppinsBold from '../../shared/fontFamily/TextPoppinsBold';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const IntroScreen = ({ navigation }: any) => {

    const insets= useSafeAreaInsets();
    const loginOnPress = () => {
        navigation.navigate(SIGIN_SCREEN)
    }

    const getStartedPress = () => {
        navigation.navigate(REGESTRATION_SCREEN)
    }

    return (
        <SafeAreaView style={{ ...IntroScreenStyles.container, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <View style={IntroScreenStyles.contentContainer}>
                <Image
                    source={require("../../assets/IntroBackground.png")} // replace with actual image URL
                    style={IntroScreenStyles.backgroundImage}
                />
                <View style={IntroScreenStyles.logoContainer}>
                    <Image
                        source={require("../../assets/tej-logo.png")} // replace with actual logo URL
                        style={IntroScreenStyles.logo}
                    />
                </View>
                <View style={IntroScreenStyles.textOverlay}>
                    <TextPoppinsSemiBold style={IntroScreenStyles.title}>
                        Superior Quantity, {'\n'}
                        Unmatched Agro {'\n'}
                        Excellence {'\n'}
                    </TextPoppinsSemiBold>
                </View>
                <View style={{ backgroundColor: WHITE, borderTopRightRadius: 40, borderTopLeftRadius: 40, paddingTop: 20 }}>
                    <View style={{ marginBottom: 10 }}>
                        {PressableButton("GET STARTED", loginOnPress)}
                    </View>
                    {/* {alreadyAccountView("Already a member?", " Login", loginOnPress)} */}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default IntroScreen;
