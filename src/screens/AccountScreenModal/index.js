import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal'


import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { Context as AuthContext } from '../../context/AuthContext'
import { PhoneSecurityScreen } from './PhoneSecurityScreen';
import { PasswordChangeScreen } from './PasswordChangeScreen';
import { CompleteProfileScreen } from './CompleteProfileScreen';
import { TwofaActivationScreen } from './TwofaActivationScreen';
import { VerifyIdentity } from './VerifyIdentity';
import { VerifyAddress } from './VerifyAddress';



const AccountScreenModal = ({ ...props }) => {
    const { state: { mode } } = useContext(ThemeContext);
    const { state: { userData } } = useContext(AuthContext);
    return (
        <Modal
            isVisible={props.isModalVisible}
            backdropOpacity={0.20}
            hasBackdrop={true}
             avoidKeyboard={true}
            useNativeDriver={true}
            swipeDirection={['up', 'left', 'right', 'down']}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <SafeAreaView style={{ flex: 1, justifyContent: "flex-end" }}>

                {props.securtyType == "changeLoginPassword" && <PasswordChangeScreen
                    mode={mode}
                    modalCloseBtn={() => props.modalCloseBtn()}
                    callback={() => props.closeButton()}
                />}

                {props.securtyType == "phoneNumber" && <PhoneSecurityScreen
                    mode={mode}
                    modalCloseBtn={() => props.modalCloseBtn()}
                    callback={() => props.closeButton()}
                />}

                {props.securtyType == "completeProfile" && <CompleteProfileScreen
                    mode={mode}
                    modalCloseBtn={() => props.modalCloseBtn()}
                    callback={() => props.closeButton()}
                />}

                {props.securtyType == "enable2FA" && <TwofaActivationScreen
                    mode={mode}
                    userSecurityStatusData={props.userSecurityStatusData}
                    modalCloseBtn={() => props.modalCloseBtn()}
                    callback={() => props.closeButton()}
                />}

                {props.securtyType == "verifyIdentity" && <VerifyIdentity
                    mode={mode}
                    userSecurityStatusData={props.userSecurityStatusData}
                    modalCloseBtn={() => props.modalCloseBtn()}
                    callback={() => props.closeButton()}
                />}

                {props.securtyType == "verifyAddress" && <VerifyAddress
                    mode={mode}
                    userSecurityStatusData={props.userSecurityStatusData}
                    modalCloseBtn={() => props.modalCloseBtn()}
                    callback={() => props.closeButton()}
                />}


            </SafeAreaView>
        </Modal>
    );
};

export default AccountScreenModal;


