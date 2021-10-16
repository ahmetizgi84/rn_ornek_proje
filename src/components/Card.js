import React, { useContext } from 'react'
import { View } from 'react-native'

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';


const Card = ({ children, ...props }) => {
    const { state: { mode } } = useContext(ThemeContext);
    const styles = setStyle(mode);

    return (
        <View style={[styles.cardContainer, props.profile && styles.profile]}>
            {children}
        </View>
    )
}

export default Card


const setStyle = mode => ({

    cardContainer: {
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: theme[mode].white,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 8,
        ...theme.shadow,
    },


    profile: {
        flexDirection: "row",
        alignItems: "center"
    },

})