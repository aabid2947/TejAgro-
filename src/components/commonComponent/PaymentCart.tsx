import { StyleSheet, Text, View } from "react-native"
import { BLACK, MD_GRAY, WHITE } from "../../shared/common-styles/colors"

export const PaymentCart = (Icon: any, deliveryValue: any) => {
    return (
        <View style={styles.renderView}>
            <View style={{ flexDirection: "row" }}>
                <Icon height={80} width={80} />
                <Text style={styles.cardTxt}>{deliveryValue}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    renderView: {
        marginVertical: 10,
        gap: 10,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: MD_GRAY,
        padding: 10,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: WHITE
    },
    cardTxt: {
        fontSize: 18,
        lineHeight: 20,
        color: BLACK,
        alignSelf: "center",
        fontWeight: '700'
    }
})