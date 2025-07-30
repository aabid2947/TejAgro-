import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { ModalStyle } from './ModalStyle';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';

const AlertModal = (props: any) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.onCancel();
            }}
            statusBarTranslucent
        >
            <View style={ModalStyle.centeredView}>
                <View style={ModalStyle.modalView}>
                    <View>
                        {props.header && <Text style={ModalStyle.modalText}>{props.header}</Text>}
                        {props.firstLineContent && <View style={{ marginBottom: props.description ? 8 : 15, marginHorizontal: 20 }}>
                            <TextPoppinsSemiBold style={ModalStyle.modalTextView}>{props.firstLineContent}</TextPoppinsSemiBold>
                        </View>}
                        {props.description && <View style={{ marginBottom: 15, marginHorizontal: 20 }}>
                            <TextPoppinsMediumBold style={ModalStyle.modalTextViewDes}>{props.description}</TextPoppinsMediumBold>
                        </View>}
                    </View>
                    <View style={ModalStyle.formbutton}>
                        <Pressable
                            style={ModalStyle.buttonNoStyle}
                            onPress={() => props.onCancel()}>
                            <TextPoppinsMediumBold style={ModalStyle.formNoTxt}>{props.no}</TextPoppinsMediumBold>
                        </Pressable>
                        <Pressable
                            style={ModalStyle.buttonYesStyle}
                            onPress={() => { props.setModalVisible(false), props.onProceed() }}
                        >
                            <TextPoppinsMediumBold style={ModalStyle.formYesTxt}>{props.btn}</TextPoppinsMediumBold>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
export default AlertModal;