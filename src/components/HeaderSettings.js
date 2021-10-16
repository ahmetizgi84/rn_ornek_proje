import React, { useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ornekapp, Home } from './svg';
import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const HeaderSettings = () => {
  const {
    state: { mode },
  } = useContext(ThemeContext);
  const styles = setStyle(mode);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Home color={theme[mode].darkblue} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.logoContainer]}
        onPress={() => navigation.navigate('Home')}>
        <Ornekapp />
        <View style={styles.textContainer}>
          <Text style={styles.ornek}>ornek</Text>
          <Text style={styles.index}>INDEX</Text>
        </View>
      </TouchableOpacity>
      <View />
    </View>
  );
};

export default HeaderSettings;

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
