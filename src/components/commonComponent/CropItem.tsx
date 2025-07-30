import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Image, Pressable, StyleSheet, View } from "react-native"
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen"
import { RootStackParamList } from "../../routes/AppRouter"
import { CROP_MAP_SCREEN } from "../../routes/Routes"
import { BLACK, PoppinsMedium, WHITE } from "../../shared/common-styles/colors"
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold"
import { useTranslation } from "react-i18next"

export const CropItem = ({ data, selectedCrop }: any) => {
    const { t, i18n } = useTranslation()
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const cropStageName =
        i18n.language === "en" ? data?.crop_stage_name : data?.crop_marathi_stage_name;
    return (
        <Pressable
            style={style.productContainer} onPress={() => navigation.navigate(CROP_MAP_SCREEN, { data: data, selectedCrop: selectedCrop })}>
            <View>
                <Image
                    source={{ uri: data?.crop_stage_image }}
                    style={style.imgStyle}
                />
            </View>
            <View>
                {/* <TextPoppinsMediumBold style={style.productName} numberOfLines={3}>{data.crop_stage_name || "लागवडीची अवस्था "}{'\n'}{data.crop_marathi_stage_name || "लागवडीची अवस्था "}</TextPoppinsMediumBold> */}
                {/* <TextPoppinsMediumBold style={style.productName}>{data.crop_marathi_stage_name || "लागवडीची अवस्था "}</TextPoppinsMediumBold> */}
                <TextPoppinsMediumBold style={style.productName} numberOfLines={3}>
                    {cropStageName || (i18n.language === "en" ? "Crop Stage" : "लागवडीची अवस्था")}
                </TextPoppinsMediumBold>
            </View>
            {/* <View style={style.productContainer1}>
               
            </View> */}
        </Pressable>
    )
}

const style = StyleSheet.create({
    productContainer: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: WHITE,
        width: widthPercentageToDP(87),
        height: heightPercentageToDP(14)
    },
    productContainer1: {
        padding: 15,
        flex: 1,
    },
    productName: {
        fontSize: 14,
        lineHeight: 20,
        color: BLACK,
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        alignContent: 'center',
        flex: 1,
        maxWidth: widthPercentageToDP(50),
        fontFamily: PoppinsMedium,
        paddingHorizontal: widthPercentageToDP(2),
        flexShrink: 1,
        marginVertical: heightPercentageToDP(1),
        right: 8
    },
    imgStyle: {
        width: widthPercentageToDP(40),
        height: heightPercentageToDP(14),
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        resizeMode: 'cover',
    },
})