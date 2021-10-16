import React, { useContext } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import I18n from '../lang/_i18n'

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { DataContext } from '../context/DataContext';

const TableTransaction = ({ data, openTransactionDetailModal }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { loading, _loadMoreTransactionHistory } = useContext(DataContext)

    const styles = setStyle(mode);

    const handleDatePicked = (date) => {
        if (!date)
            return I18n.t(`account.other`, { locale: language })
        var ds = date.toString();
        var tar = ds.substr(0, 10);
        var splitted = tar.split("-")
        var newFormat = splitted[2] + "/" + splitted[1] + "/" + splitted[0]
        return newFormat
    };

    const onPressHandler = (txId) => {
        console.log(txId)
        //openTransactionDetailModal(txId)
    }

    const getStatus = (state) => {
        return I18n.t(`transaction.deposite_state.${state}`, { locale: language })
    }

    const getStatusColor = (state) => {
        let renk = 'red'
        switch (state) {
            case 'accepted':
                renk = theme[mode].green
                break;
            case 'collected':
                renk = theme[mode].green
                break;
            case 'succeed':
                renk = theme[mode].green
                break;
            case 'processing':
                renk = 'orange'
                break;
            default:
                renk = theme[mode].red
                break;
        }
        return renk
    }

    const renderItem = ({ item }) => {
        //let this_state = `transaction.deposite_status.${item.state}`
        //console.log(item)
        return (
            <View style={styles.row} onPress={() => onPressHandler(item.txid)}>
                <Text style={[styles.itemText, { fontSize: 9 }]}>{handleDatePicked(item.completed_at)}</Text>
                <Text style={styles.itemText}>{item.currency.toUpperCase()}</Text>
                <Text style={styles.itemText}>{item.amount}</Text>
                <Text style={{ fontSize: 10, flex: 1, color: getStatusColor(item.state) }}>{getStatus(item.state)}</Text>
            </View>
        )
    };


    const listHeader = () => {
        return (
            <View style={styles.thead}>
                {/* <Text style={styles.theadText}>{'ID'}</Text> */}
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.date', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.market', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.amount', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.state', { locale: language })}</Text>
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
                data.length > 0 ? (
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
                    //onEndReached={loading ? _loadMoreTransactionHistory : null}
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
                    //onEndReached={loading ? _loadMoreTransactionHistory : null}
                    />
                )
            }
        </View>
    )
}

export default TableTransaction




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


