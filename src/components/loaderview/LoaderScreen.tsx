import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, View, Image, Animated } from 'react-native';
import { LoaderScreenStyle } from './LoaderScreenStyle';

export const LoaderScreen = ({ title }: any) => {
    const { loaderView, loaderText, logoContainer, logo } = LoaderScreenStyle;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const startAnimation = () => {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start(() => startAnimation()); // Loop the animation
        };

        startAnimation();
    }, [scaleAnim]);

    return (
        <View style={loaderView}>
            <View style={logoContainer}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Image
                        source={require('../../assets/tejagro.png')}
                        style={logo}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>
            <Text style={loaderText}>{title ? title : 'Please Wait...'}</Text>
        </View>
    )
} 
