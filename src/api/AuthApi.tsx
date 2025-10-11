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
    console.log(requestBody)
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
const removeCartItem = (requestBody: any,accessToken:any) => {
    const url = `${AUTH_API_URL}cart-remove.php`;
     return authAxios.delete(url, {data:requestBody});
}

const createPost = (requestBody: any) => {

    const url = `${AUTH_API_URL}farmer-post-get-details.php?action=add_post`;
    return authAxios.post(url, requestBody);
}
const getPosts = () => {
    const url = `${AUTH_API_URL}farmer-post-get-details.php?action=get_posts`;
    return authAxios.get(url);
}

const likePost = (requestBody: any) => {
    const url = `${AUTH_API_URL}farmer-post-get-details.php?action=like_post`;
    return authAxios.post(url, requestBody);
}


const addComment = (requestBody: any) => {
    const url = `${AUTH_API_URL}farmer-post-get-details.php?action=add_comment`;
    return authAxios.post(url, requestBody);
}
const getOffer = (requestBody: any) => {
    const url = `${AUTH_API_URL}offer.php`;
    return authAxios.get(url, requestBody);
}

const confirmOrder = (requestBody: any) => {
    const url = `${AUTH_API_URL}order-place.php`;
    return authAxios.post(url, requestBody)
}

const getBanners = () => {
    const url = `${AUTH_API_URL}banners.php`;
    return authAxios.get(url);
}

const getYouTubeVideos = () => {
    const url = `${AUTH_API_URL}youtube-link.php`;
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

const getMyCrops = (payload: any) => {
    const url = `farming-crop-details.php`;
    return authAxios.post(url, payload);
}

const addToMyCrops = (payload: any) => {
    const url = `farming-crop-update.php`;
    return authAxios.post(url, payload);
}

const updateMyCrops = (payload: any) => {
    const url = `farming-crop-update.php`;
    return authAxios.put(url, payload);
}

const deleteMyCrops = (payload: any) => {
    const url = `farming-crop-update.php`;
    return authAxios.delete(url, { data: payload });
}

const initiatePayment = (requestBody: any) => {
    console.log(requestBody)
    const url = `Initiate-Payment.php`;
    return authAxios.post(url, requestBody);
}

const webhookPayment = (requestBody: any) => {
    const url = `Webhook-Payment.php`;
    return authAxios.post(url, requestBody);
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
    console.log("Payload for crop mapping:", payload);
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

const getCrops = () => {
    const url = `${AUTH_API_URL}crop-master.php`;
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
    console.log(payload)
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
    createPost,
    getPosts,
    likePost,
    addComment,
    confirmOrder,
    getBanners,
    CropProduct,
    getCrops,
    getMyCrops,
    initiatePayment,
    webhookPayment,
    addToMyCrops,
    updateMyCrops,
    deleteMyCrops,
    getOffer,
    orderHistory,
    cropStages,
    cropMapping,
    updateProfile,
    productDescription,
    getShppingAddress,
    addShppingAddress,
    updateShppingAddress,
    getCategory,
    getYouTubeVideos,
    getCropByCategoryId,
    getPromoCodeList,
    updatePromoCode,
    getProfileDetails,
    uploadProfileImage,
    getWalletDetails,
    useWallet
}

