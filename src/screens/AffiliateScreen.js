import React, { useContext } from 'react'
import { View, Text, ScrollView } from 'react-native'
import I18n from '../lang/_i18n'

import Layout from '../components/Layout';
import Card from '../components/Card'
import { Ortaklık, Copy, Facebook, Twitter, İnstagram, Whatsapp, Telegram, İllustration } from '../components/svg';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { Context as AuthContext } from '../context/AuthContext'


const AffiliateScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { state: { userData } } = useContext(AuthContext);


    const styles = setStyle(mode);

    return (
        <Layout nodrawer navigation={navigation}>
            <ScrollView keyboardShouldPersistTaps="handled">


                <Card profile>
                    <View>
                        <View style={{ width: 48, height: 48, borderRadius: 48, backgroundColor: "#ddd", marginRight: 20 }} />
                    </View>
                    <View>
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcome}>{I18n.t('greetings', { locale: language })}</Text>
                            <Text style={styles.user}>{userData.fullname}</Text>
                        </View>
                        <Text style={styles.email}>{userData.email}</Text>
                        <Text style={styles.uid}>Kullanıcı Numarası: {userData.uid}</Text>
                    </View>
                </Card>


                <Card profile>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Ortaklık color={theme[mode].lightblue} />
                    </View>
                    <Text style={{ flex: 4, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('affiliate.title', { locale: language })}</Text>
                    <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
                </Card>

                <Card>
                    <Text style={styles.title}>{I18n.t("affiliate.sharingCode", { locale: language })}</Text>

                    <View style={styles.codeContainer}>
                        <View style={styles.copyAndCode}>
                            <Text style={styles.code}>10258132</Text>
                            <Copy width={16} height={16} color={theme[mode].lightblue} />
                        </View>
                        <Text style={styles.link}>ornekapp.com/User-refere/10258132</Text>
                    </View>

                    <Text style={styles.social}>{I18n.t("affiliate.social", { locale: language })}</Text>

                    <View style={styles.socialMedia}>
                        <View style={styles.logoContainer}>
                            <Facebook color={theme[mode].lightblue} />
                        </View>

                        <View style={styles.logoContainer}>
                            <Twitter color={theme[mode].lightblue} />
                        </View>

                        <View style={styles.logoContainer}>
                            <İnstagram color={theme[mode].lightblue} />
                        </View>

                        <View style={styles.logoContainer}>
                            <Whatsapp color={theme[mode].lightblue} />
                        </View>

                        <View style={styles.logoContainer}>
                            <Telegram color={theme[mode].lightblue} />
                        </View>
                    </View>
                </Card>

                <Card>
                    <Text style={styles.title2}>{I18n.t("affiliate.gain", { locale: language })}</Text>
                    <Text style={styles.title3}>{I18n.t("affiliate.amount", { locale: language })}</Text>
                    <Text style={{ color: theme[mode].darkblue, fontSize: 45 }}>0.0074278</Text>

                    <View style={{ alignItems: "center", marginBottom: 25 }}>
                        <İllustration width={300} height={200} />
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.title3}>{I18n.t("affiliate.rank", { locale: language })}</Text>
                        <Text style={styles.h4}>4270</Text>

                        <Text style={styles.title3}>{I18n.t("affiliate.friends", { locale: language })}</Text>
                        <Text style={styles.h4}>12</Text>

                        <Text style={styles.title3}>{I18n.t("affiliate.total", { locale: language })}</Text>
                        <Text style={styles.h4}>76</Text>

                    </View>

                </Card>



            </ScrollView>
        </Layout>
    )
}

export default AffiliateScreen

const setStyle = mode => ({
    welcomeContainer: {
        flexDirection: "row"
    },

    welcome: {
        color: theme[mode].darkblue,
        marginRight: 5
    },
    user: {
        color: theme[mode].lightblue
    },

    email: {
        color: theme[mode].usertextblack,
        fontSize: 12
    },
    uid: {
        color: theme[mode].usertextblack,
        fontSize: 12
    },

    title: {
        fontSize: 11,
        color: theme[mode].textblack,
        marginBottom: 15
    },

    title2: {
        fontSize: 20,
        color: theme[mode].textblack,
        marginBottom: 15,
        fontWeight: '500'
    },

    title3: {
        color: theme[mode].textblack,
        fontSize: 12,
        marginBottom: 5
    },

    h4: {
        fontSize: 48,
        color: theme[mode].textblack
    },

    codeContainer: {
        backgroundColor: theme[mode].cardinputdirty,
        padding: 10,
        borderRadius: 8
    },

    copyAndCode: {
        flexDirection: "row",
        alignItems: "center"
    },

    code: {
        color: theme[mode].lightblue,
        fontSize: 18,
        fontWeight: "700",
        marginRight: 10
    },
    link: {
        color: theme[mode].darkblue,
        fontSize: 12,
        marginTop: 10,
    },
    socialMedia: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 10
    },

    social: {
        fontSize: 13,
        color: theme[mode].lightblue,
        marginTop: 10
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 48,
        backgroundColor: theme[mode].lightblueopacity,
        alignItems: "center",
        justifyContent: "center"
    },
})