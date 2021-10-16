import React, { useContext } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import I18n from '../lang/_i18n'
import DropDownPicker from 'react-native-dropdown-picker';

import Layout from '../components/Layout';
import Card from '../components/Card'
import { Support, Canlı, Sss, Ticket, Close, Tl, Akbank } from '../components/svg';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

const FAQ_EXTERNAL_LINK = 'https://support.ornekapp.com/hc/tr';
const SUPPORT_EXTERNAL_LINK = 'https://ornekapp.com/supportsignin';

const SupportCenterScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);

    const handleClick = () => {
        Linking.canOpenURL(FAQ_EXTERNAL_LINK).then((supported) => {
            if (supported) {
                Linking.openURL(FAQ_EXTERNAL_LINK);
            } else {
                console.log("Don't know how to open URI: " + FAQ_EXTERNAL_LINK);
            }
        });
    };

    const createTicket = () => {
        Linking.canOpenURL(SUPPORT_EXTERNAL_LINK).then((supported) => {
            if (supported) {
                Linking.openURL(SUPPORT_EXTERNAL_LINK);
            } else {
                console.log("Don't know how to open URI: " + SUPPORT_EXTERNAL_LINK);
            }
        });
    }



    const tableHeadComponent = () => {
        return (
            <View style={styles.theadVolume}>
                <Text style={[styles.tableVolumeTheadText, { flex: 45 }]}>{I18n.t('support.tableVolume.thead1', { locale: language })}</Text>
                <Text style={[styles.tableVolumeTheadText, { flex: 15 }]}>{I18n.t('support.tableVolume.thead4', { locale: language })}</Text>
                <Text style={[styles.tableVolumeTheadText, { flex: 20 }]}>{I18n.t('support.tableVolume.thead2', { locale: language })}</Text>
                <Text style={[styles.tableVolumeTheadText, { flex: 20 }]}>{I18n.t('support.tableVolume.thead3', { locale: language })}</Text>
            </View>
        )
    }


    // const renderItem = ({ item }) => {
    //     return (
    //         <View style={styles.tbodyVolume}>
    //             <Text style={[styles.tableVolumeTbodyText, { flex: 3.2 }]}>{item.volume}</Text>
    //             <Text style={[styles.tableVolumeTbodyText, { flex: 1.5 }]}>{item.seller}</Text>
    //             <Text style={[styles.tableVolumeTbodyText, { flex: 1 }]}>{item.buyer}</Text>
    //         </View>
    //     )
    // }



    return (
        <Layout nodrawer navigation={navigation}>
            <ScrollView keyboardShouldPersistTaps="handled">

                <Card profile>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Support color={theme[mode].lightblue} />
                    </View>
                    <Text style={{ flex: 4, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('support.title', { locale: language })}</Text>
                    <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
                </Card>

                {/* <Text style={styles.howCanWe}>{I18n.t('support.howCanWe', { locale: language })}</Text> */}

                {/* Sıkça Sorulan Sorular */}
                <Card>
                    <View style={{
                        backgroundColor: theme[mode].lightblueopacity,
                        width: 150,
                        height: 150,
                        borderRadius: 99,
                        alignSelf: "center",
                        marginVertical: 20
                    }}>
                        <Sss width={150} height={150} />
                    </View>

                    <TouchableOpacity onPress={handleClick}>
                        <Text style={{
                            color: theme[mode].lightblue,
                            fontSize: 18,
                            fontWeight: '700',
                            paddingLeft: 10,
                        }}>{I18n.t('support.faqShort', { locale: language })}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleClick}>
                        <Text style={{
                            color: theme[mode].darkblue,
                            fontSize: 18,
                            paddingLeft: 10,
                        }}>{I18n.t('support.faq', { locale: language })}
                        </Text>
                    </TouchableOpacity>

                </Card>

                {/* Canlı Chat */}
                {/* <Card>
                    <View style={{
                        backgroundColor: theme[mode].lightblueopacity,
                        width: 150,
                        height: 150,
                        borderRadius: 99,
                        alignSelf: "center",
                        marginVertical: 20
                    }}>
                        <Canlı width={150} height={150} />
                    </View>

                    <Text style={{
                        color: theme[mode].lightblue,
                        fontSize: 18,
                        fontWeight: '700',
                        paddingLeft: 10,
                    }}>{I18n.t('support.liveChat', { locale: language })}</Text>
                    <Text style={{
                        color: theme[mode].darkblue,
                        fontSize: 18,
                        paddingLeft: 10,
                    }}>{I18n.t('support.sendMessage', { locale: language })}</Text>
                </Card> */}

                {/* Bilet Oluştur */}
                <Card>
                    <View style={{
                        backgroundColor: theme[mode].lightblueopacity,
                        width: 150,
                        height: 150,
                        borderRadius: 99,
                        alignSelf: "center",
                        marginVertical: 20
                    }}>
                        <Ticket width={150} height={150} />
                    </View>

                    <TouchableOpacity onPress={createTicket}>
                        <Text style={{
                            color: theme[mode].lightblue,
                            fontSize: 18,
                            fontWeight: '700',
                            paddingLeft: 10,
                        }}>{I18n.t('support.ticket', { locale: language })}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={createTicket}>
                        <Text style={{
                            color: theme[mode].darkblue,
                            fontSize: 18,
                            paddingLeft: 10,
                        }}>{I18n.t('support.createTicket', { locale: language })}
                        </Text>
                    </TouchableOpacity>
                </Card>

                <Card>
                    <View>
                        <Text style={{
                            color: theme[mode].greetingColor,
                            fontSize: 18,
                            textAlign: "center"
                        }}>{I18n.t('support.commissionRates', { locale: language })}</Text>
                        <Text style={{
                            color: theme[mode].textblack,
                            fontSize: 10,
                            alignSelf: 'center',
                            textAlign: "center",
                            width: 240,
                            marginBottom: 15
                        }}>{I18n.t('support.commissionDesc', { locale: language })}</Text>

                        <Text style={{
                            color: theme[mode].textblack,
                            fontSize: 10,
                            textAlign: "center",
                            marginBottom: 5,
                        }}>{I18n.t('support.couples', { locale: language })}</Text>
                        <DropDownPicker
                            items={couples}
                            containerStyle={{
                                height: 45,
                                width: 190,
                                borderRadius: 8,
                                alignSelf: "center",
                                marginBottom: 20
                            }}
                            style={{
                                backgroundColor: theme[mode].white,
                                borderWidth: 1,
                                borderColor: theme[mode].searchInputBorderColor,
                            }}
                            showArrow={false}
                            arrowColor={theme[mode].inputIconColor}
                            itemStyle={{ justifyContent: 'flex-start' }}
                            labelStyle={{
                                fontSize: 14,
                                color: theme[mode].placeholderTextColor,
                            }}
                            activeLabelStyle={{ fontWeight: '700' }}
                            dropDownStyle={{
                                backgroundColor: theme[mode].bg,
                                borderWidth: 0,
                            }}
                            defaultValue={couples[0].value}
                        //onChangeItem={(item) => setValue(item.value)}
                        />

                        <Text style={{
                            color: theme[mode].textblack,
                            fontSize: 10,
                            textAlign: "center",
                            marginBottom: 5,
                        }}>{I18n.t('support.currency', { locale: language })}</Text>
                        <DropDownPicker
                            items={currency}
                            containerStyle={{
                                height: 45,
                                width: 190,
                                borderRadius: 8,
                                alignSelf: "center",
                                marginBottom: 20
                            }}
                            style={{
                                backgroundColor: theme[mode].white,
                                borderWidth: 1,
                                borderColor: theme[mode].searchInputBorderColor,
                            }}
                            showArrow={false}
                            arrowColor={theme[mode].inputIconColor}
                            itemStyle={{ justifyContent: 'flex-start' }}
                            labelStyle={{
                                fontSize: 14,
                                color: theme[mode].placeholderTextColor,
                            }}
                            activeLabelStyle={{ fontWeight: '700' }}
                            dropDownStyle={{
                                backgroundColor: theme[mode].bg,
                                borderWidth: 0,
                            }}
                            defaultValue={currency[0].value}
                        //onChangeItem={(item) => setValue(item.value)}
                        />

                        {
                            tableHeadComponent()
                        }

                        <View style={styles.tbodyVolume}>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 60 }]}>{tableVolume[0].volume}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[0].seller}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[0].buyer}</Text>
                        </View>
                        <View style={styles.tbodyVolume}>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 60 }]}>{tableVolume[1].volume}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[1].seller}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[1].buyer}</Text>
                        </View>
                        <View style={[styles.tbodyVolume]}>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 60 }]}>{tableVolume[2].volume}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[2].seller}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[2].buyer}</Text>
                        </View>
                        <View style={[styles.tbodyVolume]}>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 60 }]}>{tableVolume[3].volume}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[3].seller}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[3].buyer}</Text>
                        </View>
                        <View style={[styles.tbodyVolume, { marginBottom: 20 }]}>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 60 }]}>{tableVolume[4].volume}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[4].seller}</Text>
                            <Text style={[styles.tableVolumeTbodyText, { flex: 20 }]}>{tableVolume[4].buyer}</Text>
                        </View>


                        <Text style={{
                            color: theme[mode].greetingColor,
                            fontSize: 18,
                            textAlign: "center"
                        }}>{I18n.t('support.limits', { locale: language })}</Text>
                        <Text style={{
                            color: theme[mode].textblack,
                            fontSize: 10,
                            alignSelf: 'center',
                            textAlign: "center",
                            width: 240,
                            marginBottom: 15
                        }}>{I18n.t('support.limitsDesc', { locale: language })}</Text>

                        <ScrollView horizontal={true} style={{ marginBottom: 20 }}>
                            <View>
                                <View style={styles.limitsTableThead}>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 150 }]}>{I18n.t('support.limitsTable.thead1', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 110 }]}>{I18n.t('support.limitsTable.thead2', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 110 }]}>{I18n.t('support.limitsTable.thead3', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 110 }]}>{I18n.t('support.limitsTable.thead4', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 110 }]}>{I18n.t('support.limitsTable.thead5', { locale: language })}</Text>
                                </View>

                                <View style={[styles.limitsTableThead, { marginVertical: 3 }]}>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 150 }]}></Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.push', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.pull', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.push', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.pull', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.push', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.pull', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.push', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.pull', { locale: language })}</Text>
                                </View>

                                <View style={[styles.limitsTableTbody]}>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 150 }]}>TRY Günlük</Text>
                                    <View style={{ width: 55, alignItems: 'center' }}>
                                        <Close width={20} height={20} color={theme[mode].inputIconColor} />
                                    </View>
                                    <View style={{ width: 55, alignItems: 'center' }}>
                                        <Close width={20} height={20} color={theme[mode].inputIconColor} />
                                    </View>
                                    <View style={{ width: 55, alignItems: 'center' }}>
                                        <Close width={20} height={20} color={theme[mode].inputIconColor} />
                                    </View>
                                    <View style={{ width: 55, alignItems: 'center' }}>
                                        <Close width={20} height={20} color={theme[mode].inputIconColor} />
                                    </View>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.unlimited', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>500.000</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>{I18n.t('support.limitsTable.unlimited', { locale: language })}</Text>
                                    <Text style={[styles.tableLimitsTbodyText, { width: 55 }]}>750.000</Text>
                                </View>
                            </View>
                        </ScrollView>

                        <Text style={{
                            color: theme[mode].greetingColor,
                            fontSize: 18,
                            textAlign: "center"
                        }}>{I18n.t('support.fees', { locale: language })}</Text>
                        <Text style={{
                            color: theme[mode].textblack,
                            fontSize: 10,
                            alignSelf: 'center',
                            textAlign: "center",
                            width: 240,
                            marginBottom: 15
                        }}>{I18n.t('support.feesDesc', { locale: language })}</Text>

                        <ScrollView horizontal={true} style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: "row", padding: 10 }}>

                                <BankCard />

                            </View>
                        </ScrollView>


                    </View>
                </Card>

            </ScrollView>

        </Layout>
    )
}

export default SupportCenterScreen


const setStyle = mode => ({
    howCanWe: {
        fontSize: 18,
        color: theme[mode].lightblue,
        fontWeight: '500',
        alignSelf: 'center',
        marginTop: 15
    },
    tbodyVolume: {
        flexDirection: "row",
        alignItems: 'center',
        height: 42,
        paddingHorizontal: 10,
    },
    tableVolumeTbodyText: {
        color: theme[mode].usertextblack,
        fontSize: 12,
    },
    theadVolume: {
        paddingHorizontal: 10,
        height: 42,
        backgroundColor: theme[mode].bg,
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: 'center'
    },
    tableVolumeTheadText: {
        color: theme[mode].usertextblack,
        fontSize: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },

    limitsTableThead: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 42,
        backgroundColor: theme[mode].bg,
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    limitsTableTbody: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 42,
        backgroundColor: theme[mode].white,
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    tableLimitsTbodyText: {
        color: theme[mode].usertextblack,
        fontSize: 12,
        textAlign: 'center'
    },

})

const couples = [
    {
        label: 'TRY',
        value: 'TRY',
    },

];

const currency = [
    {
        label: 'TRY - Türk Lirası',
        value: 'TRY - Türk Lirası',
    },

];

const tableVolume = [
    {
        id: "1",
        volume: "0.00 - 1,000,000.00",
        seller: "0.0010",
        buyer: '0.0015',
    },
    {
        id: "2",
        volume: "1,000,000.00 - 5,000,000.00",
        seller: "0.0010",
        buyer: '0.0015',
    },
    {
        id: "3",
        volume: "5,000,000.00 - 10,000,000.00",
        seller: "0.0010",
        buyer: '0.0015',
    },
    {
        id: "4",
        volume: "10,000,000.00 - 50,000,000.00",
        seller: "0.0010",
        buyer: '0.0015',
    },
    {
        id: "5",
        volume: "50,000,000.00+",
        seller: "0.0010",
        buyer: '0.0015',
    },
]




export function BankCard() {
    const { state: { mode, language } } = useContext(ThemeContext);

    return (
        <View style={{
            width: 155,
            height: 256,
            backgroundColor: theme[mode].bg,
            borderRadius: 22,
            ...theme.shadow,
            marginRight: 15,
            padding: 10
        }}>
            <View style={{ marginTop: 20, alignItems: "center" }}>
                <Akbank width={80} />
            </View>
            <View style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: theme[mode].lightblue,
                justifyContent: 'center',
                alignItems: "center",
                alignSelf: 'center',
                marginTop: 15
            }}>
                <Tl color={theme[mode].white} />
            </View>
            <Text style={{ color: theme[mode].textblack, fontSize: 12, textAlign: 'center', marginTop: 25 }}>{I18n.t('support.bankcard.try', { locale: language })}</Text>

            <View style={{ marginTop: 30 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10
                }}>
                    <Text style={{ color: theme[mode].textblack, fontSize: 12 }}>{I18n.t('support.bankcard.min', { locale: language })}</Text>
                    <Text style={{ color: theme[mode].textblack, fontSize: 12 }}>{I18n.t('support.bankcard.max', { locale: language })}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{ color: theme[mode].textblack, fontSize: 12, fontWeight: '700' }}>10 TRY</Text>
                    <Text style={{ color: theme[mode].textblack, fontSize: 12, fontWeight: '700' }}>10 TRY</Text>
                </View>
            </View>
        </View>
    )
}
