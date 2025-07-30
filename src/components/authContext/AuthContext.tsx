/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ASYNC_STORAGE } from '../../shared/utilities/String';

export const MyContext = createContext<any | undefined>(undefined);

export function useAuthContext() {
    return useContext(MyContext);
}

export function MyContextProvider({ children }: any) {
    const [state, setState]: any = useState({
        isIntroSliderDone: false,
        isAuthenticated: false,
        isUserinfo: false,
        isLogininfo: false
    });
    // useEffect(() => { }, [state])

    useEffect(() => {
        async function getUserFromStorage() {
            try {
                const response: any = await AsyncStorage.multiGet([
                    ASYNC_STORAGE.ISINTROSLIDERDONE,
                    ASYNC_STORAGE.ISAUTHENTICATED,
                    ASYNC_STORAGE.ISUSERINFO,
                    ASYNC_STORAGE.ISLOGININFO
                ]);
                setState((prevState: any) => ({
                    ...prevState,
                    isIntroSliderDone: response[0]?.[1] || false,
                    isAuthenticated: response[1]?.[1] || false,
                    isUserinfo: response[2]?.[1] || false,
                    isLogininfo: response[3]?.[1] || false
                }));
            } catch (error) {
                const response: any = await AsyncStorage.multiGet([
                    ASYNC_STORAGE.ISINTROSLIDERDONE,
                    ASYNC_STORAGE.ISAUTHENTICATED,
                    ASYNC_STORAGE.ISUSERINFO,
                    ASYNC_STORAGE.ISLOGININFO
                ]);
                setState((prevState: any) => ({
                    ...prevState,
                    isIntroSliderDone: response[0]?.[1] || false,
                    isAuthenticated: response[1]?.[1] || false,
                    isUserinfo: response[2]?.[1] || false,
                    isLogininfo: response[3]?.[1] || false
                }));
                console.log('Error retrieving user from storage:', error);
            }
        }
        getUserFromStorage();
    }, []);

    const updateState = async (name: any, value: any) => {
        try {
            await AsyncStorage.setItem(name, value);
            setState((prevState: any) => ({
                ...prevState,
                [name]: value,
            }));
        } catch (error) {
            console.log('Error storing state in AsyncStorage:', error);
        }
    };


    const logout = () => {
        setState({ ...state, isAuthenticated: false });
        AsyncStorage.multiRemove([
            ASYNC_STORAGE.ISAUTHENTICATED,
        ]);
    };

    return (
        <MyContext.Provider value={{ state, updateState, logout }}>
            {children}
        </MyContext.Provider>
    );
}