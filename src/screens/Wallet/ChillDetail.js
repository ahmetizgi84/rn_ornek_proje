import React, { useContext, useState, useEffect } from 'react'
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import I18n from '../../lang/_i18n'
import Modal from 'react-native-modal'
import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect } from "@react-navigation/native";

import HeaderLogin from '../../components/HeaderLogin';
import ProfileCard from '../../components/ProfileCard';
import Card from '../../components/Card'
import Buttons from './Buttons'
import { X, Copy, Tl, Akbank, Nodata, Warning } from '../../components/svg'
import * as componentsMap from '../../components/svg/icon';

import Toast, { callToast } from '../../components/Toast';
import Button from '../../components/Button';


import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { DataContext } from '../../context/DataContext';
import { SocketContext } from '../../context/SocketContext';
import { Context as AuthContext } from '../../context/AuthContext';
import QRCode from 'react-native-qrcode-svg';
import InputText from '../../components/InputText';

const bankData = [
    {
        id: 0,
        bankName: 'Akbank',
        logo: <Akbank width={150} />,
        priceType: 'TRY (Türk Lirası)',
        accountName: 'ORNEK BİLiŞiM TEKNOLOJİ YATIRIM ÜRETİM PAZARLAMA İHRACAT ANONİM ŞİRKETİ',
        ibanNo: '',
    },
];

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

const ChillDetail = ({ navigation, route }) => {
    const { item } = route.params
    const { state: { userData } } = useContext(AuthContext);
    const { deposits, withdraws, _getTransactionsHistory } = useContext(DataContext)
    const { state: { mode, language } } = useContext(ThemeContext);

    const [state, setState] = useState(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [userProfile, setUserProfile] = useState(false);
    const [withdrawals, setWithdrawals] = useState([])
    const [twoFaModal, setTwoFaModal] = useState(false)
    const [deposit, setDeposit] = useState([])
    const styles = setStyle(mode);


    const changeBtnState = (state) => {
        setState(state)
    }

    useEffect(async () => {
        userData.labels.find(function (item, index) {
            if (item.key == 'document') {
                if (item.value == 'enabled') {
                    setUserProfile(true);
                }
                else if (item.value == 'verified') {
                    setUserProfile(true);
                }
                else if (item.value == 'drafted') {
                    setUserProfile(false);
                }
                else if (item.value == 'rejected') {
                    setUserProfile(false);
                }
                else setUserProfile(false);
            }
        });
    }, [userData]);


    useFocusEffect(
        React.useCallback(() => {
            const getRelatedHistory = async () => {
                await _getTransactionsHistory();
                const relatedWithdrawalList = withdraws.filter(withdraw => withdraw.currency == item.id)
                const relatedDepositList = deposits.filter(deposit => deposit.currency == item.id)
                if (relatedWithdrawalList.length > 0 && relatedDepositList.length > 0) {
                    setWithdrawals(relatedWithdrawalList)
                    setDeposit(relatedDepositList)
                }
            }


            getRelatedHistory();
        }, [deposits, withdraws])
    );


    const checkForWithdraw = () => {
        if (userData.otp) {
            navigation.navigate('Withdrawal', { item: item })
        } else {
            setTwoFaModal(true)
        }
    }

    const formatMoney = (n) => {
        return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').replace(/\.(\d+)$/, ',$1');
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme[mode].bg,
        }}>
            <HeaderLogin settings navigation={navigation} />

            <ProfileCard />

            <Card>
                <View style={{ alignItems: "center", flexDirection: "row", justifyContent: 'center' }}>
                    <View>
                        {UpperKelime(item.id)}

                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.tl}>{item.title === "TRY (Turkish Lira)" ? language === "tr" ? "TRY (Türk Lirası)" : item.title : item.title}</Text>
                        <Text style={styles.btc}>{item.id == 'try' ? formatMoney(item.balance) : item.balance} {item.id.toUpperCase()}</Text>
                    </View>
                </View>
            </Card>


            <View style={{
                flex: 1,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: theme[mode].white,
                marginHorizontal: 10,
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 8,
                ...theme.shadow,
            }}>
                <Buttons callback={changeBtnState} state={state} />
                <View style={{ marginTop: 10, flex: 1 }}>
                    {
                        state == 1 ? <WithdrawalHistory withdraw={withdrawals} /> : <DepositHistory deposit={deposit} />
                    }
                </View>
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginVertical: 5 }}>
                <View style={{ flex: 1, marginRight: 5 }}><Button title={I18n.t('chillDetailScreen.deposit', { locale: language })} btnLg btnSuccess callback={() => setModalVisible(true)} /></View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                    <Button title={I18n.t('chillDetailScreen.withdraw', { locale: language })} btnLg btnDanger callback={() => checkForWithdraw()} />
                </View>
            </View>

            <Modal
                isVisible={isModalVisible}
                backdropOpacity={0.20}
                hasBackdrop={true}
                useNativeDriver={true}
                style={{ flex: 1, margin: 0, marginHorizontal: 10 }}
            >
                <ChildModal
                    mode={mode}
                    language={language}
                    callback={() => setModalVisible(false)}
                    item={item}
                    userProfile={userProfile}
                />
            </Modal>

            <Modal
                isVisible={twoFaModal}
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
                />
            </Modal>


        </View>
    )
}

export default ChillDetail


function TwoFaModal({ ...props }) {
    const { mode, language, callback, navigation } = props
    const styles = setStyle(mode);

    const goTwoFaHandler = () => {
        callback();
        navigation.navigate('AccountScreen')
    }

    return (

        <View style={{
            width: "90%",
            height: 220,
            alignSelf: "center",
            backgroundColor: theme[mode].white,
            //...theme.shadow,
            padding: 10,
        }}>
            <View style={{
                alignItems: "flex-end",
                paddingBottom: 10,
                borderBottomWidth: 0.3,
                borderColor: theme[mode].searchInputBorderColor,
                marginBottom: 5,
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

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Warning width={32} height={32} color={theme[mode].inputIconColor} />
                <Text style={{ color: theme[mode].textblack, marginVertical: 15 }}>{I18n.t('chillDetailScreen.twoFaWarn', { locale: language })}</Text>
                <Button containerStyle={{ width: 150 }} title={I18n.t('chillDetailScreen.btn', { locale: language })} btnSm btnSuccess callback={() => goTwoFaHandler()} />
            </View>

        </View>

    )
}

const ChildModal = ({ ...props }) => {
    const { item, mode, callback, userProfile, language } = props
    const { _adresCryptoOlustur } = useContext(SocketContext)
    const styles = setStyle(mode);

    const [adressTag, setAddressTag] = useState();
    const [address, setAddress] = useState();

    const copyHandler = (data) => {
        Clipboard.setString(data)
        callToast()
    }


    let walletAddressSplit = []
    if (item.deposites) {
        walletAddressSplit = item.deposites.address.split("?dt=")
    }


    return (
        <View style={styles.modalContainer}>
            <ScrollView keyboardShouldPersistTaps="handled">

                <Toast message={I18n.t('chillDetailScreen.copied', { locale: language })} type='success' />

                <View style={styles.modalHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {UpperKelime(item.id)}
                        <Text style={{ color: theme[mode].textblack, marginLeft: 5 }}>
                            {item.title}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.modalCloseBtn}
                        onPress={callback}>
                        <X color={theme[mode].textblack} />
                    </TouchableOpacity>
                </View>



                {

                    item.id == 'try' ?
                        userProfile ?
                            <View style={{ marginTop: 20 }}>
                                <View>{bankData[0].logo}</View>

                                <Text style={styles.priceType}>{bankData[0].priceType}</Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.accountName}>{bankData[0].accountName}</Text>
                                    <TouchableOpacity onPress={() => copyHandler(bankData[0].accountName)} style={{ width: 30 }}>
                                        <Copy style={{ color: theme[mode].inputIconColor, alignItems: "flex-end" }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.ibanNo}>{bankData[0].ibanNo}</Text>
                                    <TouchableOpacity onPress={() => copyHandler(bankData[0].ibanNo)} style={{ width: 30 }}>
                                        <Copy style={{ color: theme[mode].inputIconColor, alignItems: "flex-end" }} />
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <Text style={styles.deposite_title}>{I18n.t('walletScreen.deposite_title', { locale: language })}</Text>
                                    <Text style={styles.deposite_li}>1. {I18n.t('walletScreen.deposite_li1', { locale: language })}</Text>
                                    <Text style={styles.deposite_li}>2. {I18n.t('walletScreen.deposite_li2', { locale: language })}</Text>
                                    <Text style={styles.deposite_li}>3. {I18n.t('walletScreen.deposite_li3', { locale: language })}</Text>
                                    <Text style={styles.deposite_li}>4. {I18n.t('walletScreen.deposite_li4', { locale: language })}</Text>
                                    <Text style={styles.deposite_li}>5. {I18n.t('walletScreen.deposite_li5', { locale: language })}</Text>
                                </View>
                            </View>
                            :
                            <View style={styles.thead}>
                                <Warning width={32} height={32} color={theme[mode].buttontextgray} />
                                <Text style={styles.theadText}>{I18n.t('walletScreen.deposite_Not_Profile', { locale: language })}</Text>
                            </View>
                        :
                        (
                            item.deposites ? (
                                <View style={styles.yatirContainer}>
                                    <View style={styles.qrCode}>
                                        <QRCode
                                            value={item.deposites && walletAddressSplit[0]}
                                            logoSize={112}
                                        />
                                    </View>
                                    <View style={{ marginBottom: 38 }}>

                                        <Text style={{ fontSize: 9 }}>{I18n.t('walletScreen.deposite_input', { locale: language })}</Text>
                                        <InputText
                                            keyboardType="email-address"
                                            onChangeText={onChangeText => setAddress(onChangeText.trim())}
                                            isEmpty={false}
                                            dirty
                                            amountValue={item.deposites && walletAddressSplit[0]}
                                            rightIcon={
                                                <TouchableOpacity
                                                    onPress={() => copyHandler(item.deposites && walletAddressSplit[0])}>
                                                    <Copy color={theme[mode].inputIconColor} />
                                                </TouchableOpacity>
                                            }
                                        />
                                        {
                                            item.id.toLowerCase() == 'xrp' ?
                                                <View>
                                                    <Text style={{ fontSize: 9 }}>{I18n.t('walletScreen.deposite_tag', { locale: language })}</Text>
                                                    <InputText
                                                        keyboardType="email-address"
                                                        onChangeText={onChangeText => setAddressTag(onChangeText.trim())}
                                                        isEmpty={false}
                                                        dirty
                                                        amountValue={item.deposites && walletAddressSplit[1]}
                                                        rightIcon={
                                                            <TouchableOpacity
                                                                onPress={() => copyHandler(item.deposites && walletAddressSplit[1])}>
                                                                <Copy color={theme[mode].inputIconColor} />
                                                            </TouchableOpacity>
                                                        }
                                                    />
                                                </View>
                                                : null

                                        }
                                    </View>
                                    <View>
                                        <Text style={{ color: theme[mode].textblack, fontSize: 10, fontWeight: "500" }}>{I18n.t('walletScreen.desc1', { locale: language })}</Text>
                                        <Text style={{ color: theme[mode].textblack, fontSize: 10, fontWeight: "400" }}>{I18n.t('walletScreen.desc2', { locale: language })}{I18n.t('walletScreen.desc3', { locale: language })}</Text>
                                    </View>
                                </View>
                            ) : (

                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    marginBottom: 20,
                                }}>
                                    <Button callback={() => _adresCryptoOlustur(item.id)} title={I18n.t('walletScreen.btnAdresOlustur', { locale: language })} btnLg btnSuccess />
                                </View>
                            )
                        )




                }

            </ScrollView>
        </View>
    )
}

export function WithdrawalHistory({ withdraw }) {
    const { state: { mode, language } } = useContext(ThemeContext);

    const handleTime = (time) => {
        var ds = time.toString();
        var tar = ds.replace('T', ' ')
        var tarih = tar.replace('+02:00', '')
        return tarih
    }

    const _renderItem = ({ item }) => {
        return (
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: theme[mode].inputbordercolor,
                paddingVertical: 10,
            }}>
                <View>
                    <Text style={{ color: theme[mode].textblack, fontSize: 14, fontWeight: 'normal' }}>{item.amount} {item.currency.toUpperCase()}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: theme[mode].textblack, fontSize: 12, fontWeight: 'normal', marginRight: 5 }}>{handleTime(item.created_at)}</Text>
                    </View>
                </View>
                <Text style={[{ fontSize: 12, fontWeight: 'normal' }, item.state == "accepted" ? { color: theme[mode].green } : item.state == "pending" ? { color: theme[mode].pendingColor } : { color: theme[mode].red }]}>{item.state}</Text>
            </View>
        )
    }


    // const _renderItem = ({ item }) => {
    //     return (
    //         <View style={{
    //             flexDirection: "row",
    //             justifyContent: "space-between",
    //             alignItems: 'center',
    //             borderBottomWidth: 1,
    //             borderBottomColor: theme[mode].inputbordercolor,
    //             paddingVertical: 10,
    //         }}>
    //             <View>
    //                 <Text style={{ color: theme[mode].textblack, fontSize: 14, fontWeight: 'normal' }}>{item.amount}</Text>
    //                 <View style={{ flexDirection: "row" }}>
    //                     <Text style={{ color: theme[mode].textblack, fontSize: 12, fontWeight: 'normal', marginRight: 5 }}>{item.date}</Text>
    //                     <Text style={{ color: theme[mode].buttontextgray, fontSize: 12, fontWeight: 'normal' }}>{item.time}</Text>
    //                 </View>
    //             </View>
    //             <Text style={[{ fontSize: 12, fontWeight: 'normal' }, item.state == "Tamamlandı" ? { color: theme[mode].green } : item.state == "Bekliyor" ? { color: theme[mode].pendingColor } : { color: theme[mode].red }]}>{item.state}</Text>
    //         </View>
    //     )
    // }

    const _emptyComponent = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Nodata width={70} height={68.33} />
                <Text style={{ color: theme[mode].buttontextgray, fontSize: 12 }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={withdraw}
            keyExtractor={(item) => item.id}
            renderItem={_renderItem}
            ListEmptyComponent={_emptyComponent}
        />
    )
}

export function DepositHistory({ deposit }) {
    const { state: { mode, language } } = useContext(ThemeContext);



    const handleTime = (time) => {
        var ds = time.toString();
        var tar = ds.replace('T', ' ')
        var tarih = tar.replace('+02:00', '')
        return tarih
    }

    const _renderItem = ({ item }) => {
        return (
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: theme[mode].inputbordercolor,
                paddingVertical: 10,
            }}>
                <View>
                    <Text style={{ color: theme[mode].textblack, fontSize: 14, fontWeight: 'normal' }}>{item.amount} {item.currency.toUpperCase()}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: theme[mode].textblack, fontSize: 12, fontWeight: 'normal', marginRight: 5 }}>{handleTime(item.created_at)}</Text>
                    </View>
                </View>
                <Text style={[{ fontSize: 12, fontWeight: 'normal' }, item.state == "accepted" ? { color: theme[mode].green } : item.state == "pending" ? { color: theme[mode].pendingColor } : { color: theme[mode].red }]}>{item.state}</Text>
            </View>
        )
    }

    const _emptyComponent = () => {
        return (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <Nodata width={70} height={68.33} />
                <Text style={{ color: theme[mode].buttontextgray, fontSize: 12 }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
            </View>
        )
    }
    return (
        <FlatList
            data={deposit}
            keyExtractor={(item) => item.id}
            renderItem={_renderItem}
            ListEmptyComponent={_emptyComponent}
        />
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
        height: 500,
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