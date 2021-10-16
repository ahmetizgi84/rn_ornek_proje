import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import I18n from '../../lang/_i18n'

import Card from '../../components/Card'
import { Settings } from '../../components/svg';
import HeaderLogin from '../../components/HeaderLogin';
import Switch from '../../components/Switch';

import { theme } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';

const LanguageScreen = ({ navigation }) => {
    const { state: { mode, language }, _toggleLanguage } = useContext(ThemeContext);
    const styles = setStyle(mode);

    function toggleSwitch(lang) {
        _toggleLanguage(lang)
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme[mode].bg,
        }}>
            <HeaderLogin settings navigation={navigation} />

            <Card profile>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Settings color={theme[mode].lightblue} />
                </View>
                <Text style={{ flex: 5, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('settingsScreen.language', { locale: language })}</Text>
                <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
            </Card>

            <View style={styles.content}>
                {/* <View style={styles.inputContainer}>
                    <Text style={styles.inpTitle}>
                        {I18n.t('language.default', { locale: language })}
                    </Text>
                    <Switch value={language == 'default'} onValueChange='default' callback={() => toggleSwitch('system')} />
                </View> */}

                <View style={styles.inputContainer}>
                    <Text style={styles.inpTitle}>
                        {I18n.t('settingsScreen.en', { locale: language })}
                    </Text>
                    <Switch value={language == 'en'} onValueChange='en' callback={() => toggleSwitch('en')} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inpTitle}>
                        {I18n.t('settingsScreen.tr', { locale: language })}
                    </Text>
                    <Switch value={language == 'tr'} onValueChange='tr' callback={() => toggleSwitch('tr')} />
                </View>
            </View>

        </View>
    )
}

export default LanguageScreen


const setStyle = mode => ({
    inputContainer: {
        height: 50,
        backgroundColor: theme[mode].white,
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

    content: {
        marginTop: 10,
        marginHorizontal: 10,
    }
});