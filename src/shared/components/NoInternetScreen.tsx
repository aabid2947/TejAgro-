import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { ORANGE, WHITE } from '../common-styles/colors';


const styles = StyleSheet.create({
    container: {
        backgroundColor: ORANGE,
        position: 'absolute',
        top: 0, left: 0,
        right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        fontSize: 30,
        color: WHITE,
        lineHeight: 34,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    text: {
        fontSize: 20,
        lineHeight: 25,
        marginHorizontal: 20,
        color: WHITE,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 5,
        textAlign: 'center',      // Center text horizontally
        textAlignVertical: 'center',
    }
});
const NoInternetScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Oops!</Text>
            <Text style={styles.header}>There is no Internet Connection</Text>
            <Text style={styles.text}>We're having a little difficulty in connecting
                to the Internet. Please check your connection and try again.</Text>
        </View>
    )
}

export default NoInternetScreen