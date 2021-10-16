import React, { useContext, useEffect } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import I18n from '../../lang/_i18n'

import Card from '../../components/Card'
import { Settings, Nodata } from '../../components/svg';
import HeaderLogin from '../../components/HeaderLogin';
import Toast from '../../components/Toast';

import UAParser from '../../helpers/UAParser';

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { DataContext } from '../../context/DataContext';



const LoginActivityScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { activityData, isProcessing, toastMessage, _getLoginActivityData } = useContext(DataContext)

    const styles = setStyle(mode);

    useEffect(() => {
        if (activityData.length <= 0) {
            _getLoginActivityData();
        }
    }, [activityData])


    const listEmpty = () => {
        return (
            <View style={{ padding: 10, height: 200, justifyContent: "center", alignItems: "center", opacity: 0.5 }}>
                <Nodata width={70} />
                <Text style={{ color: theme[mode].tabbuttonpassive }}>{I18n.t('ordersScreen.nodata', { locale: language })}</Text>
            </View>
        )
    }

    const userAgentParse = (data) => {
        var info = data;
        try {
            var parser = new UAParser();
            info = parser.setUA(data).getResult();
        } catch (error) {
            console.log(error)
        }
        return info.browser.name ? (info.browser.name + " - " + (info.device.model == undefined ? info.os.name : info.device.model)) : null
    }

    const handleTime = (time) => {
        var ds = time.toString();
        var tar = ds.replace('T', ' ')
        var tarih = tar.replace('Z', '')
        return tarih
    }




    const renderItem = ({ item }) => (
        <View style={[styles.row, { paddingVertical: 7 }]}>
            <View  >
                <Text style={styles.itemTitle}>{item.action}</Text>
                <Text style={styles.itemSub}>{userAgentParse(item.user_agent)}</Text>
            </View>

            <View  >
                <Text style={[styles.itemTitle, { textAlign: "right" }]}>{item.user_ip}</Text>
                {/* <Text style={[styles.itemSub, { textAlign: "right" }]}>{(new Date(item.created_at)).toUTCString()}</Text> */}
                <Text style={[styles.itemSub, { textAlign: "right" }]}>{handleTime(item.created_at)}</Text>
            </View>
        </View>
    );



    return (
        <View style={{
            flex: 1,
            backgroundColor: theme[mode].bg,
        }}>

            <HeaderLogin settings navigation={navigation} />

            <View style={{ flex: 1, zIndex: 1 }}>

                {
                    toastMessage === 'cannot_get_loginactivitydata' ?
                        <Toast message={I18n.t('settingsScreen.loginActivity.toast', { locale: language })} type={"danger"} /> :
                        null
                }


                <Card profile>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Settings color={theme[mode].lightblue} />
                    </View>
                    <Text style={{ flex: 5, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('settingsScreen.activity', { locale: language })}</Text>
                    <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
                </Card>


                <View style={styles.card}>
                    {
                        isProcessing ?
                            <ActivityIndicator size="small" color={theme[mode].darkIndicatorColor} /> :
                            <FlatList
                                data={activityData}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                ListEmptyComponent={listEmpty}
                            />
                    }
                </View>

            </View>
        </View>
    )
}

export default LoginActivityScreen


const setStyle = mode => ({

    row: {
        paddingVertical: 12,
        backgroundColor: theme[mode].white,
        marginBottom: 5,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 0.3,
        borderColor: theme[mode].buttontextgray,
        justifyContent: "space-between"
    },
    itemTitle: {
        alignItems: "flex-start",
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 14,
        color: theme[mode].textblack,
    },

    itemSub: {
        top: 1,
        alignItems: "flex-start",
        fontSize: 10,
        lineHeight: 12,
        color: theme[mode].buttontextgray,
    },


    card: {
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: theme[mode].white,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 8,
        ...theme.shadow,
        flex: 1
    }
});
