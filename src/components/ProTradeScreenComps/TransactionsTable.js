
import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import I18n from '../../lang/_i18n'

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';

function TransactionsTable({ transactions }) {
    const { state: { mode, language } } = useContext(ThemeContext);

    const handleTime = (time) => {
        if (String(time).match(/[a-zA-Z]/i)) {
            var ds = time.toString();
            var tar = ds.replace('T', ' ')
            var tarih = tar.replace('+02:00', '')
        } else {
            var date = new Date((time + 10800) * 1000);
            var iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
            tarih = iso[1] + ' ' + iso[2];
        }
        return tarih
    }

    const currencyFormat = (numStr) => {
        var formatter = new Intl.NumberFormat('en-US' ).format(numStr);

      
        return formatter;
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{ flex: 1, flexDirection: "row", height: 32, padding: 5 }}>
                <Text style={[item.taker_type === 'buy' ? { color: theme[mode].green } : { color: theme[mode].red }, { fontSize: 12, flex: 2 }]}>{handleTime(item.created_at)}</Text>
                <Text style={[item.taker_type === 'buy' ? { color: theme[mode].green } : { color: theme[mode].red }, { fontSize: 12, flex: 1 }]}>{currencyFormat(item.amount)}</Text>
                <Text style={[item.taker_type === 'buy' ? { color: theme[mode].green } : { color: theme[mode].red }, { fontSize: 12, flex: 1 }]}>{currencyFormat(item.price)}</Text>
            </View>
        )
    }

    return (
        <View >
            <View style={{ flexDirection: "row", padding: 5, backgroundColor: theme[mode].bg, marginVertical: 5 }}>
                <Text style={[{ color: theme[mode].theadgray }, { flex: 2 }]}>{I18n.t('protrade.transactionsTable.date', { locale: language })}</Text>
                <Text style={[{ color: theme[mode].theadgray }, { flex: 1 }]}>{I18n.t('protrade.transactionsTable.amount', { locale: language })}</Text>
                <Text style={[{ color: theme[mode].theadgray }, { flex: 1 }]}>{I18n.t('protrade.transactionsTable.price', { locale: language })}</Text>
            </View>

            {
                transactions.length > 0 &&
                <FlatList
                    contentContainerStyle={{ flex: 1, flexDirection: "column" }}
                    horizontal={true}
                    scrollEnabled={false}
                    windowSize={5}
                    initialListSize={20}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    data={transactions.slice(0, 20)}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                />
            }

        </View>
    )
}

export default TransactionsTable