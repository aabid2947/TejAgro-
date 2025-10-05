import { StyleSheet } from 'react-native';
import { BLACK, WHITE } from '../../shared/common-styles/colors';

export const YouTubeVideosStyle = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: WHITE,
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    headerText: {
        fontSize: 18,
        paddingVertical: 10,
        color: BLACK,
        marginVertical: 15,
        marginHorizontal: 10,
        fontWeight: '600',
    },
    noDataTxt: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
});