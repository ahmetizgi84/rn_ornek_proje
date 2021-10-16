import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import I18n from '../lang/_i18n'
//import Modal from 'react-native-modal';

import Layout from '../components/Layout';
import Card from '../components/Card'
import { Clock, Nodata } from '../components/svg';
import Search from '../components/Search';
import TableTransaction from '../components/TableTransaction';
import Toast from '../components/Toast';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { DataContext } from '../context/DataContext';
import ProfileCard from '../components/ProfileCard';


const TransactionHistoryScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { deposits, isProcessing, toastMessage, withdraws, _getTransactionsHistory, _loadMoreTransactionHistory } = useContext(DataContext)
    const styles = setStyle(mode);

    const [sort, setSort] = useState("deposits")
    const [filtered, setFiltered] = useState([])



    const _searchInTransaction = (searchText) => {
        let txt = searchText.toLowerCase();
        if (sort === 'deposits') {
            let filteredData = deposits.filter(function (item) {
                return item.currency.includes(txt);
            });
            setFiltered(filteredData)
        } else {
            let filteredData = withdraws.filter(function (item) {
                return item.currency.includes(txt);
            });
            setFiltered(filteredData)
        }
    }


    useEffect(() => {
        _getTransactionsHistory();
    }, [])


    return (
        <Layout nodrawer navigation={navigation}>
            <View style={{ flex: 1, zIndex: 1 }}>
                {
                    toastMessage === 'cannot_get_transactionhistory' ?
                        <Toast message={I18n.t('settingsScreen.loginActivity.toast', { locale: language })} type={"danger"} /> :
                        null
                }


                <ProfileCard />

                <Card profile>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Clock color={theme[mode].lightblue} />
                    </View>
                    <Text style={{ flex: 3, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('transaction.title', { locale: language })}</Text>
                    <View style={{ flexDirection: 'row', flex: 4, justifyContent: "space-around" }}>

                        <Pressable style={{ padding: 5 }} onPress={() => setSort("deposits")}>
                            <Text style={[styles.sortDefault, sort === "deposits" && styles.sortActive]}>{I18n.t('transaction.deposit', { locale: language })}</Text>
                        </Pressable>

                        <Pressable style={{ padding: 5 }} onPress={() => setSort("withdraws")}>
                            <Text style={[styles.sortDefault, sort === "withdraws" && styles.sortActive]}>{I18n.t('transaction.withdraw', { locale: language })}</Text>
                        </Pressable>
                    </View>
                </Card>

                <Search callback={(text) => _searchInTransaction(text)} />

                <View style={{ flex: 1, justifyContent: "center" }}>
                    {
                        isProcessing ? <ActivityIndicator size="small" color={theme[mode].darkIndicatorColor} /> :
                            sort === "deposits"
                                ? (deposits.length > 0 ? <TableTransaction data={filtered && filtered.length > 0 ? filtered : deposits} /> : (
                                    <View style={{ padding: 10, height: 200, justifyContent: "center", alignItems: "center", opacity: 0.5 }}>
                                        <Nodata width={70} />
                                        <Text style={{ color: theme[mode].tabbuttonpassive }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
                                    </View>
                                ))
                                : (withdraws.length > 0 ? <TableTransaction data={filtered && filtered.length > 0 ? filtered : withdraws} /> : (
                                    <View style={{ padding: 10, height: 200, justifyContent: "center", alignItems: "center", opacity: 0.5 }}>
                                        <Nodata width={70} />
                                        <Text style={{ color: theme[mode].tabbuttonpassive }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
                                    </View>
                                ))

                    }
                </View>


                {/* <Modal
                isVisible={isModalVisible}
                backdropOpacity={0.20}
                hasBackdrop={true}
                useNativeDriver={true}
                style={{ alignItems: 'center', margin: 0, marginHorizontal: 10 }}
            >
                <ChildModal mode={mode} callback={() => setIsModalVisible(false)} />
            </Modal> */}
            </View>
        </Layout>
    )
}




export default TransactionHistoryScreen

/*
const ChildModal = ({ mode, callback, setCurrency }) => {
    const styles = setStyle(mode);

    return (
        <View style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: 420,
            backgroundColor: theme[mode].modalbgcolor,
            ...theme.shadow,
            padding: 10,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            borderWidth: 0.5,
            borderColor: theme[mode].inputbordercolor,
            flex: 1
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 10,
                borderBottomWidth: 0.3,
                borderColor: theme[mode].searchInputBorderColor,
                marginBottom: 5,
            }}>
                <Text style={styles.header}>Yatırma / Çekme Ayrıntıları</Text>
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

            <View style={{ alignItems: 'center', marginVertical: 30 }}>
                <Text style={styles.text}>Miktar</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.amount}>6327.0087</Text>
                    <Text style={styles.curr}>BTC</Text>
                </View>
                <Text style={styles.result}>tamamlandı</Text>
            </View>

            <View style={{ backgroundColor: theme[mode].cardinputdirty, paddingVertical: 15, paddingHorizontal: 5, borderRadius: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
                    <Text style={styles.textTitle}>Adres</Text>
                    <Text style={styles.text}>AVU35sdfstY345Bdfhz67NHFsdg567FGLUIYB31</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
                    <Text style={styles.textTitle}>TxID</Text>
                    <Text style={styles.text}>bffff265jsdfkfsdsvsdslkmvdfg345254klsm45dfh</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={styles.textTitle}>Tarih</Text>
                    <Text style={styles.text}>2021-02-19 13:08:10</Text>
                </View>
            </View>

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button btnPrimary btnLg title="TxID Kopyala" />
            </View>
        </View>
    )
}
*/


const setStyle = mode => ({
    header: {
        fontSize: 11,
        color: theme[mode].lightblue,
    },
    text: {
        fontSize: 12,
        color: theme[mode].textblack,
    },
    textTitle: {
        fontSize: 12,
        color: theme[mode].buttontextgray
    },

    amount: {
        fontSize: 24,
        fontWeight: '700',
        color: theme[mode].lightblue,
        marginRight: 5
    },
    curr: {
        fontSize: 14,
        fontWeight: '700',
        color: theme[mode].lightblue
    },
    result: {
        fontSize: 14,
        color: theme[mode].green
    },

    sortDefault: {
        color: theme[mode].textDimColor,
        fontSize: 12,
        fontWeight: "700"
    },

    sortActive: {
        color: theme[mode].lightblue
    },
})