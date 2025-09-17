import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { GREEN } from '../../shared/common-styles/colors';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import CrossIconRound from '../../svg/CrossIconRound';
import PromoCodeIcon from '../../svg/PromoCodeIcon';
import { ModalStyle } from './ModalStyle';
import { useTranslation } from "react-i18next"
const ConfirmOrderModal = ({ modalVisible, onClose }:any) => { 
 const { t } = useTranslation();   
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={ModalStyle.centeredView}>
                <View style={{ ...ModalStyle.modalView, borderRadius: 25, borderColor: GREEN, borderWidth: 1 }}>
                    <View style={{ alignSelf: "center" }}>
                        <PromoCodeIcon height={120} width={120} />
                    </View>
                    <View style={{ alignSelf: "center", marginVertical: 15 }}>
                        <TextPoppinsMediumBold style={{ fontSize: 18, lineHeight: 22, color: GREEN }}>{t("Order_Placed")}</TextPoppinsMediumBold>
                    </View>
                </View>
                <Pressable style={{ marginVertical: 10 }} onPress={()=>onClose()}>
                    <CrossIconRound height={30} width={30} />
                </Pressable>
            </View>
        </Modal>
    )
}
export default ConfirmOrderModal;