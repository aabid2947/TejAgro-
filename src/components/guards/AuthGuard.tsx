import React, { ReactNode } from 'react';
import { StatusBar } from 'react-native';
import { BLACK } from '../../shared/common-styles/colors';
import AuthNavigator from './AuthNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }: any) => {
    const login = useSelector((state: RootState) => state.counter.login)
    if (login) {
        return <>{children}</>
    } else {
        return (
            <>
                <StatusBar backgroundColor={BLACK} barStyle="light-content" />
                <AuthNavigator />
            </>
        );
    }
};

export default AuthGuard;