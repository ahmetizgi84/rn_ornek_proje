import React, { useContext } from 'react'
import { View, Text, ScrollView } from 'react-native'
import I18n from '../../lang/_i18n'

import Card from '../../components/Card'
import { Settings, Tl, Upload, Download } from '../../components/svg';
import HeaderLogin from '../../components/HeaderLogin';

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/Button';

const FinanceScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);

    const listHeader = () => {
        return (
            <View style={styles.thead}>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.market', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.trans', { locale: language })}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.price', { locale: language })} {'(BTC)'}</Text>
                <Text style={styles.theadText}>{I18n.t('ordersScreen.table.profit', { locale: language })} {'(BTC)'}</Text>
            </View>
        )
    }

    const listEmpty = () => {
        return (
            <View style={styles.nodata}>
                <Text>Kayıt Yok</Text>
            </View>
        )
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme[mode].bg,
        }}>
            <HeaderLogin settings navigation={navigation} />

            <Card profile>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Settings color={theme[mode].lightblue} />
                </View>
                <Text style={{ flex: 5, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('settingsScreen.finance', { locale: language })}</Text>
                <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
            </Card>

            <ScrollView style={{ marginBottom: 10 }}>
                <View style={{ paddingBottom: 10 }}>

                    <Card>
                        <View style={styles.border}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>{I18n.t('finance.amount', { locale: language })}</Text>
                                <Button title="1 yıl" btnSm btnDefault btnBordered />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                <View style={styles.cardBottom}>
                                    <Text style={[styles.cardMoneyDefault, styles.blue, { marginRight: 5 }]}>40.499</Text>
                                    <Tl width={10} color={theme[mode].lightblue} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 14, fontWeight: '500', marginRight: 5 }}>3.500</Text>
                                    <Upload width={12} color={theme[mode].green} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.border}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>{I18n.t('finance.value', { locale: language })}</Text>
                                <Button title="1 yıl" btnSm btnDefault btnBordered />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                <View style={styles.cardBottom}>
                                    <Text style={[styles.cardMoneyDefault, { marginRight: 5 }]}>40.499</Text>
                                    <Tl width={10} color={theme[mode].textblack} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 14, fontWeight: '500', marginRight: 5 }}>3.500</Text>
                                    <Download width={12} color={theme[mode].red} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.border}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>{I18n.t('finance.loss', { locale: language })}</Text>
                                <Button title="1 yıl" btnSm btnDefault btnBordered />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                <View style={styles.cardBottom}>
                                    <Text style={[styles.cardMoneyDefault, styles.red, { marginRight: 5 }]}>40.499</Text>
                                    <Tl width={10} color={theme[mode].red} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                    <Text style={{ color: theme[mode].textblack, fontSize: 14, fontWeight: '500', marginRight: 5 }}>3.500</Text>
                                    <Upload width={12} color={theme[mode].green} />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.border, { marginBottom: 0 }]}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>{I18n.t('finance.profit', { locale: language })}</Text>
                                <Button title="1 yıl" btnSm btnDefault btnBordered />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                <View style={styles.cardBottom}>
                                    <Text style={[styles.cardMoneyDefault, styles.green, { marginRight: 5 }]}>40.499</Text>
                                    <Tl width={10} color={theme[mode].green} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                    <Text style={{ color: theme[mode].lightblue, fontSize: 14, fontWeight: '500', marginRight: 5 }}>202.00 CDN</Text>
                                    <Upload width={12} color={theme[mode].green} />
                                </View>
                            </View>
                        </View>
                    </Card>

                    <Card>
                        <Text style={[styles.cardTitle, { marginBottom: 10 }]}>{I18n.t('finance.max', { locale: language })}</Text>
                        {listHeader()}

                        {
                            data.map((item) => (
                                <View key={item.id} style={styles.row}>
                                    <Text style={styles.itemText}>{item.market}</Text>
                                    <Text style={styles.itemText}>{item.transaction}</Text>
                                    <Text style={styles.itemText}>{item.price}</Text>
                                    <Text style={styles.itemText}>{item.profit}</Text>
                                </View>
                            ))
                        }
                    </Card>

                    <Card>
                        <Text style={[styles.cardTitle, { marginBottom: 10 }]}>{I18n.t('finance.min', { locale: language })}</Text>
                        {listHeader()}
                        {
                            data.map((item) => (
                                <View key={item.id} style={styles.row}>
                                    <Text style={styles.itemText}>{item.market}</Text>
                                    <Text style={styles.itemText}>{item.transaction}</Text>
                                    <Text style={styles.itemText}>{item.price}</Text>
                                    <Text style={styles.itemText}>{item.profit}</Text>
                                </View>
                            ))
                        }
                    </Card>

                </View>
            </ScrollView>

        </View>
    )
}

export default FinanceScreen


const setStyle = mode => ({
    cardTitle: {
        fontWeight: '500',
        color: theme[mode].textblack,
    },

    cardMoneyDefault: {
        fontWeight: '500',
        color: theme[mode].textblack,
        fontSize: 24
    },

    blue: {
        color: theme[mode].lightblue,
    },
    red: {
        color: theme[mode].red,
    },
    green: {
        color: theme[mode].green,
    },

    inputContainer: {
        height: 50,
        backgroundColor: theme[mode].cardbg,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 5
    },

    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10

    },
    cardBottom: {
        flexDirection: "row",
        alignItems: "center",
    },

    border: {
        borderBottomWidth: 0.5,
        borderColor: theme[mode].inputbordercolor,
        paddingBottom: 10,
        marginBottom: 10
    },


    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderTopWidth: 0.5,
        borderColor: theme[mode].inputbordercolor,
    },

    thead: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },

    theadText: {
        fontSize: 12,
        color: theme[mode].theadgray,
        width: 75,
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

});

const data = [
    {
        id: 1,
        market: "BTCTRY",
        transaction: "Satış",
        price: "413.437,00",
        profit: "0.0420034"
    },
    {
        id: 2,
        market: "BTCTRY",
        transaction: "Alış",
        price: "413.456,00",
        profit: "0.0420034"
    },
    {
        id: 3,
        market: "BTCTRY",
        transaction: "Alış",
        price: "413.437,00",
        profit: "0.0420034"
    },
    {
        id: 4,
        market: "BTCTRY",
        transaction: "Satış",
        price: "413.137,00",
        profit: "0.0420034"
    },
    {
        id: 5,
        market: "BTCTRY",
        transaction: "Satış",
        price: "413.997,00",
        profit: "0.0420034"
    },
]