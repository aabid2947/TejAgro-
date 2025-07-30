import React from "react";
import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import ReCarousel from 'react-native-reanimated-carousel';
import { heightPercentageToDP } from "react-native-responsive-screen";
import { GRAY } from "../../shared/common-styles/colors";

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.5)
const CustomCaraosel = (banner: any) => {
    const width = Dimensions.get('window').width;
    const [itemIndex, setItemIndex] = React.useState(0);
    const progressValue = useSharedValue(0);

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
                width={width}
                height={width / 2.2}
                autoPlay={true}
                data={banner?.data}
                scrollAnimationDuration={5000}
                onSnapToItem={onSnapToItem}
                renderItem={({ item, index }: any) => {
                    return (
                        <>
                            {item?.image &&
                                <Animated.View key={index}
                                    style={styles.bannerView}
                                >
                                    <ImageBackground
                                        borderRadius={12}
                                        source={{ uri: item?.image }}
                                        style={styles.imgStyle}
                                    />
                                </Animated.View>
                            }
                        </>
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
        height: heightPercentageToDP(20),
        borderRadius: 12,
    }
})