import { StyleSheet, Text } from "react-native"
import { TextInput, TouchableOpacity, View } from "react-native"
import { BLACK, MDBLUE } from "../../shared/common-styles/colors"


export const Promocode = (value: any, onChangeText: any, placeholder: any, buttonText: any, onPress?: any) => {
    return (
        <View style={styles.promoCodeContainer}>
            <TextInput
                style={styles.promoCodeInput}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
            />
            <TouchableOpacity style={styles.applyButton} onPress={onPress}>
                <Text style={styles.applyButtonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    promoCodeContainer: {
        flexDirection: 'row',
        marginVertical: 16,
        marginHorizontal: 20
    },
    promoCodeInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        marginRight: 8,
        borderRadius: 4,
    },
    applyButton: {
        paddingHorizontal: 16,
        backgroundColor: MDBLUE,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    applyButtonText: {
        color: BLACK,
        fontWeight: '500',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 18
    },
})