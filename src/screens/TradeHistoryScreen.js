import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import I18n from '../lang/_i18n'

import Layout from '../components/Layout';
import Card from '../components/Card'
import { Past, Nodata } from '../components/svg';
import Toast from '../components/Toast';
//import DatPicker from '../components/DatPicker'
import Search from '../components/Search';
import TableTrade from '../components/TableTrade';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { DataContext } from '../context/DataContext';
import ProfileCard from '../components/ProfileCard';


const TradeHistoryScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { trades, isProcessing, toastMessage, _getTradeHistory } = useContext(DataContext)
    const styles = setStyle(mode);

    const [filtered, setFiltered] = useState([])
    const [text, setText] = useState("")

    /*
    const getOrderList = (sort) => {
        if (sort === "all") {
            //_getAllOrders();
        } else if (sort === "buy") {
            //_getBuyOrders();
        } else if (sort === "sell") {
            //_getSellOrders();
        }
    }
    */


    useEffect(() => {
        _getTradeHistory();
    }, [])

    const searchInTradeHistory = (searchText) => {
        setText(searchText)
        let txt = searchText.toLowerCase();
        let filteredData = trades.filter(function (item) {
            return item.market.toLowerCase().includes(txt);
        });
        setFiltered(filteredData)
    }

    /*
    const handleDatePicked = (date) => {
        var ds = date.toString();
        var tar = ds.substr(4, 11);
        var splitted = tar.split(" ")
        var month = months.find(m => m.name === splitted[0])
        var newFormat = splitted[1] + "/" + month['place'] + "/" + splitted[2]
        return newFormat
    };

    const setStartDate = (startDate) => {
        const beginning = handleDatePicked(startDate)
        console.log(beginning)
    }
    const setFinishDate = (finishDate) => {
        console.log("date: ", finishDate)
    }
    */

    return (
        <Layout nodrawer navigation={navigation}>

            <View style={{ flex: 1, zIndex: 1 }}>

                {
                    toastMessage === 'cannot_get_tradehistory' ?
                        <Toast message={I18n.t('settingsScreen.loginActivity.toast', { locale: language })} type={"danger"} /> :
                        null
                }

                <ProfileCard />

                <Card profile>

                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Past color={theme[mode].lightblue} />
                    </View>
                    <Text style={{ flex: 4, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('tradeHistory.title', { locale: language })}</Text>
                    <View style={{ flexDirection: 'row', flex: 4, justifyContent: "space-around" }}>


                        {/*        
                    TİCARET GEÇMİŞİ             
                    <Pressable onPress={() => getOrderList("buy")}>
                        <Text style={[styles.sortDefault, sort === "buy" && styles.sortActive]}>{I18n.t('tradeHistory.trade', { locale: language })}</Text>
                    </Pressable>

                    İÇ TRANSFER 
                    <Pressable onPress={() => getOrderList("sell")}>
                        <Text style={[styles.sortDefault, sort === "sell" && styles.sortActive]}>{I18n.t('tradeHistory.transfer', { locale: language })}</Text>
                    </Pressable> */}
                    </View>
                </Card>

                <Search callback={(text) => searchInTradeHistory(text)} />

                {/* TARİH ARALIĞI İLE ARAMA KAPATILDI */}
                {/* <DatPicker setDate={(d) => setStartDate(d)} />
            <DatPicker setDate={(d) => setFinishDate(d)} /> */}

                <View style={{ justifyContent: "center", flex: 1 }}>

                    {
                        isProcessing ? <ActivityIndicator size="small" color={theme[mode].darkIndicatorColor} /> :
                            trades.length > 0 ?
                                <TableTrade data={filtered && filtered.length > 0 ? filtered : trades} text={text} /> :
                                (
                                    <View style={{ padding: 10, height: 200, justifyContent: "center", alignItems: "center", opacity: 0.5 }}>
                                        <Nodata width={70} />
                                        <Text style={{ color: theme[mode].tabbuttonpassive }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
                                    </View>
                                )
                    }
                </View>

            </View>
        </Layout>
    )
}

export default TradeHistoryScreen


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
