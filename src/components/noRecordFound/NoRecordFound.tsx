import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BLACK, GRAY_SHADE, GREY } from '../../shared/common-styles/colors'
import NoRecordImage from '../../svg/NoRecordImage'
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold'

const NoRecordFound = (props: any) => {
    return (
        <View style={{ ...styles.loaderView, ...props?.style }}>
            <NoRecordImage width={266} height={96} />
            <TextPoppinsSemiBold style={styles.textStyle}>No data found</TextPoppinsSemiBold>
        </View>
    )
}

export default NoRecordFound
export const styles = StyleSheet.create({
    loaderView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50
    },
    textStyle: {
        color: GREY,
        fontSize: 19,
        lineHeight: 38,
        paddingTop: 10
    },
    textStyle1: {
        color: GRAY_SHADE,
        fontSize: 12,
        fontWeight: '300',
        lineHeight: 20
    },
})