import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native';
import Header from './Header';
import HeaderLogin from './HeaderLogin';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';

// import useRenderCounter from '../hooks/useRenderCounter'
// const renderCounter = useRenderCounter();
// { renderCounter }


const Layout = ({ children, navigation, nodrawer }) => {
  const { state: { mode } } = useContext(ThemeContext);
  const styles = setStyle(mode);

  return (
    <SafeAreaView style={styles.container} flex={1}>
      {
        nodrawer ? <HeaderLogin settings navigation={navigation} /> : <Header navigation={navigation} />
      }
      {children}
    </SafeAreaView>
  );
};

export default Layout;

const setStyle = mode => ({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: theme[mode].bg,
  },
});
