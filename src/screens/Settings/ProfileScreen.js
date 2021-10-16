import React, { useContext } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import I18n from '../../lang/_i18n'

import Card from '../../components/Card'
import { PadLock, Pin, User, Down } from '../../components/svg';
import HeaderLogin from '../../components/HeaderLogin';
import InputText from '../../components/InputText'

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import { Context as AuthContext } from '../../context/AuthContext'
import Button from '../../components/Button';


const ProfileScreen = ({ navigation }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { state: { userData } } = useContext(AuthContext);
    const styles = setStyle(mode);

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme[mode].bg,
        }}>
            <HeaderLogin settings navigation={navigation} />

            <Card profile>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <User color={theme[mode].lightblue} />
                </View>
                <Text style={{ flex: 4, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('settingsScreen.profile', { locale: language })}</Text>
                <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
            </Card>

            {/* Üyelik Bilgileri */}

            <ScrollView style={{ marginBottom: 10 }}>
                <View style={{ paddingBottom: 10 }}>

                    <Card>
                        <Text style={styles.cardTitle}>{I18n.t('profile.title', { locale: language })}</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('profile.name', { locale: language })}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={userData.profiles[0].first_name}
                                dirty
                                disabled
                                rightIcon={<PadLock width={16} color={theme[mode].inputIconColor} />}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('profile.surname', { locale: language })}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={userData.profiles[0].last_name}
                                dirty
                                disabled
                                rightIcon={<PadLock width={16} color={theme[mode].inputIconColor} />}
                            />
                        </View>

                        {/* <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('profile.identity', {locale: language})}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={"bu bilgi nerde?"}
                                dirty
                                disabled
                                rightIcon={<PadLock width={16} color={theme[mode].inputIconColor} />}
                            />
                        </View> */}
                        {/* </Card>

                    <Card> */}
                        <Text style={styles.cardTitle}>{I18n.t('address.title', { locale: language })}</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('address.subtitle', { locale: language })}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={userData.profiles[0].address}
                                dirty
                                disabled
                                rightIcon={<PadLock width={16} color={theme[mode].inputIconColor} />}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('address.country', { locale: language })}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={userData.profiles[0].country}
                                dirty
                                disabled
                                rightIcon={<PadLock width={16} color={theme[mode].inputIconColor} />}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('address.state', { locale: language })}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={userData.profiles[0].city}
                                dirty
                                disabled
                                rightIcon={<PadLock width={16} color={theme[mode].inputIconColor} />}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('address.postal', { locale: language })}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={userData.profiles[0].postcode}
                                dirty
                                disabled
                                rightIcon={<PadLock width={16} color={theme[mode].inputIconColor} />}
                            />
                        </View>

                        {/* <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('address.company', {locale: language})}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={"şirket bilgisi nerde?"}
                                dirty
                                disabled
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('address.timeZone', {locale: language})}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={"zaman bilgisi nerde?"}
                                dirty
                                disabled
                                rightIcon={<Down width={20} color={theme[mode].inputIconColor} />}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inpTitle}>
                                {I18n.t('address.location', {locale: language})}
                            </Text>
                            <InputText
                                //onChangeText={onChangeText => props.onchangeAmountHandler(onChangeText.trim())}
                                isEmpty={false}
                                placeholder={"konum bilgisi nerde"}
                                dirty
                                disabled
                                rightIcon={<TouchableOpacity style={styles.pinBtn}>
                                    <Pin width={20} color={theme[mode].white} />
                                </TouchableOpacity>}
                            />
                        </View> */}

                        {/* <View style={{ marginVertical: 30 }}>
                            <Button title={I18n.t('settingsScreen.buttonTitle', {locale: language})} btnLg btnPrimary />
                        </View> */}

                    </Card>
                </View>
            </ScrollView>


        </View>
    )
}

export default ProfileScreen


const setStyle = mode => ({
    cardTitle: {
        fontWeight: '500',
        color: theme[mode].lightblue,
        marginBottom: 10
    },

    inputContainer: {
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
