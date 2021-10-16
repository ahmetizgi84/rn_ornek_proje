import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import I18n from '../lang/_i18n'

import Card from '../components/Card'
import Layout from '../components/Layout'
import { Api, Trash, Copy } from '../components/svg';
import InputText from '../components/InputText'


import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { Context as AuthContext } from '../context/AuthContext'
import Button from '../components/Button';


const ApiScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { state: { userData } } = useContext(AuthContext);

    const styles = setStyle(mode);

    return (
        <Layout nodrawer navigation={navigation}>
            <ScrollView keyboardShouldPersistTaps="handled">

                <Card profile>
                    <View>
                        <View style={{ width: 48, height: 48, borderRadius: 48, backgroundColor: "#ddd", marginRight: 20, marginLeft: 10 }} />
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
                        <Api color={theme[mode].lightblue} />
                    </View>
                    <Text style={{ flex: 4, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('api.title', { locale: language })}</Text>
                    <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
                </Card>

                <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 5, alignItems: "flex-end" }}>
                    <Button title={I18n.t("api.btnTitle", { locale: language })} btnFlex />
                </View>

                <Card>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => console.log("api key slinecek")}
                        >
                            <Trash color={theme[mode].buttontextgray} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.qrcode} />
                    <Text style={styles.scanText}>{I18n.t("api.scan", { locale: language })}</Text>


                    <View>
                        <Text style={styles.inpTitle}>
                            {I18n.t('api.secret', { locale: language })}
                        </Text>


                        <InputText
                            keyboardType="default"
                            isEmpty={false}
                            amountValue={"3QdFNQUbEv6rFXCZKqWptxUS24KEu2fTEU"}
                            dirty
                            rightIcon={
                                <TouchableOpacity
                                    onPress={() => console.log("klipboarda kopyalanacak")}>
                                    <Copy color={theme[mode].buttontextgray} />
                                </TouchableOpacity>
                            }
                            disabled
                        />
                    </View>

                </Card>
            </ScrollView>

            {/*    
            <InputText
                keyboardType="default"
                isEmpty={false}
                amountValue={"3QdFNQUbEv6rFXCZKqWptxUS24KEu2fTEU"}
                dirty
                rightIcon={
                    <TouchableOpacity
                        onPress={() => console.log("klipboarda kopyalanacak")}>
                            <Copy color={theme[mode].buttontextgray} /> 
                    </TouchableOpacity>
                }
                disabled
            />
        */}

        </Layout>
    )
}

export default ApiScreen


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

    modalHeader: {
        alignItems: "flex-end",
        paddingBottom: 10,
        marginBottom: 5,
    },

    modalCloseBtn: {
        padding: 2,
    },

    qrcode: {
        alignSelf: "center",
        width: 120,
        height: 120,
        backgroundColor: "#ddd"
    },

    scanText: {
        alignSelf: "center",
        marginVertical: 20,
        color: theme[mode].usertextblack,
        fontSize: 12,
    },

    inpTitle: {
        color: theme[mode].textblack,
        fontSize: 10,
        marginBottom: 5,
    },
})