import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Modal as RNModal, Text, View } from 'react-native';
import { ModalContext_Style } from './ModalContext_Style';
import PressableClick from '../pressablebutton/PressableClick';

interface ModalContextType {
    modalOpen: boolean;
    modalContent: string;
    dealerId: Number;
    openModal: (content: string) => void;
    closeModal: () => void;
    dealerIdSet: (content: Number) => void
}
// export const DealerIdContext = createContext<ModalContextType | undefined>(undefined);

// export function useDealerContext() {
//     return useContext(DealerIdContext);
// }
export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModalContext() {
    return useContext(ModalContext);
}

function Modal() {
    const modalContext = useContext(ModalContext);

    if (!modalContext) {
        return null;
    }

    const { modalOpen, closeModal, modalContent } = modalContext;

    if (!modalOpen) {
        return null;
    }

    return (
        <RNModal animationType="slide" transparent={true} visible={modalOpen}>
            <View style={ModalContext_Style.modalViewParent}>
                <View style={ModalContext_Style.modalCard}>
                    <Text style={ModalContext_Style.textStyle}>{modalContent}</Text>
                    <PressableClick style={ModalContext_Style.okButton} textstyle={ModalContext_Style.okTextStyle} label={"Ok"} onPress={closeModal} />
                </View>
            </View>
        </RNModal>
    );
}

interface ModalProviderProps {
    children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [dealerId, setDealerId]: any = useState();

    const dealerIdSet = (data: Number) => {
        setDealerId(data)
    }

    const openModal = (content: string) => {
        setModalContent(content);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent('');
    };

    const contextValue: ModalContextType = {
        modalOpen,
        modalContent,
        dealerId,
        openModal,
        closeModal,
        dealerIdSet
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            <Modal />
        </ModalContext.Provider>
    );
}
