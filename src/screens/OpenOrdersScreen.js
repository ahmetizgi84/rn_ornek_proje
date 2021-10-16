import React, { useContext, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import I18n from '../lang/_i18n'
import { useFocusEffect } from "@react-navigation/native";

import Layout from '../components/Layout';
import Card from '../components/Card'
import Table from '../components/Table';
import Search from '../components/Search';
import { Orders, Nodata } from '../components/svg'

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { DataContext } from '../context/DataContext';
import Toast from '../components/Toast';
import ProfileCard from '../components/ProfileCard';

const OpenOrdersScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);
    const { orders, toastMessage, filtered, _getTotalList, _getBuyList, _getSellList, _getOrders, _searchOnOpenOrders } = useContext(DataContext)

    const [sort, setSort] = useState("all")

    const getOrderList = (sort) => {
        if (sort === "all") {
            _getTotalList()
        } else if (sort === "buy") {
            _getBuyList();
        } else if (sort === "sell") {
            _getSellList();
        }
        setSort(sort)
    }

    const searchInTable = (text) => {
        _searchOnOpenOrders(text)
    }


    useFocusEffect(
        React.useCallback(() => {
            _getOrders();
        }, [])
    );



    return (
        <Layout>
            <View style={{ flex: 1, zIndex: 1 }}>
                {
                    toastMessage ? (toastMessage === 'cancel_order_success' ? <Toast message={I18n.t('ordersScreen.toast.success', { locale: language })} type={"success"} /> :
                        toastMessage === 'cancel_order_failed' ? <Toast message={I18n.t('ordersScreen.toast.danger', { locale: language })} type={"danger"} /> :
                            toastMessage === 'cancel_order_session_error' ? <Toast message={I18n.t('ordersScreen.toast.session', { locale: language })} type={"danger"} /> :
                                <Toast message={I18n.t('ordersScreen.toast.error', { locale: language })} type={"danger"} />) : (null)
                }

                <ProfileCard />

                <Card profile>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Orders color={theme[mode].lightblue} />
                    </View>
                    <Text style={{ flex: 3, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('ordersScreen.openOrders', { locale: language })}</Text>
                    <View style={{ flexDirection: 'row', flex: 4, justifyContent: "space-around" }}>
                        <Pressable onPress={() => getOrderList("all")}>
                            <Text style={[styles.sortDefault, sort === "all" && styles.sortActive]}>{I18n.t('ordersScreen.all', { locale: language })}</Text>
                        </Pressable>

                        <Pressable onPress={() => getOrderList("buy")}>
                            <Text style={[styles.sortDefault, sort === "buy" && styles.sortActive]}>{I18n.t('ordersScreen.buy', { locale: language })}</Text>
                        </Pressable>

                        <Pressable onPress={() => getOrderList("sell")}>
                            <Text style={[styles.sortDefault, sort === "sell" && styles.sortActive]}>{I18n.t('ordersScreen.sell', { locale: language })}</Text>
                        </Pressable>
                    </View>
                </Card>

                <Search callback={(text) => searchInTable(text)} />

                {
                    orders.length > 0 ? (

                        <Table data={filtered && filtered.length > 0 ? filtered : orders} />

                    ) : (
                        <View style={{ padding: 10, height: 200, justifyContent: "center", alignItems: "center", opacity: 0.5 }}>
                            <Nodata width={70} />
                            <Text style={{ color: theme[mode].tabbuttonpassive }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
                        </View>
                    )
                }

            </View>
        </Layout>
    );
};

export default OpenOrdersScreen;


const setStyle = mode => ({

    sortDefault: {
        color: theme[mode].textDimColor,
        fontSize: 12,
        fontWeight: "700"
    },

    sortActive: {
        color: theme[mode].lightblue
    },

})