import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { MDBLUE, ORANGE } from '../../shared/common-styles/colors';
import { LoaderScreenStyle } from './LoaderScreenStyle';

export const LoaderScreen = ({ title }: any) => {
    const { loaderView, loaderText } = LoaderScreenStyle;
    return (
        <View style={loaderView}>
            <ActivityIndicator size="small" color={ORANGE} />
            <Text style={loaderText}>{title ? title : 'Please Wait.....'} </Text>
        </View>
    )
} 
