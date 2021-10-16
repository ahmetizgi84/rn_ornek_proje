import React, { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import I18n from '../../lang/_i18n'


import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';


function Buttons({ callback, state }) {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);



    return (
        <View style={styles.buttonGroup}>
            <Pressable
                style={[styles.sellBuyBtn, state === 1 ? styles.active : styles.passive]}
                onPress={() => callback(1)} >
                <Text style={[styles.btnText, state === 1 ? styles.activeText : styles.passiveText]}>{I18n.t('chillDetailScreen.wdhistory', { locale: language })}</Text>
            </Pressable>
            <Pressable style={[styles.sellBuyBtn, state === 2 ? styles.active : styles.passive]} onPress={() => callback(2)}>
                <Text style={[styles.btnText, state === 2 ? styles.activeText : styles.passiveText]}>{I18n.t('chillDetailScreen.dephistory', { locale: language })}</Text>
            </Pressable>
        </View>
    )
}

export default Buttons


const setStyle = mode => ({
    // Button Group 
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 3
    },
    sellBuyBtn: {
        flex: 1,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
    active: {
        ...theme.shadow,
        backgroundColor: theme[mode].btnActiveColor,
        borderRadius: 8
    },
    passive: {
        backgroundColor: theme[mode].btnPassiveColor,
    },
    btnText: {
        fontSize: 12,
    },
    activeText: {
        color: theme[mode].lightblue,
        fontWeight: 'bold'
    },
    passiveText: {
        color: theme[mode].textblack
    },
})