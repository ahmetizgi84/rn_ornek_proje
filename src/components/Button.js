import React, { useContext } from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

const Button = ({
  title,
  btnFlex,
  btnSm,
  btnXsm,
  btnLg,
  btnDefault,
  btnDarkBlue,
  btnLightBlue,
  btnPrimary,
  btnSuccess,
  btnDanger,
  btnDark,
  btnBordered,
  btnBlack,
  callback,
  disabled,
  btnBorderedBlue,
  containerStyle,
  textStyle
}) => {
  const {
    state: { mode },
  } = useContext(ThemeContext);

  const styles = setStyle(mode);

  return (
    <TouchableOpacity
      onPress={callback}
      disabled={disabled || false}
      style={[
        styles.btnContainer,
        btnFlex && styles.btnFlex,
        btnSm && styles.btnSm,
        btnXsm && styles.btnXsm,
        btnLg && styles.btnLg,
        btnBordered && styles.btnBordered,
        btnBorderedBlue && styles.btnBorderedBlue,
        btnDefault && styles.btnDefault,
        btnDark && styles.btnDark,
        btnDarkBlue && styles.btnDarkBlue,
        btnLightBlue && styles.btnLightBlue,
        btnPrimary && styles.btnPrimary,
        btnSuccess && styles.btnSuccess,
        btnDanger && styles.btnDanger,
        btnBlack && styles.btnBlack,
        disabled && styles.disabled,
        containerStyle && containerStyle,
      ]}>
      <Text
        style={[
          styles.btnText,
          btnFlex && styles.btnFlexText,
          btnPrimary && styles.btnTextLight,
          btnSuccess && styles.btnTextLight,
          btnDanger && styles.btnTextLight,
          btnDarkBlue && styles.btnTextDarkBlue,
          btnLightBlue && styles.btnTextDarkBlue,
          btnBorderedBlue && styles.btnTextBorderedBlue,
          btnBlack && styles.btnTextDarkBlue,
          textStyle && textStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const setStyle = mode => ({
  btnContainer: {
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 0,
      },
    }),
  },

  btnDefault: {
    backgroundColor: theme[mode].cardbtnbgcolor,
  },
  btnDark: {
    backgroundColor: theme[mode].white,
  },
  btnPrimary: {
    backgroundColor: theme[mode].lightblue,
  },
  btnDarkBlue: {
    backgroundColor: theme[mode].darkblue,
  },
  btnLightBlue: {
    backgroundColor: theme[mode].lightblue,
  },
  btnSuccess: {
    backgroundColor: theme[mode].green,
  },
  btnDanger: {
    backgroundColor: theme[mode].red,
  },
  btnBlack: {
    backgroundColor: theme[mode].textblack,
  },

  btnSm: {
    width: 91.25,
    height: 24,
  },

  btnFlex: {
    paddingHorizontal: 15,
    height: 24,
    backgroundColor: theme[mode].lightblue,
  },

  btnXsm: {
    width: 76.25,
    height: 24,
  },

  btnLg: {
    width: '100%',
    height: 42,
  },

  btnBordered: {
    borderWidth: 1,
    //borderColor: theme[mode].inputbordercolor
    borderColor: theme[mode].searchInputBorderColor
  },

  btnBorderedBlue: {
    borderWidth: 1,
    //borderColor: theme[mode].inputbordercolor
    borderColor: theme[mode].lightblue
  },

  btnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme[mode].textblack,
  },

  btnTextDarkBlue: {
    fontSize: 12,
    fontWeight: '700',
    color: theme[mode].white,
  },

  btnTextBorderedBlue: {
    fontSize: 12,
    fontWeight: '400',
    color: theme[mode].lightblue,
  },

  btnTextLight: {
    fontSize: 14,
    fontWeight: '700',
    color: theme[mode].btnPrimaryColor,
  },

  btnFlexText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme[mode].white,
  },
  disabled: {
    backgroundColor: theme[mode].lightbluedisabled,
  },
});
