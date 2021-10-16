import React, { useContext, useState } from 'react';
import { View, TextInput } from 'react-native';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

const InputText = props => {
  const { state: { mode } } = useContext(ThemeContext);
  const [isFocused, setIsFocused] = useState(false)

  const styles = setStyle(mode);

  return (
    <View style={[
      styles.searchSection,
      props.isEmpty && styles.error,
      props.dirty && styles.dirty,
      props.green && styles.green,
      isFocused && styles.focusedStyle
    ]}>
      {props.leftIcon}
      <TextInput
        style={[props.inputStyle,
        styles.input,
        props.dirty && styles.dirty,
        props.green && styles.transparent

        ]}
        onChangeText={text => {
          props.onChangeText(text); // 1 is the id of the input.
        }}
        autoCapitalize={props.capitalize || 'none'}
        autoCorrect={false}
        secureTextEntry={props.passwordHide}
        placeholder={props.placeholder || ''}
        keyboardType={props.keyboardType || 'default'}
        autoCompleteType={props.autoComplete || 'off'}
        placeholderTextColor={theme[mode].placeholderTextColor}
        value={props.amountValue || null}
        editable={props.disabled && false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {props.rightIcon}
    </View>
  );
};

export default InputText;

const setStyle = mode => ({
  searchSection: {
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme[mode].white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  dirty: {
    backgroundColor: theme[mode].cardinputdirty
  },

  green: {
    backgroundColor: theme[mode].inpbgc
  },

  transparent: {
    backgroundColor: "transparent",
    color: theme[mode].green
  },

  searchIcon: {
    padding: 10,
  },
  input: {
    marginBottom: 1,
    flex: 1,
    padding: 10,
    height: 42,
    backgroundColor: theme[mode].white,
    color: theme[mode].textblack,
  },
  focusedStyle: {
    borderWidth: 0.7,
    borderColor: theme[mode].green
  },


  error: {
    borderColor: theme[mode].red,
  },
});
