import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import I18n from '../../lang/_i18n'

import Card from '../Card'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { Context as ProTradeContext } from '../../context/ProTradeContext';


function OrderBook({ secilenMarket }) {
    const { state: { asks, bids } } = useContext(ProTradeContext)
    const { state: { mode, language } } = useContext(ThemeContext);

    const _yuzde = (deger) => {
        const data = deger.map(d => d.amount);
        let maxVal = Math.max(...data)
        const newArray = []
        deger.map((b, index) => {
            let yuzde = ((b.amount * 100) / maxVal).toFixed(2)
            newArray[index] = {
                'price': b.price,
                'amount': b.amount,
                'yuzde': yuzde
            }
        })
        return newArray
    }

    const currencyFormat = (numStr) => {
        var formatter = new Intl.NumberFormat('en-US', { minimumSignificantDigits: 4, maximumSignificantDigits: 8 }).format(numStr);
        
        return formatter;
    }

    const renderBidsItem = ({ item }) => {
        let deger = item.yuzde + '%'  
         
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", height: 22, alignItems: "center" }}>
                <View style={{ alignItems: "flex-end", width: deger, backgroundColor: theme[mode].inpbgc, position: "absolute", top: 0, right: 0, bottom: 0 }} />
                <Text style={{ color: theme[mode].green, fontSize: 12 }}>{currencyFormat(item.price)}</Text>
          
                <Text style={{ color: theme[mode].chartTextBlack, fontSize: 12 }}>{currencyFormat(item.amount)}</Text>
            </View>


        )
    }

    const renderAsksItem = ({ item }) => {
        let deger = item.yuzde + '%'
    
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", height: 22, alignItems: "center" }}>
                <View style={{ alignItems: "flex-end", width: deger, backgroundColor: theme[mode].redbgc, position: "absolute", top: 0, left: 0, bottom: 0 }} />
                <Text style={{ color: theme[mode].red, fontSize: 12 }}>{currencyFormat(item.price)}</Text>
                <Text style={{ color: theme[mode].chartTextBlack, fontSize: 12 }}>{currencyFormat(item.amount)}</Text>
            </View>
        )
    }


    return (
        <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", marginBottom: 5 }}>
                        <Text style={{ fontSize: 10, color: theme[mode].chartTextBlack, }}>{I18n.t('protrade.orderbook.buylist', { locale: language })}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 5 }}>
                        <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('protrade.orderbook.price', { locale: language })} (TRY)</Text>
                        <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('protrade.orderbook.amount', { locale: language })} ({secilenMarket?.subtitle.toUpperCase()})</Text>
                    </View>

                    <FlatList
                        contentContainerStyle={{ flex: 1, flexDirection: "column" }}
                        horizontal={true}
                        scrollEnabled={false}
                        style={{ height: 330 }}
                        windowSize={5}
                        initialListSize={15}
                        initialNumToRender={15}
                        maxToRenderPerBatch={15}
                        data={_yuzde(bids)}
                        keyExtractor={(item, index) => index}
                        renderItem={renderBidsItem}
                    />

                </View>

                <View style={{ flex: 1, paddingRight: 10 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", marginBottom: 5 }}>
                        <Text style={{ fontSize: 10, color: theme[mode].chartTextBlack, }}>{I18n.t('protrade.orderbook.selllist', { locale: language })}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 5 }}>
                        <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('protrade.orderbook.price', { locale: language })} (TRY)</Text>
                        <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('protrade.orderbook.amount', { locale: language })} ({secilenMarket?.subtitle.toUpperCase()})</Text>
                    </View>

                    <FlatList
                        contentContainerStyle={{ flex: 1, flexDirection: "column" }}
                        horizontal={true}
                        scrollEnabled={false}
                        style={{ height: 330 }}
                        windowSize={5}
                        initialListSize={15}
                        initialNumToRender={15}
                        maxToRenderPerBatch={15}
                        //data={asks}
                        data={_yuzde(asks)}
                        keyExtractor={(item, index) => index}
                        renderItem={renderAsksItem}
                    />

                </View>
            </View>

        </Card>
    )
}

export default OrderBook