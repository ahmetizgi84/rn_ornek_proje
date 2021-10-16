import React, { useContext } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import I18n from '../lang/_i18n'

import Card from './Card'

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { Context as AuthContext } from '../context/AuthContext';

const ProfileCard = () => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const { state: { userData } } = useContext(AuthContext);

    const styles = setStyle(mode);

    if (!userData) {
        return <ActivityIndicator size="large" style={{ marginTop: 200 }} />;
    }

    return (
        <Card profile>
            <View style={styles.cardContainer}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcome}>{I18n.t('greetings', { locale: language })}</Text>
                    <Text style={styles.user}>{userData.profiles[0].first_name} {userData.profiles[0].last_name}</Text>
                </View>
                <Text style={styles.email}>{userData.email}</Text>
                <Text style={styles.uid}>{I18n.t('userNumber', { locale: language })} {userData.uid}</Text>
            </View>
        </Card>
    )
}

export default ProfileCard


const setStyle = mode => ({
    cardContainer: {
        marginHorizontal: 10,
    },

    welcomeContainer: {
        flexDirection: "row"
    },

    welcome: {
        color: theme[mode].greetingColor,
        marginRight: 5
    },
    user: {
        color: theme[mode].lightblue
    },

    email: {
        color: theme[mode].textShineColor,
        fontSize: 12
    },
    uid: {
        color: theme[mode].textShineColor,
        fontSize: 12
    },
})