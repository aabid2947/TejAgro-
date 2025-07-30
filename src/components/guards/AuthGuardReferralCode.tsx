import React from 'react'
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux'
import ReferralScreen from '../../screens/authScreen/ReferralScreen';
import { RootState } from '../../reduxToolkit/store';

const AuthGuardReferralCode = ({ children }: any) => {
    const referralDetails = useSelector((state: RootState) => state.counter.isReferral)
    if (referralDetails) {
        return <>{children}</>
    } else {

        return (
            <React.Fragment>
                <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
                <ReferralScreen />
            </React.Fragment>
        );;
    }
}

export default AuthGuardReferralCode;
