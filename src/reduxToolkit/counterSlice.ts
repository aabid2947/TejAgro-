import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
interface WalletInfo {
    min_order_value?: number;
    status?: number;
    wallet_max_amount?: number;
    wallet_opening?: number;
}

export interface CounterState {
    value: number,
    login: boolean,
    isUserVerify: boolean,
    languageSelected: string,
    isUserinfo: { jwt: string; },
    selectedCrop: [],
    selectAddress: {},
    promoCodeId: {},
    isProfileInfo: {},
    isReferral: boolean,
    totalItems: number,
    wallet: WalletInfo
}

const initialState: CounterState = {
    value: 0,
    login: false,
    isUserVerify: false,
    languageSelected: 'mr',
    isUserinfo: { jwt: '' },
    selectedCrop: [],
    selectAddress: {},
    promoCodeId: {},
    isProfileInfo: {},
    isReferral: false,
    totalItems: 0,
    wallet: {},
}

export const counterSlice = createSlice({
    name: 'isLogin',
    initialState,
    reducers: {
        login: (state, action: any) => {
            state.login = true
            state.isUserVerify = true
            state.isUserinfo = action.payload || {}
        },
        isLogOut: (state) => {
            state.login = false
            state.isUserVerify = false
            state.isUserinfo = { jwt: '' }
            state.selectedCrop = []
            state.selectAddress = {}
            state.promoCodeId = {}
            state.isProfileInfo = {}
            state.totalItems = 0
        },
        isUserVerify: (state, action: PayloadAction<boolean>) => {
            state.isUserVerify = action.payload
        },
        languageSelection: (state, action: PayloadAction<string>) => {
            state.languageSelected = action.payload
        },
        selectedCropProduct: (state, action: any) => {
            state.selectedCrop = action.payload
        },
        selectedShippingAddress: (state, action: any) => {
            state.selectAddress = action.payload
        },
        selectedPromoCode: (state, action: any) => {
            state.promoCodeId = action.payload
        },
        clearSelectedPromoCode: (state) => {
            state.promoCodeId = {};
        },
        profileDetail: (state, action: any) => {
            state.isProfileInfo = action.payload || {}
        },
        referralDetails: (state) => {
            state.isReferral = true
        },
        setTotalItems: (state, action: PayloadAction<number>) => {
            state.totalItems = action.payload;
        },
        walletDetails: (state, action: any) => {
            state.wallet = action.payload.length > 0 ? action.payload[0] || {} : {}
        },
    },
})

export const { login, isLogOut, isUserVerify, languageSelection, selectedCropProduct, selectedShippingAddress, selectedPromoCode, clearSelectedPromoCode, profileDetail, referralDetails, setTotalItems, walletDetails } = counterSlice.actions
export default counterSlice.reducer