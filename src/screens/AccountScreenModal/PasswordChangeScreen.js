import React, { useContext, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import I18n from '../../lang/_i18n'

import InputText from '../../components/InputText'
import { X, Copy, Vector } from '../../components/svg'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/Button';
import zxcvbn from 'zxcvbn';

import { _passwordSetNew } from '../../context/AccountDataApi';
import Toast, { callToast } from '../../components/Toast';




export const PasswordChangeScreen = ({ ...props }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);
    const [oldPasword, setoldPasword] = useState("");
    const [newPasword, setNewPasword] = useState("");
    const [newPaswordRepeat, setNewPaswordRepeat] = useState("");
    const [valid, setValid] = useState(false);
    const [validPasswordSecurity, setValidPasswordSecurity] = useState(true);
    const [validNewPassword, setValidNewPassword] = useState(true);
    const [passwordMessage, setPasswordMessage] = useState('')



    const setoldPaswordHandler = value => {
        setoldPasword(value);
    };
    const setnewaswordHandler = value => {
        setNewPasword(value);
        passwordSecurityCheck(value)
        if (value === newPaswordRepeat)
            setValidNewPassword(false)
        else
            setValidNewPassword(true)

    };
    const setnewPaswordRepeatHandler = async value => {
        setNewPaswordRepeat(value);
        if (value === newPasword)
            setValidNewPassword(false)
        else
            setValidNewPassword(true)
    };


    const passwordSecurityCheck = async (password) => {
        console.log(zxcvbn(password).guesses_log10);
        let sifregucu = zxcvbn(password).guesses_log10;
        if (sifregucu >= 4)
            setValidPasswordSecurity(false)
        else
            setValidPasswordSecurity(true)

    }



    const passwordSetCheck = async () => {

        let messageNew = '';
        try {
            const response = await _passwordSetNew(oldPasword, newPasword);
            if (response.errors && response.errors[0]) {
                let messageCode = response.errors[0].split('.').join('_');
                messageNew = I18n.t('account.' + messageCode, { locale: language })
            }
            else if (response == "201") {
                messageNew = I18n.t('account.passwordChanged', { locale: language })
                setTimeout(
                    function () {
                        props.callback()
                    }
                        .bind(this),
                    1500
                );
            }
            else {
                console.log(response)
            }
            setPasswordMessage(messageNew);

            if (passwordMessage != null)
                callToast();
        } catch (error) {
            console.log(error)
        }
        return
    }

    return (
        <View style={styles.modalContainer}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <Toast message={passwordMessage} type={passwordMessage === (I18n.t('account.passwordChanged', { locale: language })) ? "success" : "danger"} />

                <View style={styles.modalHeader}>
                    <View style={{ flexDirection: "row", paddingVertical: 15, justifyContent: "center" }}>
                        <Vector
                            width={20}
                            height={18}
                            style={{ left: 11, alignSelf: "center" }}
                            color={theme[mode].lightblue}
                        />
                        <Text style={styles.title}>{I18n.t('account.changePassword', { locale: language })}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.modalCloseBtn}
                        onPress={props.modalCloseBtn}>
                        <X color={theme[props.mode].textblack} />
                    </TouchableOpacity>
                </View>


                <View style={styles.cekContainer}>

                    <View style={{ paddingVertical: 10, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.oldPassword', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            secureTextEntry={true}
                            placeholder={"***"}
                            onChangeText={onChangeText => setoldPaswordHandler(onChangeText)}
                            isEmpty={false}
                            amountValue={oldPasword}
                            dirty
                        />
                    </View>
                    <View style={{ paddingVertical: 10, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.newPassword', { locale: language })}
                        </Text>

                        <InputText
                            isEmpty={false}
                            secureTextEntry={true}
                            placeholder={"***"}
                            onChangeText={onChangeText => setnewaswordHandler(onChangeText)}
                            isEmpty={false}
                            amountValue={newPasword}
                            dirty
                        />
                    </View>

                    <View style={{ paddingVertical: 10, }}>
                        <Text style={styles.inpTitle}>
                            {I18n.t('account.newPasswordRepeat', { locale: language })}
                        </Text>
                        <InputText
                            isEmpty={false}
                            secureTextEntry={true}
                            placeholder={"***"}
                            onChangeText={onChangeText => setnewPaswordRepeatHandler(onChangeText.trim())}
                            isEmpty={false}
                            amountValue={newPaswordRepeat}
                            dirty
                        />
                        <View >
                            <Text style={{ color: theme[mode].red }} >  {newPaswordRepeat.length >= 3 ? (newPaswordRepeat === newPasword ? null : I18n.t('account.passwordNotMatch', { locale: language })) : null}</Text>

                        </View>
                    </View>

                    {/*  */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginBottom: 20,
                    }}>
                        <Button title={I18n.t('account.goOn', { locale: language })} btnLg btnLightBlue
                            disabled={(validPasswordSecurity || validNewPassword || !(oldPasword.length >= 4))}
                            callback={() => {
                                passwordSetCheck();

                            }} />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}



const setStyle = mode => ({
    cekContainer: {
        flex: 1,
        padding: 10,
    },
    title: {
        color: theme[mode].lightblue,
        left: 15,
        fontSize: 18,
        fontWeight: "500",
    },

    inpTitle: {
        color: theme[mode].textblack,
        fontSize: 12,
        lineHeight: 14,
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


