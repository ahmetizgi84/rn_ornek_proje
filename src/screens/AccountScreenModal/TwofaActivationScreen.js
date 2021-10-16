import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import I18n from '../../lang/_i18n'
import Clipboard from '@react-native-clipboard/clipboard';

import InputText from '../../components/InputText'
import { X, Copy, Vector } from '../../components/svg'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/Button';
import QRCode from 'react-native-qrcode-svg';
import Toast, { callToast } from '../../components/Toast';
import { _twoFactorOTPEnabledDisabled } from '../../context/AccountDataApi';

export const TwofaActivationScreen = ({ ...props }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);
    const [mfaCode, setMfaCode] = useState("");
    const [twoFactorCodein, setTwoFactorCodein] = useState("");

    const [toastMessage, setToastMessage] = useState(null)
    const [userOTP, setUserOTP] = useState(props.userSecurityStatusData.userOTP)
    const [loader, setLoader] = useState(true);
    const [twoFactorDataCreate, setTwoFactorDataCreate] = useState(null)



    useEffect(async () => {
        if (!userOTP) {
            await getTwoFactorData()
            if (twoFactorDataCreate != null)
                setMfaCodeHandler((twoFactorDataCreate.url).split('=')[5])
        }
        else {
            setLoader(false)
        }
    }, [loader])

    const getTwoFactorData = async () => {
        let qrCode = await _twoFactorOTPEnabledDisabled();
        setTwoFactorDataCreate(qrCode.data)
        setLoader(false)

    }

    const setMfaCodeHandler = value => {
        setMfaCode(value);
    };
    const setTwoFactorCodeinHandler = value => {
        setTwoFactorCodein(value);
    };

    const copyToClipboard = (value) => {
        Clipboard.setString(value)
        setToastMessage(I18n.t('copied', { locale: language }) + " > " + mfaCode)
        callToast();
    }

    const enableDisableTwoFactory = async () => {

        let messageNew = '';
        let response = await _twoFactorOTPEnabledDisabled(userOTP, twoFactorCodein);

        if (response.errors && response.errors[0]) {
            let messageCode = response.errors[0].split('.').join('_');
            messageNew = I18n.t('account.' + messageCode, { locale: language })
            setToastMessage(messageNew);
        }
        else if (response == "200") {
            messageNew = I18n.t('account.twoFactorEnabled', { locale: language })
            setToastMessage(messageNew);
            setTimeout(
                function () {
                    props.callback()
                }
                    .bind(this),
                1500
            );
        }
        if (toastMessage != null)
            callToast();
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <View style={{ flexDirection: "row", paddingVertical: 15, justifyContent: "center" }}>
                    <Vector
                        width={20}
                        height={18}
                        style={{ left: 11, alignSelf: "center" }}
                        color={theme[mode].lightblue}
                    />
                    <Text style={styles.title}>{I18n.t('account.twoFactorVerify', { locale: language })}</Text>
                </View>

                <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={props.modalCloseBtn}>
                    <X color={theme[props.mode].textblack} />
                </TouchableOpacity>
            </View>
            {loader ? <ActivityIndicator style={{ flex: 1 }} size="large" color={theme[mode].lightblue} />
                :
                <ScrollView keyboardShouldPersistTaps="handled">
                    <Toast message={toastMessage} type={"success"} />

                    <View style={styles.cekContainer}>

                        <View style={{ paddingVertical: 5, }}>

                            <Text style={styles.inpTitle}>
                                {I18n.t('account.twoFactortext1', { locale: language })}
                            </Text>
                            <Text style={styles.inpTitle}>
                                {I18n.t('account.twoFactortext2', { locale: language })}
                            </Text>
                            <Text style={styles.inpTitle}>
                                {I18n.t('account.twoFactortext3', { locale: language })}
                            </Text>
                        </View>
                        {!userOTP && <>
                            {twoFactorDataCreate.url != null && <View style={{ paddingVertical: 5, }}>
                                <View style={styles.qrCode}>
                                    <QRCode
                                        value={twoFactorDataCreate.url}
                                        size={150}
                                    />
                                </View>
                            </View>
                            }

                            <View style={{ paddingVertical: 5, }}>
                                <Text style={styles.inpTitle}>
                                    {I18n.t('account.mfaCode', { locale: language })}
                                </Text>
                                <InputText
                                    isEmpty={false}
                                    placeholder={I18n.t('account.mfaCode', { locale: language })}
                                    inputStyle={{
                                        fontSize: 14
                                    }}
                                    disabled
                                    dirty
                                    amountValue={mfaCode}
                                    rightIcon={
                                        <Copy
                                            width={20}
                                            color={theme[mode].inputIconColor}
                                            onPress={() => copyToClipboard(mfaCode)}
                                        />}
                                />
                            </View>
                        </>
                        }
                        <View style={{ paddingVertical: 5, }}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('account.twoFactorCodein', { locale: language })}
                            </Text>
                            <InputText
                                dirty
                                isEmpty={false}
                                placeholder={I18n.t('account.twoFactorCodein', { locale: language })}
                                onChangeText={onChangeText => setTwoFactorCodeinHandler(onChangeText.trim())}
                                inputStyle={{
                                    fontSize: 14
                                }}
                                amountValue={twoFactorCodein}

                            />
                        </View>


                        {/*  */}
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginBottom: 20,
                        }}>
                            <Button title={I18n.t('account.goOn', { locale: language })} btnLg btnLightBlue
                                disabled={(twoFactorCodein.length < 4)}
                                callback={() => {
                                    enableDisableTwoFactory();

                                }} />
                        </View>
                    </View>
                </ScrollView>
            }
        </View>
    )
}



const setStyle = mode => ({
    cekContainer: {
        flex: 1,
        padding: 10,
    },
    qrCode: {
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 30
    },
    title: {
        color: theme[mode].lightblue,
        left: 15,
        fontSize: 18,
        fontWeight: "500",
    },

    inpTitle: {
        color: theme[mode].textblack,
        fontSize: 10,
        marginBottom: 5,
    },

    modalContainer: {
        //backgroundColor: theme[mode].bg,
        backgroundColor: theme[mode].white,
        ...theme.shadow,
        padding: 15,
        marginHorizontal: 10,
        borderRadius: 8,
    },

    modalHeader: {
        alignItems: "center",
        marginBottom: 5,
        flexDirection: "row",
        justifyContent: "space-between",

    },

    modalCloseBtn: {
        padding: 2,
        backgroundColor: theme[mode].bg,
        borderRadius: 5
    },
})


