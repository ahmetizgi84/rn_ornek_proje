import React, { useContext, useState, useEffect } from 'react'
import { View, Text, FlatList, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native'
import { useFocusEffect } from "@react-navigation/native";
import I18n from '../../lang/_i18n'
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ornekappApi from '../../api/ornekappApi'
import { TextInputMask } from 'react-native-masked-text'

import HeaderLogin from '../../components/HeaderLogin';
import ProfileCard from '../../components/ProfileCard';
import Card from '../../components/Card'
import { Tl, Down, Plus, X, Trash, Warning } from '../../components/svg'
import * as componentsMap from '../../components/svg/icon';

import Toast from '../../components/Toast';
import Button from '../../components/Button';
import InputText from '../../components/InputText';


import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { DataContext } from '../../context/DataContext';


const { height } = Dimensions.get("screen")
const WITHDRAWAL_URL = "https://ornekapp.com/api/v2/platform/account/beneficiaries?currency_id=try"


export function Try() {
    const { state: { mode } } = useContext(ThemeContext);
    const styles = setStyle(mode);
    return (
        <View style={styles.circle}>
            <Tl width='13' height='19' color='white' />
        </View>
    )
}


function isNumeric(s) {
    return !isNaN(s - parseFloat(s));
}


function UpperKelime(string) {
    if (string == null)
        return null
    try {
        if (isNumeric(string.charAt(0)))
            string = "Svg" + string.charAt(0) + (string.charAt(1)).toUpperCase() + string.slice(2)
        else
            string = (string.charAt(0)).toUpperCase() + string.slice(1)
        const DynamicComponent = componentsMap[string];
        if (DynamicComponent == null)
            return null
        return <DynamicComponent height={32} width={32} />;
    } catch (error) {
        return null
    }
}

const WithdrawalScreen = ({ navigation, route }) => {
    const { item } = route.params
    const { state: { mode, language } } = useContext(ThemeContext);
    const { toastMessageHandler, toastMessage } = useContext(DataContext)
    const styles = setStyle(mode);

    const [adressTag, setAddressTag] = useState("");
    const [address, setAddress] = useState("");

    const [isModalVisible, setModalVisible] = useState(false);
    const [withdrawalModal, setWithdrawalModal] = useState(false)
    const [choosedWithdrawal, setChoosedWithdrawal] = useState(null)
    const [withdrawalAddresses, setWithdrawalAdresses] = useState([])
    const [twoFaModal, setTwoFaModal] = useState(false)
    const [modalItemPending, setModalItemPending] = useState(0)

    const [miktar, setMiktar] = useState(0)
    const [tutar, setTutar] = useState(0)
    const [otp, setOtp] = useState(0)
    const [errors, setErrors] = useState([])

    const setMiktarHandler = (amount) => {
        setMiktar(amount.replace(/[^0-9.]/g, ''))
        if (!amount) {
            setTutar(0)
        } else if (amount < 0) {
            setTutar(0)
        } else {
            let tmpTutar = parseFloat(amount) - parseFloat(item.withdraw_fee)
            if (tmpTutar < 0) {
                setTutar(0)
            } else {
                setTutar(tmpTutar)
            }
            setErrors([])
        }
    }

    const setOtpHandler = (otp) => {
        setOtp(otp.replace(/[^0-9.]/g, ''))
        setErrors([])
    }

    const sendWithdrawHandler = async () => {

        let err = [];

        if (choosedWithdrawal.length <= 0) {
            err.push("choosedWithdrawal")
        }

        if (miktar == 0 || miktar == "") {
            err.push("miktar")
        }

        if (otp == "") {
            err.push("otp")
        }

        if (err.length) {
            setErrors(err)
            return
        }

        const URL = `https://ornekapp.com/api/v2/platform/account/withdraws`

        try {

            const object = {
                amount: miktar,
                currency: item.id,
                otp: otp,
                beneficiary_id: item.id == "try" ? choosedWithdrawal.id : address + adressTag
            }
            const response = await ornekappApi.post(URL, object)
            if (response.data.state == "accepted") {
                toastMessageHandler("withdraw_accepted")
                navigation.navigate("ChillDetail");
            }


        } catch (error) {
            if (error.response.data.errors[0] === "account.withdraw.invalid_amount") {
                toastMessageHandler("withdraw_invalid_amount")
            }
            if (error.response.data.errors[0] === "account.withdraw.invalid_otp") {
                toastMessageHandler("invalid_otp")
            }
            if (error.response.data.errors[0] === "account.withdraw.insufficient_balance") {
                toastMessageHandler("insufficient_balance")
            }
            if (error.response.data.errors[0] === "account.withdraw.create_error") {
                toastMessageHandler("try_new_otp")
                setOtp(0)
            }
        }
    }




    const withdrawalRemover = async (id) => {
        const filtered = withdrawalAddresses.filter(i => i.id !== id)
        const DELETE_URL = `https://ornekapp.com/api/v2/platform/account/beneficiaries/${id}`;
        await ornekappApi.delete(DELETE_URL)
        setWithdrawalAdresses(filtered)
        await AsyncStorage.removeItem('WITHDRAWAL')
        setChoosedWithdrawal(null)
        await _getWithdrawalAdresses();

    }

    const showWithdrawalData = () => {
        if (withdrawalAddresses.length) {
            setWithdrawalModal(true)
        }
    }

    const chooseWithdrawal = async (item) => {
        if (item.state == 'active') {
            await AsyncStorage.setItem('WITHDRAWAL', item.id.toString())
            const choosed = withdrawalAddresses.find(d => d.id == item.id)
            setChoosedWithdrawal(choosed)
            setWithdrawalModal(false)
        } else {
            setModalItemPending(item.id)
            setWithdrawalModal(false)
            setTwoFaModal(true)

        }
    }

    const formatMoney = (n) => {
        return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').replace(/\.(\d+)$/, ',$1');
    }


    useEffect(() => {
        _getWithdrawalAdresses();
    }, [])

    const _getWithdrawalAdresses = async () => {
        const { data } = await axios.get(WITHDRAWAL_URL)
        setWithdrawalAdresses(data)

        const withdrawalId = await AsyncStorage.getItem('WITHDRAWAL')
        if (withdrawalId) {
            const findWithdrawal = data.find(d => d.id === parseInt(withdrawalId))
            setChoosedWithdrawal(findWithdrawal)
        } else {
            if (data.length) {
                const activeOne = data.find(d => d.state == 'active')
                if (activeOne) {
                    await AsyncStorage.setItem('WITHDRAWAL', activeOne.id.toString())
                    setChoosedWithdrawal(activeOne)
                }
            } else {
                setWithdrawalModal(false)
                setModalVisible(true)
            }
        }
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: theme[mode].bg,
        }}>
            <HeaderLogin settings navigation={navigation} />

            <ScrollView keyboardShouldPersistTaps="handled">

                {
                    toastMessage == "withdraw_invalid_amount" ? <Toast message={I18n.t('withdrawalScreen.invalid_amount', { locale: language })} type="danger" /> :
                        toastMessage == "invalid_otp" ? <Toast message={I18n.t('withdrawalScreen.invalid_otp', { locale: language })} type="danger" /> :
                            toastMessage == "insufficient_balance" ? <Toast message={I18n.t('withdrawalScreen.insufficient_balance', { locale: language })} type="danger" /> :
                                toastMessage == "withdraw_accepted" ? <Toast message={I18n.t('withdrawalScreen.withdraw_accepted', { locale: language })} type="success" /> :
                                    toastMessage == "try_new_otp" ? <Toast message={I18n.t('withdrawalScreen.try_new_otp', { locale: language })} type="danger" /> :
                                        null

                }


                <ProfileCard />

                <Card>
                    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: 'center' }}>
                        <View>
                            {UpperKelime(item.id)}

                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.tl}>{item.title}</Text>
                            <Text style={styles.btc}>{item.id == 'try' ? formatMoney(item.balance) : item.balance} {item.id.toUpperCase()}</Text>
                        </View>
                    </View>
                </Card>

                <Card>
                    {/* dropdown and new address button */}
                    {item.withdrawal_enabled ?
                        (<View>

                            {item.id == 'try' ?
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <TouchableOpacity style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginRight: 10,
                                        alignItems: 'center',
                                        paddingLeft: 10,
                                        borderRadius: 5,
                                        height: 42,
                                        backgroundColor: theme[mode].cardinputdirty
                                    }}
                                        onPress={() => showWithdrawalData()}
                                    >
                                        {
                                            choosedWithdrawal ?
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: theme[mode].buttontextgray, fontSize: 11 }}>
                                                        {choosedWithdrawal?.name}
                                                    </Text>
                                                    <Text style={{
                                                        color: theme[mode].textblack,
                                                        fontSize: 12,
                                                    }}
                                                        numberOfLines={1}>
                                                        {choosedWithdrawal?.data.account_number}
                                                    </Text>
                                                </View> :
                                                <Text style={{
                                                    color: theme[mode].buttontextgray,
                                                    fontSize: 12
                                                }}>
                                                    {I18n.t('withdrawalScreen.noaddress', { locale: language })}
                                                </Text>


                                        }
                                        <View style={{
                                            width: 36,
                                            height: 42,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Down color={theme[mode].inputIconColor} />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: theme[mode].cardinputdirty
                                    }}
                                        onPress={() => setModalVisible(true)}
                                    >
                                        <Plus color={theme[mode].inputIconColor} />
                                    </TouchableOpacity>
                                </View>
                                : <View style={{ marginBottom: 0 }}>
                                    <Text style={{ fontSize: 9 }}>{I18n.t('walletScreen.withdraw_input', { locale: language })}</Text>
                                    <InputText
                                        keyboardType="email-address"
                                        onChangeText={onChangeText => setAddress(onChangeText.trim())}
                                        isEmpty={false}
                                        dirty

                                    />
                                    {
                                        item.id.toLowerCase() == 'xrp' ?
                                            <View>
                                                <Text style={{ fontSize: 9 }}>{I18n.t('walletScreen.deposite_tag', { locale: language })}</Text>
                                                <InputText
                                                    onChangeText={onChangeText => setAddressTag('?dt=' + onChangeText.trim())}
                                                    isEmpty={false}
                                                    dirty
                                                // amountValue={item.deposites && walletAddressSplit[1]}

                                                />
                                            </View>
                                            : null

                                    }
                                </View>
                            }
                            {/* Miktar girişi */}
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>{I18n.t('withdrawalScreen.amount', { locale: language })}</Text>
                                <InputText
                                    keyboardType={Platform.OS === "android" ? "number-pad" : "numbers-and-punctuation"}
                                    onChangeText={onChangeText => setMiktarHandler(onChangeText)}
                                    dirty
                                    isEmpty={errors.find(err => err === 'miktar') ? true : false}
                                    amountValue={miktar == 0 ? "" : miktar.toString()}
                                />
                            </View>

                            <View>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    justifyContent: "space-between"
                                }}>
                                    <Text style={{ color: theme[mode].buttontextgray, fontSize: 12 }}>{I18n.t('withdrawalScreen.fee', { locale: language })}</Text>
                                    <Text style={{ color: theme[mode].usertextblack, fontSize: 14 }}>{item.withdraw_fee} {item.id.toUpperCase()}</Text>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    justifyContent: "space-between",
                                    marginTop: 15
                                }}>
                                    <Text style={{ color: theme[mode].buttontextgray, fontSize: 12 }}>{I18n.t('withdrawalScreen.total', { locale: language })}</Text>
                                    <Text style={{ color: theme[mode].usertextblack, fontSize: 14 }}>{tutar} {item.id.toUpperCase()}</Text>
                                </View>
                                <Text style={{ color: theme[mode].buttontextgray, fontSize: 12 }}>{"Minimum Çekim Ücreti: "} {item.min_withdraw_amount}  {item.id.toUpperCase()}</Text>
                            </View>

                            {/* 2FA CODE */}
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>{I18n.t('withdrawalScreen.twofa', { locale: language })}</Text>
                                <InputText
                                    keyboardType={Platform.OS === "android" ? "number-pad" : "numbers-and-punctuation"}
                                    onChangeText={onChangeText => setOtpHandler(onChangeText)}
                                    dirty
                                    isEmpty={errors.find(err => err === 'otp') ? true : false}
                                    amountValue={otp == 0 ? "" : otp.toString()}
                                />
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <Button title={I18n.t('chillDetailScreen.withdraw', { locale: language })} btnLg btnDanger callback={() => sendWithdrawHandler()} />
                            </View>
                        </View>)
                        :
                        (<View style={styles.thead}>
                            <Warning width={32} height={32} color={theme[mode].buttontextgray} />
                            <Text style={styles.theadText}>{I18n.t('walletScreen.withdraw_enabled', { locale: language })} </Text>
                        </View>
                        )}
                </Card>


            </ScrollView>

            <Modal
                isVisible={isModalVisible}
                backdropOpacity={0.20}
                hasBackdrop={true}
                useNativeDriver={true}
                style={{ flex: 1, margin: 0, marginHorizontal: 10 }}
            >
                <ChildModal
                    callback={() => setModalVisible(false)}
                    item={item}
                    mode={mode}
                    language={language}
                    getWithdrawalAdresses={_getWithdrawalAdresses}
                />
            </Modal>

            <Modal
                isVisible={withdrawalModal}
                backdropOpacity={0.20}
                hasBackdrop={true}
                useNativeDriver={true}
                style={{ flex: 1, margin: 0, marginHorizontal: 10 }}
            >
                <ChildWithdrawalModal
                    callback={() => setWithdrawalModal(false)}
                    mode={mode}
                    withdrawalRemover={withdrawalRemover}
                    withdrawalAddresses={withdrawalAddresses}
                    language={language}
                    chooseWithdrawal={chooseWithdrawal}
                />
            </Modal>

            <Modal
                isVisible={twoFaModal}
                //backdropColor="#FFF"
                backdropOpacity={0.20}
                hasBackdrop={true}
                useNativeDriver={true}
                style={{ flex: 1, margin: 0, marginHorizontal: 10 }}
            >
                <TwoFaModal
                    mode={mode}
                    language={language}
                    callback={() => setTwoFaModal(false)}
                    navigation={navigation}
                    id={modalItemPending}
                    getWithdrawalAdresses={_getWithdrawalAdresses}
                />
            </Modal>
        </View>
    )
}

export default WithdrawalScreen

function TwoFaModal({ ...props }) {
    const { mode, language, callback, id, getWithdrawalAdresses } = props
    const { toastMessageHandler, toastMessage } = useContext(DataContext)
    const styles = setStyle(mode);
    const [pinCode, setPinCode] = useState("")

    const resendPin = async () => {
        const RESEND_PIN_URL = `/platform/account/beneficiaries/${id}/resend_pin`
        try {
            const response = await ornekappApi.patch(RESEND_PIN_URL)
            toastMessageHandler("resend_pin");

        } catch (error) {
            if (error.response.data.errors[0] === "account.beneficiary.cant_resend_within_1_minute") {
                toastMessageHandler("one_minute_mail");
            }
        }
    }

    const approveAddr = async () => {
        try {
            const ACTIVATE_PIN_URL = `/platform/account/beneficiaries/${id}/activate`
            const response = await ornekappApi.patch(ACTIVATE_PIN_URL, { 'pin': pinCode.toString(), 'id': id })
            if (response.data.state === "active") {
                callback();
                setPinCode("");
                await getWithdrawalAdresses();
            }

        } catch (error) {
            if (error.response.data.errors[0] === "account.beneficiary.invalid_pin") {
                toastMessageHandler("invalid_pin");
            }
        }
    }

    return (

        <View style={{
            //width: "90%",
            //alignSelf: "center",
            height: 240,
            backgroundColor: theme[mode].white,
            ...theme.shadow,
            padding: 10,
        }}>
            <View style={{
                alignItems: "flex-end",
                paddingBottom: 10,
                borderBottomWidth: 0.3,
                borderColor: theme[mode].searchInputBorderColor,
            }}>
                <TouchableOpacity
                    style={{
                        padding: 2,
                        backgroundColor: theme[mode].bg,
                        borderRadius: 5
                    }}
                    onPress={callback}>
                    <X color={theme[mode].textblack} />
                </TouchableOpacity>
            </View>
            <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled">

                {
                    toastMessage == "one_minute_mail" ? <Toast message={I18n.t("withdrawalScreen.waitForAMinute", { locale: language })} type="danger" /> :
                        toastMessage == "resend_pin" ? <Toast message={I18n.t("withdrawalScreen.pinSent", { locale: language })} type="success" /> :
                            toastMessage == "invalid_pin" ? <Toast message={I18n.t("withdrawalScreen.invalidPin", { locale: language })} type="danger" /> : null

                }

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ color: theme[mode].textblack, marginVertical: 15 }}>
                        {I18n.t("withdrawalScreen.desc", { locale: language })}
                    </Text>
                    <InputText
                        dirty
                        placeholder="Pin Kodu"
                        keyboardType={Platform.OS === "android" ? "number-pad" : "numbers-and-punctuation"}
                        onChangeText={onChangeText => setPinCode(onChangeText.trim())}
                        //isEmpty={errors.find(err => err === 'email') ? true : false}
                        amountValue={pinCode}
                    />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "space-around",
                        width: '100%',
                        marginVertical: 10
                    }}>
                        <Button containerStyle={{ width: 165 }} title="Pini Yeniden Gönder" btnSm btnDanger callback={() => resendPin()} />
                        <Button title="Onayla" btnSm btnSuccess callback={() => approveAddr()} />
                    </View>
                </View>
            </ScrollView>

        </View>

    )
}

const ChildModal = ({ ...props }) => {
    const { item, mode, callback, language, getWithdrawalAdresses } = props
    const { toastMessageHandler, toastMessage } = useContext(DataContext)
    const styles = setStyle(mode);
    const [addressName, setAddressName] = useState("")
    const [fullName, setFullName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [bankName, setBankName] = useState("")
    const [errors, setErrors] = useState([])



    const addNewAddressHandler = async () => {
        let errs = [];

        if (addressName == "") {
            errs.push('addressName');
        }

        if (fullName == "") {
            errs.push('fullName');
        }

        if (accountNumber == "") {
            errs.push('accountNumber');
        }

        if (bankName == "") {
            errs.push('bankName');
        }

        if (errs.length) {
            setErrors(errs);
            return;
        }


        const obj = {
            currency: item.id,
            name: addressName,
            data: {
                full_name: fullName,
                account_number: accountNumber,
                bank_name: bankName,
            }
        };

        try {
            const response = await ornekappApi.post("https://ornekapp.com/api/v2/platform/account/beneficiaries", obj);
            if (response.data) {
                toastMessageHandler("account_created")
                await getWithdrawalAdresses();
                setTimeout(() => {
                    callback();
                }, 3500)
            }
        } catch (error) {
            console.log(error.response)
        }
    }


    const setAddressNameHandler = addr => {
        setAddressName(addr);
        setErrors([]);
    };

    const setFullNameHandler = fname => {
        setFullName(fname);
        setErrors([]);
    };

    const setAccountNumberHandler = acc => {
        setAccountNumber(acc);
        setErrors([]);
    };

    const setBankNameHandler = bank => {
        setBankName(bank);
        setErrors([]);
    };





    const addNewCryptoAddress = () => {

    }

    useFocusEffect(
        React.useCallback(() => {
            setErrors([]);
        }, [])
    );

    return (
        <View style={styles.modalContainer}>


            <View style={styles.modalHeader}>

                <Text style={{ color: theme[mode].textblack, fontSize: 12 }}>
                    {I18n.t('withdrawalScreen.addNew', { locale: language })}
                </Text>

                <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={callback}>
                    <X color={theme[mode].textblack} />
                </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">

                {
                    toastMessage == "account_created" && <Toast message='Adres onaylama pini mail adresinize gönderildi' type='success' />
                }


                {
                    item.id == 'try' ?
                        (
                            <>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>
                                        {I18n.t('withdrawalScreen.addrName', { locale: language })}
                                    </Text>
                                    <InputText
                                        onChangeText={onChangeText => setAddressNameHandler(onChangeText)}
                                        dirty
                                        isEmpty={errors.find(err => err === 'addressName') ? true : false}
                                        amountValue={addressName.toString()}
                                    />
                                </View>

                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>
                                        {I18n.t('withdrawalScreen.nameSurname', { locale: language })}
                                    </Text>
                                    <InputText
                                        onChangeText={onChangeText => setFullNameHandler(onChangeText)}
                                        dirty
                                        isEmpty={errors.find(err => err === 'fullName') ? true : false}
                                        amountValue={fullName.toString()}
                                    />
                                </View>

                                {/* IBAN */}
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>
                                        {I18n.t('withdrawalScreen.iban', { locale: language })}
                                    </Text>

                                    <TextInputMask
                                        type={'custom'}
                                        options={{
                                            mask: 'TR99 9999 9999 9999 9999 9999 99'
                                        }}
                                        autoCapitalize="characters"
                                        placeholder="TR__ ____ ____ ____ ____ ____ __"
                                        placeholderTextColor={theme[mode].buttontextgray}
                                        value={accountNumber}
                                        onChangeText={onChangeText => setAccountNumberHandler(onChangeText)}
                                        style={
                                            {
                                                marginBottom: 1, borderRadius: 8,
                                                borderWidth: 1,
                                                borderColor: 'transparent',
                                                flex: 1,
                                                padding: 10,
                                                backgroundColor: theme[mode].cardinputdirty,
                                                color: theme[mode].textblack,
                                            }
                                        }
                                    />
                                </View>

                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>
                                        {I18n.t('withdrawalScreen.bank', { locale: language })}
                                    </Text>
                                    <InputText
                                        onChangeText={onChangeText => setBankNameHandler(onChangeText)}
                                        dirty
                                        isEmpty={errors.find(err => err === 'bankName') ? true : false}
                                        amountValue={bankName.toString()}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Button title={I18n.t('withdrawalScreen.submit', { locale: language })} btnLg btnPrimary callback={() => addNewAddressHandler()} />
                                </View>
                            </>
                        ) :
                        (
                            <>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>
                                        {I18n.t('withdrawalScreen.benefic', { locale: language })}
                                    </Text>
                                    <InputText
                                        //onChangeText={onChangeText => setAmountHandler(onChangeText.replace(/[^0-9.]/g, ''))}
                                        dirty
                                    //isEmpty={errors.find(err => err === 'amount') ? true : false}
                                    //amountValue={amount.toString()}
                                    />
                                </View>

                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>
                                        {I18n.t('withdrawalScreen.chainAddr', { locale: language })}
                                    </Text>
                                    <InputText
                                        //onChangeText={onChangeText => setAmountHandler(onChangeText.replace(/[^0-9.]/g, ''))}
                                        dirty
                                    //isEmpty={errors.find(err => err === 'amount') ? true : false}
                                    //amountValue={amount.toString()}
                                    />
                                </View>

                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 12, marginBottom: 5 }}>
                                        {I18n.t('withdrawalScreen.desc', { locale: language })}
                                    </Text>
                                    <InputText
                                        //onChangeText={onChangeText => setAmountHandler(onChangeText.replace(/[^0-9.]/g, ''))}
                                        dirty
                                    //isEmpty={errors.find(err => err === 'amount') ? true : false}
                                    //amountValue={amount.toString()}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Button title={I18n.t('withdrawalScreen.submit', { locale: language })} btnLg btnPrimary callback={() => addNewCryptoAddress()} />
                                </View>
                            </>
                        )
                }


            </ScrollView>
        </View>
    )
}

const ChildWithdrawalModal = ({ ...props }) => {
    const { mode, callback, withdrawalRemover, withdrawalAddresses, language, chooseWithdrawal } = props
    const styles = setStyle(mode);


    const _renderItem = ({ item }) => {
        return (
            <View style={{
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: theme[mode].inputbordercolor,
                paddingVertical: 5
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: "space-between",
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 12, color: theme[mode].textblack, fontWeight: 'bold' }}>{item.name}</Text>
                    <TouchableOpacity
                        onPress={() => withdrawalRemover(item.id)}
                    >
                        <Trash width={20} height={20} color={theme[mode].red} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => chooseWithdrawal(item)} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: theme[mode].buttontextgray, fontSize: 11 }}>{I18n.t('withdrawalScreen.addr', { locale: language })}</Text>
                        <Text style={[{ fontSize: 11 }, item.state == 'pending' ? { color: theme[mode].pendingColor } : { color: theme[mode].green }]}>
                            {
                                item.state == 'pending' ? 'Beklemede' : 'Onaylanmış'
                            }
                        </Text>
                    </View>
                    <Text style={{ color: theme[mode].usertextblack, fontSize: 13 }}>{item.data.account_number}</Text>
                    {
                        item.description !== null &&
                        <>
                            <Text style={{ color: theme[mode].usertextblack, fontSize: 13 }}>{item.desc}</Text>
                            <Text style={{ color: theme[mode].buttontextgray, fontSize: 11 }}>{I18n.t('withdrawalScreen.descr', { locale: language })}</Text>
                        </>
                    }
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>

                <Text style={{ color: theme[mode].textblack, fontSize: 12 }}>
                    {I18n.t('withdrawalScreen.myAddresses', { locale: language })}
                </Text>

                <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={callback}>
                    <X color={theme[mode].textblack} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={withdrawalAddresses}
                keyExtractor={(item) => item.id}
                renderItem={_renderItem}
            />

        </View>
    )
}


const setStyle = mode => ({
    title: {
        fontSize: 10,
        color: theme[mode].textblack,
        marginBottom: 7
    },
    tl: {
        color: theme[mode].lightblue,
        marginBottom: 3
    },
    btc: {
        color: theme[mode].darkblue,
    },
    circle: {
        borderRadius: 24,
        width: 24,
        height: 24,
        borderWidth: 5,
        borderColor: '#e9ba45',
        backgroundColor: '#e9ba45',
        alignItems: 'center',
        justifyContent: 'center'
    },

    modalContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: height / 1.62,
        backgroundColor: theme[mode].white,
        ...theme.shadow,
        padding: 15,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderWidth: 0.5,
        borderColor: theme[mode].inputbordercolor,
        flex: 1
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
        borderBottomWidth: 0.3,
        borderColor: theme[mode].searchInputBorderColor,
        marginBottom: 5,
    },

    modalCloseBtn: {
        padding: 2,
        backgroundColor: theme[mode].bg,
        borderRadius: 5
    },

    cekYatir: {
        paddingVertical: 10,
        paddingRight: 2,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },

    row: {
        marginHorizontal: 10,
        paddingHorizontal: 10,
        height: 42,
        //paddingVertical: 10,
        backgroundColor: theme[mode].white,
        marginBottom: 5,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center"
    },

    itemText: {
        fontSize: 12,
        width: 75,
        flex: 2
    },

    nodata: {
        paddingHorizontal: 5,
        paddingVertical: 12,
    },


    sellBuyBtn: {
        width: 91.25,
        //paddingHorizontal: 35,
        paddingVertical: 5,
        justifyContent: "center",
        alignItems: "center",
    },

    active: {
        ...theme.shadow,
        backgroundColor: theme[mode].btnActiveColor,
        borderRadius: 5
    },

    passive: {
        backgroundColor: theme[mode].btnPassiveColor,
        borderRadius: 5,
    },

    btnText: {
        fontSize: 12,
    },

    activeText: {
        fontWeight: "700",
        color: theme[mode].lightblue
    },

    passiveText: {
        fontWeight: "400",
        color: theme[mode].textblack
    },

    inpTitle: {
        color: theme[mode].textblack,
        fontSize: 10,
        marginBottom: 5,
    },

    inpTitle2: {
        color: theme[mode].textblack,
        fontSize: 10,
        marginBottom: 5
    },

    qrCode: {
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 30
    },

    priceType: {
        fontSize: 12,
        color: theme[mode].textblack,
        marginTop: 10,
        marginBottom: 10
    },

    accountName: {
        flex: 1,
        color: theme[mode].textblack,
        fontSize: 12,
        marginBottom: 10
    },

    ibanNo: {
        flex: 1,
        color: theme[mode].textblack,
        fontSize: 15,
        fontWeight: 'bold'
    },

    deposite_title: {
        marginTop: 20,
        fontSize: 12,
        color: theme[mode].textblack,
    },

    deposite_li: {
        marginTop: 5,
        fontSize: 10,
        color: theme[mode].textblack,
    },

    disabled: {
        marginTop: 30,
        marginBottom: 30,
        marginHorizontal: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    thead: {
        alignItems: "center",
        justifyContent: "center",
        height: 150
    },

    theadText: {
        fontSize: 12,
        color: theme[mode].buttontextgray,
    },
})