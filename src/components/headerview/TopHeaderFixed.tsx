
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BLACK, GRAY_SHADE, MD_GRAY, MDBLUE, PINK_GREY, WHITE } from '../../shared/common-styles/colors';
import BackButtonIcon from '../../svg/BackButtonIcon';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';

const TopHeaderFixed = (props?: any) => {
    const styles = useStyles(props);
    return (
        <View style={styles.topHeader}>
            <View style={styles.viewSection}>
                <View style={styles.iconView}>
                    {props?.gobackText && <Pressable style={({ pressed }) => [{ paddingEnd: 10, flexDirection: 'row', alignItems: 'center', opacity: pressed ? 0.2 : 1 }]} onPress={() => props?.onGoBack ? props?.onGoBack() : ''} >
                        <BackButtonIcon width={24} height={24} />
                        {props?.imageView && <View style={styles.imageView} />}
                        <TextPoppinsMediumBold style={styles.goBackText}>{props?.gobackText}</TextPoppinsMediumBold>
                    </Pressable>}
                    {props?.headerTxt &&
                        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }]} onPress={() => props?.onGoBack ? props?.onGoBack() : ""}>
                            <TextPoppinsMediumBold style={styles.headerText}>{props?.headerTxt}</TextPoppinsMediumBold>
                        </Pressable>}
                </View>
            </View>
        </View>
    );
};
export default TopHeaderFixed;


const useStyles = (props: any) => StyleSheet.create({
    imageView: {
        marginStart: 10,
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: PINK_GREY,
        backgroundColor: GRAY_SHADE
    },
    headerTextBold: {
        fontSize: 20,
        lineHeight: 33,
        color: BLACK,
        marginStart: 10,
        fontWeight: '700'
    },
    headerText: {
        fontSize: 20,
        lineHeight: 33,
        color: BLACK
    },
    goBackText: {
        fontSize: 20,
        lineHeight: 35,
        color: BLACK,
        paddingStart: 10
    },
    topHeader: {
        paddingVertical: 20,
        flexDirection: 'row',
        backgroundColor: WHITE,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: MD_GRAY,
    },
    viewSection: {
        flexDirection: 'row',
        flex: 1,
    },
    iconView: {
        flexDirection: 'row',
        paddingLeft: 20,
        alignItems: 'center',
    },
    cartBtn: {
        marginHorizontal: 10
    },
    cartLengthIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
        elevation: 1,
        backgroundColor: 'red'
    }

});