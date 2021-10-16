import React, { useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import I18n from '../lang/_i18n';
import { useNavigation } from '@react-navigation/native';

import { Ornekapp, Hamburger } from './svg';
import Button from './Button';
import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { Context as AuthContext } from '../context/AuthContext';

const Header = () => {
  const { state: { mode, language } } = useContext(ThemeContext);
  const { state: { isLoggedIn, userData } } = useContext(AuthContext);


  const styles = setStyle(mode);
  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ornekapp />
        <View style={styles.textContainer}>
          <Text style={styles.ornek}>ornek</Text>
          <Text style={styles.index}>INDEX</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{ marginRight: 10 }}>
          {isLoggedIn ? (
            <Text
              style={styles.name}
              onPress={() => console.log('Navigate user to the Account Page')}>
              {
                !userData ? '' : userData.profiles[0].first_name + " " + userData.profiles[0].last_name
              }
            </Text>
          ) : (
            <Button
              title={I18n.t('login', { locale: language })}
              btnSm
              btnDark
              callback={() => navigation.navigate('LoginScreen')}
            />
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Hamburger color={theme[mode].darkblue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const setStyle = mode => ({
  logoContainer: {
    flexDirection: 'row',
  },

  textContainer: {
    flexDirection: 'row',
    marginLeft: 5,
  },

  ornek: {
    color: theme[mode].lightblue,
    fontSize: 15,
    fontWeight: '700',
  },
  index: {
    color: theme[mode].textblack,
    fontSize: 15,
    fontWeight: '700',
  },

  container: {
    height: 56,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme[mode].bg,
    paddingHorizontal: 10,
    ...theme.shadow,
  },

  name: {
    color: theme[mode].textblack,
    fontSize: 12,
    fontWeight: '700',
  },
});
