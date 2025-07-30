import React, { useEffect, useState, ReactNode } from 'react';
import NetInfo from "@react-native-community/netinfo";
import NoInternetScreen from '../../shared/components/NoInternetScreen';

interface InternetAuthGuardProps {
    children: ReactNode;
}

const InternetAuthGuard = ({ children }: InternetAuthGuardProps) => {
    const [isConnected, setConnected] = useState(true);
    const [isConnectedWifi, setConnectedWifi] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            handleConnectivityChange(state.isConnected);
            handleConnectivityChangeToWifi(state.isWifiEnabled);
        });

        return () => {
            unsubscribe();
        };
    }, [NetInfo]);

    const handleConnectivityChange = (_isConnected: any) => {
        setConnected(_isConnected);
    };

    const handleConnectivityChangeToWifi = (_isConnectedWifi: any) => {
        setConnectedWifi(_isConnectedWifi);
    };

    if (isConnected || isConnectedWifi) return <>{children}</>;
    else {
        return <NoInternetScreen />;
    }
};

export default InternetAuthGuard;
