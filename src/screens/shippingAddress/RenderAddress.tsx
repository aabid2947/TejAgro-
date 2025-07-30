import { Pressable, Text, View } from "react-native"
import { ShippingAddressStyle } from "./ShippingAddressStyle"
import RightTickIcon from "../../svg/RightTickIcon"
import EditIcon from "../../svg/EditIcon"
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState } from "../../reduxToolkit/store"

export const RenderAddress = ({ data, selectedId, onPressAdd, onPressEdit }: any) => {
    const selectedShippingAddress1: any = useSelector((state: RootState) => state.counter.selectAddress)
    const selected = (Object.keys(selectedShippingAddress1).length > 0) ? data.shipping_addres_id == selectedShippingAddress1.shipping_addres_id : data.shipping_addres_id == selectedId
    const { t } = useTranslation();
    return (
        <View key={data.shipping_addres_id} style={ShippingAddressStyle.mainViewRender}>
            <View style={ShippingAddressStyle.iconView1}>
                <Pressable style={ShippingAddressStyle.iconView} onPress={() => onPressAdd(data)}>
                    {selected && <RightTickIcon height={20} width={20} />}
                </Pressable>
                <TextPoppinsSemiBold style={selected ? ShippingAddressStyle.tickText : ShippingAddressStyle.tickTextDisable}>{t("SHIPPING_ADDRESS_CONFIRM")}</TextPoppinsSemiBold>
            </View>
            <View style={ShippingAddressStyle.secondView}>
                <View style={ShippingAddressStyle.nameViewParent}>
                    <TextPoppinsSemiBold style={ShippingAddressStyle.nameStyle}>{data?.full_name}</TextPoppinsSemiBold>
                    <Pressable onPress={() => onPressEdit(data)}>
                        <EditIcon height={20} width={20} />
                    </Pressable>
                </View>
                <TextPoppinsSemiBold numberOfLines={10} style={ShippingAddressStyle.addressText}>
                    {data?.address},
                </TextPoppinsSemiBold>
                <TextPoppinsSemiBold numberOfLines={10} style={ShippingAddressStyle.addressText}>
                    {data?.city}, {data?.district}- {data?.zipcode}, {data?.country}
                </TextPoppinsSemiBold>
            </View>
        </View>
    )
}