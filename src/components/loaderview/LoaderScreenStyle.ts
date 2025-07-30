import { StyleSheet } from 'react-native';
import { MDBLUE, ORANGE } from '../../shared/common-styles/colors';

export const LoaderScreenStyle = StyleSheet.create({
    loaderText: {
        color: ORANGE,
        fontSize: 12,
        lineHeight: 13,
        marginTop: 10
    },
    loaderView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})