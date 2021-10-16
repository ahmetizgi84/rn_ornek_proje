import React, { useContext } from 'react'
import { Text, View, FlatList, ActivityIndicator } from 'react-native'
import I18n from '../lang/_i18n'

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { DataContext } from '../context/DataContext';




const TableTrade = ({ data, text }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { loading, _loadMoreTradeHistory } = useContext(DataContext)

    const styles = setStyle(mode);

    const handleDatePicked = (date) => {
        var ds = date.toString();
        var tar = ds.substr(0, 10);
        var splitted = tar.split("-")
        var newFormat = splitted[2] + "/" + splitted[1] + "/" + splitted[0]
        return newFormat
    };



    const renderItem = ({ item }) => (
        <View style={styles.row}>
            {/* <Text style={styles.itemText}>{item.id}</Text> */}
            <Text style={[styles.itemText, { fontSize: 9 }]}>{handleDatePicked(item.created_at)}</Text>
            <Text style={[styles.itemText, item.side === 'buy' ? styles.green : styles.red]}>{item.side === 'buy' ? I18n.t('ordersScreen.buy', { locale: language }) : I18n.t('ordersScreen.sell', { locale: language })}</Text>
            <Text style={styles.itemText}>{item.market.toUpperCase()}</Text>
            <Text style={styles.itemText}>{item.price}</Text>
            <Text style={styles.itemText}>{item.amount}</Text>
            <Text style={styles.itemText}>{item.total}</Text>
        </View>
    );


    const listHeader = () => {
        return (
            <View style={styles.thead}>
                {/* <Text style={styles.theadText}>{'ID'}</Text> */}
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.date', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.trans', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.market', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.price', { locale: language })}{I18n.t('ordersScreen.table.btc', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.amount', { locale: language })}{I18n.t('ordersScreen.table.eth', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.total', { locale: language })}{I18n.t('ordersScreen.table.btc', { locale: language })}</Text>
            </View>
        )
    }

    const listEmpty = () => {
        return (
            <View style={styles.nodata}>
                <Text style={{ color: theme[mode].textblack }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
            </View>
        )
    }

    const listFooter = () => {
        return (
            <View style={{ alignItems: "center" }}>
                <ActivityIndicator size="small" color={theme[mode].textblack} />
            </View>
        )
    }

    return (
        <View style={styles.tableContainer}>
            {
                text.length > 0 ? (
                    <FlatList
                        style={{ flex: 1 }}
                        ListHeaderComponent={listHeader}
                        data={data}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={renderItem}
                        ListEmptyComponent={listEmpty}
                        initialNumToRender={8}
                        maxToRenderPerBatch={8}
                        //ListFooterComponent={loading ? listFooter : null}
                        onEndReachedThreshold={0.01}
                        onEndReached={loading ? _loadMoreTradeHistory : null}
                    />
                ) : (
                    <FlatList
                        style={{ flex: 1 }}
                        ListHeaderComponent={listHeader}
                        data={data}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={renderItem}
                        ListEmptyComponent={listEmpty}
                        initialNumToRender={8}
                        maxToRenderPerBatch={8}
                        ListFooterComponent={loading ? listFooter : null}
                        onEndReachedThreshold={0.01}
                        onEndReached={loading ? _loadMoreTradeHistory : null}
                    />
                )
            }
        </View>
    )
}

export default TableTrade




const setStyle = mode => ({
    tableContainer: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10,
    },

    thead: {
        flexDirection: "row",
        marginBottom: 5,
        paddingHorizontal: 5
    },

    theadText: {
        fontSize: 10,
        color: theme[mode].theadgray,
        flex: 1
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
    itemText: {
        fontSize: 10,
        color: theme[mode].textblack,
        flex: 1
    },

    nodata: {
        paddingHorizontal: 5,
        paddingVertical: 12,
        alignItems: "center"
    },

    green: {
        color: theme[mode].green
    },

    red: {
        color: theme[mode].red
    }

})


