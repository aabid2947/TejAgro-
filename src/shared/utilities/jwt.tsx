import React from "react";
import { jwtDecode } from 'jwt-decode';
import { useSelector } from "react-redux";
import { RootState } from "../../reduxToolkit/store";
const userData: any = useSelector((state: RootState) => state.counter.isUserinfo)

const decodeToken = (token: string) => {
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.log('Error decoding JWT token:', error);
        return null;
    }
};

const token = userData?.jwt;
export const decodedToken: any = decodeToken(token);