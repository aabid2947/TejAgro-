/* eslint-disable prettier/prettier */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { INTRO_SCREEN, OTP_SCREEN, REFERRAL_SCREEN, REGESTRATION_SCREEN, SIGIN_SCREEN } from '../../routes/Routes';
import LogInScreen from '../../screens/authScreen/LogInScreen';
import IntroScreen from '../../screens/introScreen/IntroScreen';
import OtpScreen from '../../screens/OtpScreen/OtpScreen';
import Registration from '../../screens/registerScreen/Registration';
import ReferralScreen from '../../screens/authScreen/ReferralScreen';

export type RootStackParamList = {
    SignIn: any,
    ForgotScreen: any,
    OtpScreen: any
    IntroScreen: any
    Registration: any
    referralScreen: any
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator(): JSX.Element {
    return (
        <>
            <RootStack.Navigator>
                <RootStack.Screen options={{ headerShown: false }} name={INTRO_SCREEN} component={IntroScreen} />
                <RootStack.Screen options={{ headerShown: false }} name={SIGIN_SCREEN} component={LogInScreen} />
                <RootStack.Screen options={{ headerShown: false }} name={OTP_SCREEN} component={OtpScreen} />
                <RootStack.Screen options={{ headerShown: false }} name={REFERRAL_SCREEN} component={ReferralScreen} />
                <RootStack.Screen options={{ headerShown: false }} name={REGESTRATION_SCREEN} component={Registration} />
            </RootStack.Navigator>
        </>
    );
}

export default AuthNavigator;