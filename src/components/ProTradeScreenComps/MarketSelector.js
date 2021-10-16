import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import I18n from '../../lang/_i18n'

import Card from '../Card'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { SocketContext } from '../../context/SocketContext'

const MarketSelector = ({ relatedMarket }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { marketList } = useContext(SocketContext)
    let durum = 'textblack'


    const customFilter = () => {
        const filtered = marketList.filter(item => item.id == relatedMarket.id)
        return filtered[0]
    }

    const getColor = (percentage, type) => {
        if (type == 'c') {
            durum = percentage.charAt(0)
            return durum == '+' ? theme[mode].green : theme[mode].red
        } else {
            durum = percentage.charAt(0)
            return durum == '+' ? theme[mode].inpbgc : theme[mode].redbgc

        }
    }
    const currencyFormat = (numStr) => {
        var price_precision = relatedMarket.price_precision === 0 ? 8 : relatedMarket.price_precision
        var formatter = new Intl.NumberFormat('en-US', { minimumSignificantDigits: relatedMarket.price_precision === 0 ? 3 : relatedMarket.price_precision, maximumSignificantDigits: 8 }).format(numStr);
        if (parseInt(formatter) < 1)
            formatter = parseFloat(formatter).toFixed(price_precision)

        return formatter;
    }
    let precision = customFilter().price_precision
    let last = customFilter().last
    let fixedLast = currencyFormat(parseFloat(last).toFixed(precision))

    return (
        <Card>
            <View style={{ flexDirection: 'row', justifyContent: "space-between"  }}>

                <View style={{ flex: 1,  justifyContent: "space-between" }}>
                    <Text style={{ color: theme[mode].textblack, fontSize: 20, fontWeight: '700' }}>{relatedMarket.id.toUpperCase()}</Text>

                         <Text style={{ color: getColor(customFilter().percentage, 'c'), fontSize: 20, fontWeight: '500'  }}>{fixedLast}</Text>
                         
                    <View style={{width: 100,backgroundColor: getColor(customFilter().percentage, 'b'), padding: 3, borderRadius: 4, alignItems: 'center' }}>
                        <Text style={{ color: getColor(customFilter().percentage, 'c'), fontSize: 12 }}>{customFilter().percentage}</Text>
                    </View>
                </View>

                <View style={{ flex: 1,justifyContent: "space-between" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ color: theme[mode].chartTextBlack, fontSize: 12, flex: 2.4 }}>{I18n.t('protrade.marketSelector.vol', { locale: language })}</Text>
                        <Text style={{ color: getColor(customFilter().percentage, 'c'), fontSize: 12, flex: 3 }}>{parseInt(customFilter().volume, 10)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: theme[mode].chartTextBlack, fontSize: 12, flex: 2.4 }}>{I18n.t('protrade.marketSelector.high', { locale: language })}</Text>
                        <Text style={{ color: getColor(customFilter().percentage, 'c'), fontSize: 12, flex: 3 }}>{customFilter().high}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: theme[mode].chartTextBlack, fontSize: 12, flex: 2.4 }}>{I18n.t('protrade.marketSelector.low', { locale: language })}</Text>
                        <Text style={{ color: getColor(customFilter().percentage, 'c'), fontSize: 12, flex: 3 }}>{customFilter().low}</Text>
                    </View>
                </View>

            </View>
        </Card>
    )
}

export default MarketSelector