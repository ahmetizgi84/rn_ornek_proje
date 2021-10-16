import React, { useContext, useState } from 'react'
import { View, TextInput } from 'react-native'
import I18n from '../lang/_i18n';

import { Search as SearchIcon } from '../components/svg';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';


const Search = ({ callback }) => {
    const { state: { mode, language } } = useContext(ThemeContext);
    const styles = setStyle(mode);
    const [search, setSearch] = useState("")


    const searchHandler = (text) => {
        setSearch(text)
        callback(text)
    }


    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input]}
                autoCorrect={false}
                placeholder={I18n.t('searchInpPlaceHolder', { locale: language })}
                keyboardType={'default'}
                autoCompleteType={'off'}
                placeholderTextColor={theme[mode].placeholderTextColor}
                value={search}
                onChangeText={(text) => searchHandler(text)}
            />
            <SearchIcon
                style={styles.searchIcon}
                width={18}
                color={theme[mode].tabbuttonpassive}
            />
        </View>
    )
}

export default Search


const setStyle = mode => ({
    inputContainer: {
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        position: 'relative',
        flex: 1,
        height: 36,
        paddingVertical: 5,
        backgroundColor: theme[mode].searchInputBg,
        borderRadius: 8,
        paddingLeft: 38,
        borderWidth: 1,
        width: '100%',
        borderColor: theme[mode].searchInputBorderColor,
        color: theme[mode].usertextblack
    },

    searchIcon: {
        position: 'absolute',
        bottom: 6,
        left: 10,
    },
});