import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import I18n from '../../lang/_i18n'

import Card from '../Card'
import { X, Nodata } from '../svg'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { DataContext } from '../../context/DataContext';



function OpenOrders({ currentMarket }) {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { orders, _getOrders, _cancelOrder } = useContext(DataContext)
    const [filtered, setFiltered] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            _getOrders();
        }, [])
    );

    useEffect(() => {
        const filtered = orders.filter(order => order.market === currentMarket)
        setFiltered(filtered)
    }, [orders])

    return (
        <Card>
            <View style={{
                minHeight: 240
            }}>
                <View>
                    <Text style={{ color: theme[mode].textblack, fontSize: 16, fontWeight: '700', marginBottom: 10 }}>{I18n.t('ordersScreen.openOrders', { locale: language })}</Text>
                    <View style={{ borderBottomWidth: 1, borderColor: theme[mode].inputbordercolor, marginBottom: 10 }} />
                </View>

                {
                    filtered?.length > 0 ?
                        filtered.map(row => (
                            <TableRows key={row.id} item={row} cancelOrder={_cancelOrder} currentMarket={currentMarket} />
                        ))
                        : (
                            <View style={{ padding: 10, height: 100, justifyContent: "center", alignItems: "center", opacity: 0.5 }}>
                                <Nodata width={70} />
                                <Text style={{ color: theme[mode].tabbuttonpassive }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
                            </View>
                        )
                }
            </View>
        </Card>
    )
}

export default OpenOrders

export class TableRows extends React.PureComponent {
    static contextType = ThemeContext;

    handleTime = (time) => {
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
    render() {
        const { state: { mode, language } } = this.context;
        const { item, cancelOrder, currentMarket } = this.props
        const price_precision = item.price_precision ? item.price_precision : 2;
        return (
            item.market == currentMarket ? (
                <View style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={[{ width: 50 }, item.side === 'buy' ? { color: theme[mode].green } : { color: theme[mode].red }]}>{item.side === 'buy' ? I18n.t('ordersScreen.buy', { locale: language }) : I18n.t('ordersScreen.sell', { locale: language })}</Text>
                            <Text style={{ color: theme[mode].textblack }}>{item.name.toUpperCase()}</Text>
                        </View>
                        <Text style={{ color: theme[mode].textblack }}>{this.handleTime(item.created_at)}</Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: 'space-between', marginBottom: 10 }}>
                        <View>
                            <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('ordersScreen.table.amount', { locale: language })}</Text>
                            <Text style={{ color: theme[mode].textblack }}>{item.origin_volume}</Text>
                        </View>
                        <View>
                            <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('ordersScreen.table.price', { locale: language })}</Text>
                            <Text style={{ color: theme[mode].textblack }}>{item.price}</Text>
                        </View>
                        <View>
                            <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('ordersScreen.table.total', { locale: language })}</Text>
                            <Text style={{ color: theme[mode].textblack }}>{(item.price * item.origin_volume).toFixed(price_precision)}</Text>
                        </View>
                        <View>
                            <Text style={{ color: theme[mode].chartTextBlack, fontSize: 10 }}>{I18n.t('ordersScreen.table.success', { locale: language })}</Text>
                            <Text style={{ color: theme[mode].textblack }}>{item.executed_volume}</Text>
                        </View>
                        <View>
                            <CancelButton callback={() => cancelOrder(item.uuid)} />
                        </View>
                    </View>

                    <View style={{ borderBottomWidth: 1, borderColor: theme[mode].inputbordercolor }} />
                </View>
            )
                : (null)
        )
    }
}

export function CancelButton({ callback }) {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { cancelIsProcessing } = useContext(DataContext)

    return (
        <TouchableOpacity
            onPress={callback}
            style={{
                width: 72,
                flexDirection: "row",
                alignItems: 'center',
                justifyContent: "center",
                backgroundColor: theme[mode].cancelBtnbgcolor,
                borderRadius: 4,
                paddingHorizontal: 10,
                borderWidth: 0.5,
                borderColor: theme[mode].searchInputBorderColor
            }}>
            {
                cancelIsProcessing ? <ActivityIndicator size="small" color={theme[mode].darkIndicatorColor} /> :
                    <>
                        <X width={12} color={theme[mode].textblack} />
                        <Text style={{ fontSize: 10, color: theme[mode].textblack, marginLeft: 5 }}>{I18n.t('ordersScreen.table.cancel', { locale: language })}</Text>
                    </>
            }


        </TouchableOpacity>
    )
}

