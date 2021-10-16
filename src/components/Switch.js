import React, { useContext } from 'react';
import {
    View,
    Pressable,
    Platform,
    UIManager,
    LayoutAnimation,
} from 'react-native';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const Switch = ({ value, callback }) => {
    const { state: { mode } } = useContext(ThemeContext);
    const styles = setStyle(mode);

    const toggleFirstBox = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        callback();
    };

    return (
        <Pressable
            onPress={toggleFirstBox}
            activeOpacity={1}
            style={[styles.container1, value === true ? null : styles.openBg1]}>
            <View style={[styles.dot, value === true ? styles.moveRight : null]} />
        </Pressable>
    );
};

export default Switch


const setStyle = mode => ({
    container1: {
        width: 40,
        height: 20,
        borderRadius: 25,
        justifyContent: 'center',
        padding: 2,
        backgroundColor: theme[mode].lightblue
    },
    openBg1: {
        backgroundColor: theme[mode].switchBtnPassive
    },

    dot: {
        width: 16,
        height: 16,
        borderRadius: 16,
        backgroundColor: theme[mode].switchDotColor
    },

    moveRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#FFF',
    },
});