import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import I18n from '../../lang/_i18n'

import InputText from '../../components/InputText'
import { X, Copy, Vector } from '../../components/svg'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/Button';
import PhoneInput from "react-native-phone-number-input";
import Toast, { callToast } from '../../components/Toast';

import { _phoneVerify } from '../../context/AccountDataApi';



export const PhoneSecurityScreen = ({ ...props }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);
    const [pinCode, setPinCode] = useState("");
    const [valid, setValid] = useState(false);
    const [formattedValue, setFormattedValue] = useState("");
    const [value, setValue] = useState("");
    const phoneInput = useRef(null);
    const [phoneMessage, setPhoneMessage] = useState('')
    const [loader, setLoader] = useState(false);

    const setPhoneCodeHandler = pin => {
        setPinCode(pin);
    };


    const sendPhonePin = async (phone, pin) => {
        let messageNew = '';
        try {
            const response = await _phoneVerify(phone, pin);
            if (response === "Code was sent successfully via sms") {
                messageNew = I18n.t('account.codeSend', { locale: language })
            } else if (response === "resource.phone.exists") {
                messageNew = I18n.t('account.codeWasSend', { locale: language })
            } else if (response === "resource.phone.verification_invalid") {
                messageNew = I18n.t('account.codeInvalid', { locale: language })
            } else if (response === "resource.phone.number_exist") {
                messageNew = I18n.t('account.wasPhone', { locale: language })
            } else if (response === "resource.phone.doesnt_exist") {
                messageNew = I18n.t('account.codeInvalid', { locale: language })
            } else {
                console.log(response)
            }

            setPhoneMessage(messageNew);
            if (phoneMessage != null)
                callToast();
            setLoader(false);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <View style={styles.modalContainer}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <Toast message={phoneMessage} type={phoneMessage === (I18n.t('account.codeSend', { locale: language })) ? "success" : "danger"} />
                <View style={styles.modalHeader}>
                    <View style={{ flexDirection: "row", paddingVertical: 15, justifyContent: "center" }}>
                        <Vector
                            width={20}
                            height={18}
                            style={{ left: 11, alignSelf: "center" }}
                            color={theme[mode].lightblue}
                        />
                        <Text style={styles.title}>{I18n.t('account.phoneNumberVerifyTitle', { locale: language })}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.modalCloseBtn}
                        onPress={props.modalCloseBtn}>
                        <X color={theme[props.mode].textblack} />
                    </TouchableOpacity>
                </View>


                <View style={styles.cekContainer}>

                    <Text style={styles.inpTitle}>
                        {I18n.t('account.phoneNumber', { locale: language })}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <PhoneInput
                            ref={phoneInput}
                            defaultValue={value}
                            defaultCode="TR"
                            codeTextStyle={{ color: theme[mode].textblack, }}
                            layout="second"
                            onChangeText={(text) => {
                                setValue(text);
                            }}
                            onChangeFormattedText={(text) => {
                                setFormattedValue(text);
                                const checkValid = phoneInput.current?.isValidNumber(text);
                                setValid(checkValid ? checkValid : false);
                            }}
                            containerStyle={{
                                width: "100%",
                                flex: 4,
                                height: 42,
                                paddingHorizontal: 0,
                                borderRadius: 18,
                                // shadowOffset: {
                                //     width: 0,
                                //     height: 0,
                                // }, shadowOpacity: 0,
                                // shadowRadius: 0,
                            }}
                            countryPickerButtonStyle={{ borderBottomLeftRadius: 8, borderTopLeftRadius: 8, backgroundColor: theme[mode].cardinputdirty }}
                            textInputStyle={{
                                marginBottom: 1,
                                flex: 1,
                                padding: 10,
                                height: 42,
                                backgroundColor: theme[mode].cardinputdirty,
                                color: theme[mode].textblack,
                            }}
                            textContainerStyle={{ borderBottomRightRadius: 8, borderTopRightRadius: 8, backgroundColor: theme[mode].cardinputdirty, }}
                            withDarkTheme
                            //withShadow
                            autoFocus
                        />
                        <Button containerStyle={{
                            height: 42,
                            marginLeft: 20,
                            flex: 1,
                        }}
                            disabled={!valid} textStyle={{ alignSelf: "center" }} title={I18n.t('account.postCode', { locale: language })} btnLg btnDarkBlue
                            callback={() => {
                                sendPhonePin(formattedValue, null)
                            }} />

                    </View>
                    <View style={{ marginTop: 10 }} >
                        <Text style={{ color: theme[mode].red }} >  {value.length >= 4 ? (valid ? null : I18n.t('account.numberIncorrect', { locale: language })) : I18n.t('account.writeYourNumber', { locale: language })}</Text>
                    </View>
                    <View style={{ paddingVertical: 10, }}>
                        <InputText
                            isEmpty={false}
                            placeholder={I18n.t('account.phoneGetCode', { locale: language })}
                            onChangeText={onChangeText => setPhoneCodeHandler(onChangeText.trim())}
                            keyboardType="numeric"
                            isEmpty={false}
                            amountValue={pinCode}
                            dirty
                        />

                    </View>

                    {/*  */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginBottom: 20,
                    }}>
                        {loader ? <ActivityIndicator style={{ flex: 1 }} size="large" color={theme[mode].lightblue} /> :
                            <Button title={I18n.t('account.goOn', { locale: language })} btnLg btnLightBlue
                                disabled={!(pinCode.length > 3) || !valid}
                                callback={() => {
                                    sendPhonePin(formattedValue, pinCode)
                                }} />}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}



const setStyle = mode => ({
    cekContainer: {
        flex: 1,
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
        marginHorizontal: 10,
        padding: 15,
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


