import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { GREEN } from '../../shared/common-styles/colors';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import CrossIconRound from '../../svg/CrossIconRound';
import PromoCodeIcon from '../../svg/PromoCodeIcon';
import { ModalStyle } from './ModalStyle';

const ConfirmModal = ({ modalVisible, onClose }:any) => {    
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
                        <TextPoppinsMediumBold style={{ fontSize: 22, lineHeight: 32, color: GREEN }}>Promocode applied!</TextPoppinsMediumBold>
                    </View>
                </View>
                <Pressable style={{ marginVertical: 10 }} onPress={()=>onClose()}>
                    <CrossIconRound height={30} width={30} />
                </Pressable>
            </View>
        </Modal>
    )
}
export default ConfirmModal;