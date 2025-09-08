import { StyleSheet, Text, View } from "react-native"
import { BLACK, GRAY_BORDER, PoppinsMedium } from "../../shared/common-styles/colors"
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold"
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState } from "../../reduxToolkit/store"
export const SubtotalCart = (subtotalValue: any, totalValue: any, discounted?: any, walletValue?: any) => {
    console.log(walletValue)
    const { t } = useTranslation();
    return (
        <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
                <TextPoppinsSemiBold style={styles.priceLabel}>{t("SUB_TOTAL")}</TextPoppinsSemiBold>
                <TextPoppinsMediumBold style={styles.priceValue}>₹ {Number(subtotalValue).toFixed(2)}</TextPoppinsMediumBold>
            </View>

            {discounted ?
                <View style={styles.priceRow}>
                    <TextPoppinsSemiBold style={styles.priceLabel}>{t('Discount')}</TextPoppinsSemiBold>
                    <TextPoppinsMediumBold style={styles.priceValue}> ₹ {discounted || "0"}</TextPoppinsMediumBold>
                </View>
                : null}

            {walletValue ?
                <View style={styles.priceRow}>
                    <TextPoppinsSemiBold style={styles.priceLabel}>{t('WALLET')}</TextPoppinsSemiBold>
                    <TextPoppinsMediumBold style={styles.priceValue}> ₹ {walletValue || "0"}</TextPoppinsMediumBold>
                </View>
                : null}

            <View style={styles.priceRow}>
                <TextPoppinsSemiBold style={styles.priceLabel}>{t("TOTAL")}</TextPoppinsSemiBold>
                <TextPoppinsMediumBold style={styles.priceValue}>₹ {totalValue}</TextPoppinsMediumBold>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    priceSummary: {
        marginBottom: 16,
        marginHorizontal: 20
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: GRAY_BORDER
    },
    priceLabel: {
        fontSize: 16,
        color: BLACK,
        fontFamily: PoppinsMedium,
        lineHeight: 21,
        width: '50%',
        
        textAlign: 'left',
    },
    priceValue: {
        fontSize: 16,
        color: BLACK,
        lineHeight: 22,
        // width: '50%',
        // textAlign: 'left'
    },
})