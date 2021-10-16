import React, { useContext } from 'react';
import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { Ornekapp, Back, Hamburger } from './svg';
import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const Header = ({ settings }) => {
  const {
    state: { mode },
  } = useContext(ThemeContext);
  const styles = setStyle(mode);
  const navigation = useNavigation();

  const navHandler = () => {
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Back color={theme[mode].darkblue} />
      </TouchableOpacity>
      <Pressable style={[styles.logoContainer]} onPress={navHandler}>
        <Ornekapp />
        <View style={styles.textContainer}>
          <Text style={styles.ornek}>ornek</Text>
          <Text style={styles.index}>INDEX</Text>
        </View>
      </Pressable>
      {
        !settings && (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Hamburger color={theme[mode].darkblue} />
          </TouchableOpacity>
        )
      }
    </View>
  );
};

export default Header;

const setStyle = mode => ({
  logoContainer: {
    flexDirection: 'row',
    paddingVertical: 5
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
    //height: StatusBar.currentHeight * 2 + 8,
    height: 56,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme[mode].bg,
    paddingHorizontal: 10,
    ...theme.shadow,
    borderColor: theme[mode].inputbordercolor,
  },
});
