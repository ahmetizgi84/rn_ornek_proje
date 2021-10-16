import React, { useContext } from 'react';
import { Text, View, StatusBar } from 'react-native';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

const Header = () => {
    const {
        state: { mode },
    } = useContext(ThemeContext);


    return (<StatusBar
        animated={true}
        backgroundColor={theme[mode].white}
        barStyle={theme[mode].barStyle}
        showHideTransition={"fade"}
        translucent={false}
    />
    );
};

export default Header;

