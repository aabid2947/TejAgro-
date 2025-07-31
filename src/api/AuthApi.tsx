import axios from 'axios';
import { AUTH_API_URL } from './environment';
import authAxios from './axiosAuth';

const mobileSignIn = (requestBody: any) => {
    const url = `${AUTH_API_URL}otp.php`;
    return axios.post(url, requestBody);
}

const verifyOTP = (requestBody: any) => {
    const url = `${AUTH_API_URL}login.php`;
    return axios.post(url, requestBody);
}

const getProductList = () => {
    const url = `product-list.php`;
    return authAxios.get(url);
}

const searchProduct = (requestBody: any, accessToken: string) => {
    const url = `${AUTH_API_URL}product-search.php`;
    return axios.post(url, requestBody, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`
        }
    })
}


const getProductDetailById = (requestBody: any, accessToken: string) => {

    const url = `${AUTH_API_URL}product-details.php`;
    return axios.post(url, requestBody, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`
        }
    })
}

const addToCart = (requestBody: any, accessToken: string) => {
    const url = `${AUTH_API_URL}cart-add.php`;
    return axios.post(url, requestBody, {
        headers: {
            "Content-Type": "application/json",
            Authorization: ` ${accessToken}`
        }
    })
}

const getCartDetails = (requestBody: any, accessToken: any) => {
    const url = `${AUTH_API_URL}cart-details.php`;
    return axios.post(url, requestBody,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: ` ${accessToken}`
            }
        }
    )
}
const updateCart = (payload: any,accessToken:any) => {
    const url = `${AUTH_API_URL}cart-update.php`;
    return axios.put(url, payload,  {
            headers: {
                "Content-Type": "application/json",
                Authorization: ` ${accessToken}`
            }
        });
}
const removeCartItem = (requestBody: any) => {
    const url = `${AUTH_API_URL}cart-remove.php`;
    return authAxios.post(url, requestBody);
}

const confirmOrder = (requestBody: any) => {
    console.log(requestBody, "request body for confirm order");
    const url = `${AUTH_API_URL}order-place.php`;
    return authAxios.post(url, requestBody)
}

const getBanners = () => {
    const url = `${AUTH_API_URL}banners.php`;
    return authAxios.get(url);
}

const CropProduct = (id: any, accessToken: string) => {
    const url = `${AUTH_API_URL}crop-product.php`;
    return axios.post(url, id, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`
        }
    })
}

const getCrops = () => {
    const url = `${AUTH_API_URL}crop-master.php`;
    return authAxios.get(url);
}

const orderHistory = (payload: any) => {
    console.log("Payload for order history:", payload);
    const url = `order-history.php`;
    return authAxios.post(url, payload)
}

const cropStages = (payload: any) => {
    const url = `crop-stage.php`;
    return authAxios.post(url, payload);
}

const cropMapping = (payload: any) => {
    const url = `crop-mapping.php`;
    return authAxios.post(url, payload);
}
const updateProfile = (payload: any) => {
    const url = `update-profile.php`;
    return authAxios.put(url, payload);
}
const productDescription = (payload: any) => {
    const url = `product-description.php`;
    return authAxios.post(url, payload);
}
const getShppingAddress = (payload: any) => {
    const url = `shipping-address-read.php`;
    return authAxios.post(url, payload);
}
const addShppingAddress = (payload: any) => {
    const url = `shipping-address-add.php`;
    return authAxios.post(url, payload);
}
const updateShppingAddress = (payload: any) => {
    const url = `shipping-address-update.php`;
    return authAxios.put(url, payload);
}
const getCategory = () => {
    const url = `crop-category.php`;
    return authAxios.get(url);
}
const getCropByCategoryId = (payload: any) => {
    const url = `category-wise-all-crop.php`;
    return authAxios.post(url, payload);
}
const getPromoCodeList = () => {
    const url = `all-promo-code.php`;
    return authAxios.get(url);
}
const updatePromoCode = (payload: any) => {
    const url = `promo-code.php`;
    return authAxios.post(url, payload);
}
const getProfileDetails = () => {
    
    const url = `profile-details.php`;
    return authAxios.get(url);
}
const uploadProfileImage = (payload: any) => {
    const url = `update-profile-image.php`;
    return authAxios.post(url, payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const getWalletDetails = (payload: any, accessToken?: any) => {
    if (accessToken) {
        const url = `${AUTH_API_URL}wallet-master.php`;
        return axios.post(url, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${accessToken}`
            }
        });
    }
    const url = `wallet-master.php`;
    return authAxios.get(url, payload);
}

const useWallet = (payload: any) => {
    const url = `use-wallet.php`;
    return authAxios.post(url, payload);
}



export default {
    mobileSignIn,
    verifyOTP,
    getProductList,
    searchProduct,
    getProductDetailById,
    addToCart,
    getCartDetails,
    updateCart,
    removeCartItem,
    confirmOrder,
    getBanners,
    CropProduct,
    getCrops,
    orderHistory,
    cropStages,
    cropMapping,
    updateProfile,
    productDescription,
    getShppingAddress,
    addShppingAddress,
    updateShppingAddress,
    getCategory,
    getCropByCategoryId,
    getPromoCodeList,
    updatePromoCode,
    getProfileDetails,
    uploadProfileImage,
    getWalletDetails,
    useWallet
}