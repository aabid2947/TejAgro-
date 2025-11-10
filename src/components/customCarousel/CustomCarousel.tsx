import React, { useState } from "react";
import { Dimensions, Text, ImageBackground, StyleSheet, View, Image } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import ReCarousel from 'react-native-reanimated-carousel';
import { heightPercentageToDP } from "react-native-responsive-screen";
import { GRAY } from "../../shared/common-styles/colors";
import { WebView } from 'react-native-webview';
import Video from 'react-native-video';
import { usePopup } from '../../contexts/PopupContext';
// Fallback Video component in case react-native-video is not working
// let Video;
// try {
//     Video = require('react-native-video').default;
// } catch (e) {
//     console.log('react-native-video not found, using WebView for videos');
//     Video = null;
// }

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.5)

// Utility function to determine media type
const getMediaType = (url: string): 'video' | 'image' | 'gif' => {
    if (!url) return 'image';

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.avi') ||
        lowerUrl.includes('.wmv') || lowerUrl.includes('.webm') || lowerUrl.includes('.mkv')) {
        return 'video';
    }

    if (lowerUrl.includes('.gif')) {
        return 'gif';
    }

    return 'image';
};

const CustomCaraosel = (banner: any) => {
    const width = Dimensions.get('window').width;
    const [itemIndex, setItemIndex] = React.useState(0);
    const [videoErrors, setVideoErrors] = useState<{ [key: number]: boolean }>({});
    const [gifErrors, setGifErrors] = useState<{ [key: number]: boolean }>({});
    const progressValue = useSharedValue(0);
    const [forcePlay, setForcePlay] = useState(false);
    const { isPopupOpen } = usePopup();

    // Effect to handle video playback when popup state changes
    React.useEffect(() => {
        console.log('CustomCarousel: Popup state changed - isPopupOpen:', isPopupOpen);
        if (!isPopupOpen) {
            // When popup closes, trigger video play after a short delay
            setTimeout(() => {
                setForcePlay(prev => !prev);
                console.log('CustomCarousel: Triggering video play after popup closed');
            }, 100);
        }
    }, [isPopupOpen]);

    const onSnapToItem = (itemIndex: any) => {
        if ((banner?.data || [])?.length == 2) {
            if (itemIndex == 2) {
                setItemIndex(0);
            } else if (itemIndex == 3) {
                setItemIndex(1);
            } else if (itemIndex == 0 || itemIndex == 1) {
                setItemIndex(itemIndex);
            }

        } else {
            setItemIndex(itemIndex);
        }
        progressValue.value = itemIndex;
    }
    return (
        <View style={styles.parentView}>
            <ReCarousel
                loop
                width={width / 1.1}
                height={width / 2.2}
                autoPlay={true}
                data={banner?.data}
                scrollAnimationDuration={5000}
                onSnapToItem={onSnapToItem}
                renderItem={({ item, index }: any) => {
                    // Determine media type and URL based on which field exists
                    let mediaUrl = '';
                    let mediaType = 'image';

                    if (item?.video) {
                        mediaUrl = item.video;
                        mediaType = 'video';
                    } else if (item?.gif) {
                        mediaUrl = item.gif;
                        mediaType = 'gif';
                    } else if (item?.image) {
                        mediaUrl = item.image;
                        // Use getMediaType to detect if image URL is actually a GIF
                        mediaType = getMediaType(item.image);
                    }

                    // console.log('CustomCarousel item:', { mediaUrl, mediaType, item });

                    return (
                        <Animated.View key={index} style={styles.bannerView}>
                            {mediaType === 'video' && mediaUrl && !videoErrors[index] && (
                                <>
                                
                                        <Video
                                            source={{ uri: mediaUrl }}
                                            style={[styles.imgStyle, { width: '100%', height: '100%' }]}
                                            resizeMode="contain"
                                            repeat={true}
                                            muted={true}
                                            controls={false}
                                            paused={isPopupOpen} // Pause video when popup is open
                                            playInBackground={false}
                                            playWhenInactive={false}
                                            ignoreSilentSwitch="ignore"
                                            mixWithOthers="duck"
                                            onError={(error: any) => {
                                                console.log("url:", mediaUrl);
                                                console.log('Video error:', error);
                                                setVideoErrors(prev => ({ ...prev, [index]: true }));
                                            }}
                                            onLoad={() => {
                                                console.log('Video loaded successfully');
                                                // Force play after a short delay only if popup is closed
                                                if (!isPopupOpen) {
                                                    setTimeout(() => { if (!forcePlay) setForcePlay(prev => !prev); }, 50);
                                                }
                                            }}
                                        />
                                         {/* <WebView
                                            source={{
                                                html: `
                                                    <html>
                                                        <body style="margin:0;padding:0;background:black;display:flex;justify-content:center;align-items:center;height:100vh;">
                                                            <video 
                                                                width="100%" 
                                                                height="100%" 
                                                                autoplay 
                                                                muted 
                                                                loop 
                                                                playsinline
                                                                style="object-fit:contain;"
                                                            >
                                                                <source src="${mediaUrl}" type="video/mp4">
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        </body>
                                                    </html>
                                                `
                                            }}
                                            style={[styles.imgStyle, { width: '100%', height: '100%' }]}
                                            javaScriptEnabled={true}
                                            domStorageEnabled={true}
                                            allowsInlineMediaPlayback={true}
                                            mediaPlaybackRequiresUserAction={false}
                                            onError={() => {
                                                // console.log('WebView video error');
                                                setVideoErrors(prev => ({ ...prev, [index]: true }));
                                            }}
                                        /> */}
                             
                                </>
                            )}
                            {(mediaType === 'video' && videoErrors[index]) && (
                                <ImageBackground
                                    borderRadius={12}
                                    resizeMode="contain"
                                    source={{ uri: mediaUrl }}
                                    style={[styles.imgStyle, { width: '100%', height: '100%' }]}
                                />
                            )}
                            {mediaType === 'gif' && mediaUrl && !gifErrors[index] && (
                                <View style={{ height: heightPercentageToDP(20), width: '100%', borderRadius: 12, overflow: 'hidden' }}>
                                    <WebView
                                        source={{
                                            html: `
                                                           <html>
                                                             <head>
                                                               <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                               <style>
                                                                 body {
                                                                   margin: 0;
                                                                   padding: 0;
                                                                   display: flex;
                                                                   justify-content: center;
                                                                   align-items: center;
                                                                   height: 100vh;
                                                                   background: transparent;
                                                                   overflow: hidden;
                                                                 }
                                                                 img {
                                                                   max-width: 100%;
                                                                   max-height: 100%;
                                                                   object-fit: contain;
                                                                   border-radius: 8px;
                                                                 }
                                                               </style>
                                                             </head>
                                                             <body>
                                                               <img src="${mediaUrl}" alt="GIF" />
                                                             </body>
                                                           </html>
                                                         `
                                        }}
                                        style={{ width: '100%', height: '100%' }}
                                        scrollEnabled={false}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        scalesPageToFit={false}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        startInLoadingState={false}
                                        mixedContentMode="compatibility"
                                        androidLayerType="hardware"
                                    />
                                </View>
                            )}
                            {(mediaType === 'gif' && gifErrors[index]) && (
                                <ImageBackground
                                    borderRadius={12}
                                    resizeMode="contain"
                                    source={{ uri: mediaUrl }}
                                    style={[styles.imgStyle, { width: '100%', height: '100%' }]}
                                />
                            )}
                            {mediaType === 'image' && mediaUrl && (
                                <ImageBackground
                                    borderRadius={12}
                                    resizeMode="contain"
                                    source={{ uri: mediaUrl }}
                                    style={[styles.imgStyle, { width: '100%', height: '100%' }]}
                                />
                            )}
                        </Animated.View>
                    );
                }}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.8,
                    parallaxScrollingOffset: 90,
                }}
                panGestureHandlerProps={{
                    activeOffsetX: [-10, 10],
                }}
            />
        </View>
    );
}

export default CustomCaraosel;

const styles = StyleSheet.create({
    parentView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        height: heightPercentageToDP(20),
    },
    bannerView: {
        marginHorizontal: 25,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: GRAY
    },
    imgStyle: {
        // flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        height: heightPercentageToDP(20),
        borderRadius: 12,
    }
})