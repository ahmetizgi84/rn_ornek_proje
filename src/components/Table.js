import React, { useContext } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import I18n from '../lang/_i18n'

import { X } from './svg';

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { DataContext } from '../context/DataContext';

const Table = ({ data }) => {
    const { state: { mode } } = useContext(ThemeContext);
    const { _cancelOrder } = useContext(DataContext)
    const styles = setStyle(mode);

    const renderItem = ({ item }) => {
        return (
            <TableRows item={item} _cancelOrder={_cancelOrder} />
        )
    };

    const listEmpty = () => {
        return (
            <View style={styles.nodata}>
                <Text style={{ color: theme[mode].buttontextgray, fontSize: 12 }}>Kayıt Yok</Text>
            </View>
        )
    }

    const listHeaderComponent = () => {
        return (
            <View>
                <Text style={{ color: theme[mode].textblack, fontSize: 16, fontWeight: '700', marginBottom: 10 }}>Açık Emirler</Text>
                <View style={{ borderBottomWidth: 1, borderColor: theme[mode].inputbordercolor, marginBottom: 10 }} />
            </View>
        )
    }

    return (
        <View style={styles.tableContainer}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={listEmpty}
                ListHeaderComponent={listHeaderComponent}
            />
        </View>
    )
}

export default Table


const CancelButton = ({ callback }) => {
    const { state: { mode } } = useContext(ThemeContext);
    return (
        <TouchableOpacity
            onPress={callback}
            style={{
                flexDirection: "row",
                alignItems: 'center',
                backgroundColor: theme[mode].cancelBtnbgcolor,
                borderRadius: 4,
                paddingHorizontal: 10,
                borderWidth: 0.5,
                borderColor: theme[mode].searchInputBorderColor
            }}>
            <X width={12} color={theme[mode].textblack} />
            <Text style={{ fontSize: 10, color: theme[mode].textblack, marginLeft: 5 }}>İptal et</Text>
        </TouchableOpacity>
    )
}



export class TableRows extends React.PureComponent {
    static contextType = ThemeContext;

    handleTime = (time) => {
        var ds = time.toString();
        var tar = ds.replace('T', ' ')
        var tarih = tar.replace('+02:00', '')
        return tarih
    }

    render() {
        const { state: { mode, language } } = this.context;
        const { item, _cancelOrder } = this.props
        const price_precision = item.price_precision ? item.price_precision : 2;
        return (
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
                        <CancelButton callback={() => _cancelOrder(item.uuid)} />
                    </View>
                </View>

                <View style={{ borderBottomWidth: 1, borderColor: theme[mode].inputbordercolor }} />
            </View>
        )
    }
}



const setStyle = mode => ({
    tableContainer: {
        padding: 10,
        backgroundColor: theme[mode].white,
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 8,
    },

    thead: {
        flexDirection: "row",
        marginBottom: 5,
        paddingHorizontal: 5
    },

    theadText: {
        fontSize: 12,
        color: theme[mode].theadgray,
        width: 75,
    },

    row: {
        paddingHorizontal: 5,
        paddingVertical: 12,
        backgroundColor: theme[mode].white,
        marginBottom: 5,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center"
    },

    nodata: {
        paddingHorizontal: 5,
        paddingVertical: 12,
    },

    itemText: {
        fontSize: 12,
        color: theme[mode].textblack,
        width: 75,
    },

})


