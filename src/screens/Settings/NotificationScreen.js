import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, } from 'react-native'
import I18n from '../../lang/_i18n'

import Card from '../../components/Card'
import { Mail, Down } from '../../components/svg';
import HeaderLogin from '../../components/HeaderLogin';
import InputText from '../../components/InputText'

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { Context as AuthContext } from '../../context/AuthContext'
import Switch from '../../components/Switch';

const NotificationScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { state: { userData } } = useContext(AuthContext);

    const styles = setStyle(mode);
    const [isActive, setIsActive] = useState(false)

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme[mode].bg,
        }}>
            <HeaderLogin settings navigation={navigation} />

            <Card profile>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Mail color={theme[mode].lightblue} />
                </View>
                <Text style={{ flex: 5, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('settingsScreen.notification', { locale: language })}</Text>
                <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
            </Card>

            <ScrollView style={{ marginBottom: 10 }}>
                <View style={{ paddingBottom: 10 }}>

                    <Card>
                        <Text style={styles.cardTitle}>{I18n.t('notifications.title', { locale: language })}</Text>

                        <View>
                            <Text style={styles.inpTitle}>
                                {I18n.t('notifications.email', { locale: language })}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={userData.email}
                                dirty
                                disabled
                            />
                        </View>

                        {/* <View>
                            <Text style={styles.inpTitle}>
                                {I18n.t('notifications.format', {locale: language})}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={userData.format}
                                dirty
                                disabled
                                rightIcon={<Down width={20} color={theme[mode].buttontextgray} />}
                            />
                        </View> */}
                    </Card>

                    <Card>
                        <Text style={styles.cardTitle}>{I18n.t('notifications.individual', { locale: language })}</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('notifications.ind1', { locale: language })}
                            </Text>
                            <Switch value={isActive} callback={() => setIsActive(!isActive)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('notifications.ind2', { locale: language })}
                            </Text>
                            <Switch value={isActive} callback={() => setIsActive(!isActive)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('notifications.ind3', { locale: language })}
                            </Text>
                            <Switch value={isActive} callback={() => setIsActive(!isActive)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('notifications.ind4', { locale: language })}
                            </Text>
                            <Switch value={isActive} callback={() => setIsActive(!isActive)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('notifications.ind5', { locale: language })}
                            </Text>
                            <Switch value={isActive} callback={() => setIsActive(!isActive)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('notifications.ind6', { locale: language })}
                            </Text>
                            <Switch value={isActive} callback={() => setIsActive(!isActive)} />
                        </View>

                    </Card>

                </View>
            </ScrollView>


        </View>
    )
}

export default NotificationScreen


const setStyle = mode => ({
    cardTitle: {
        fontWeight: '500',
        color: theme[mode].lightblue,
        marginBottom: 10
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

    inpTitle: {
        fontSize: 12,
        color: theme[mode].textblack
    },

    pinBtn: {
        marginRight: -10,
        borderRadius: 8,
        backgroundColor: theme[mode].textblack,
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center"
    },
});


