import { StyleSheet } from 'react-native';
import { MDBLUE, ORANGE } from '../../shared/common-styles/colors';

export const LoaderScreenStyle = StyleSheet.create({
    loaderText: {
        color: ORANGE,
        fontSize: 12,
        lineHeight: 16,
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '500'
    },
    loaderView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    logo: {
        width: 80,
        height: 80,
    }
})