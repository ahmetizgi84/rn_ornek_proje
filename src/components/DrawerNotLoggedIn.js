import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { Context as RouterContext } from '../context/RouterContext';
import { Context as AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import I18n from '../lang/_i18n';

import {
  Wallet,
  User,
  Piyasalar,
  Shield,
  Orders,
  Clock,
  Past,
  Settings,
  Ortaklık,
  Api,
  Support,
  Tl,
  X,
} from './svg';
import Button from './Button';

const Drawer = ({ ...props }) => {
  const { state: { mode, language } } = useContext(ThemeContext);
  const { _drawerButtonsHandler } = useContext(RouterContext);

  const { _logoutHandler, state: { isLoggedIn } } = useContext(AuthContext);

  const styles = setStyle(mode);

  return (
    <View style={styles.container}>
      <DrawerHeader mode={mode} props={props} />

      <View style={{ marginTop: 10 }}>

        <Divider mode={mode} />

        <TouchableOpacity
          style={styles.card}
          onPress={() => _drawerButtonsHandler('wallet')}>
          <Wallet color={theme[mode].textblack} />
          <Text style={styles.cardText}>{I18n.t('drawer.drwWallet', { locale: language })}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => _drawerButtonsHandler('markets')}>
          <Piyasalar color={theme[mode].textblack} />
          <Text style={styles.cardText}>{I18n.t('drawer.drwMarket', { locale: language })}</Text>
        </TouchableOpacity>

        <Divider mode={mode} />

        <TouchableOpacity
          style={styles.card}
          onPress={() => _drawerButtonsHandler('settings')}>
          <Settings color={theme[mode].textblack} />
          <Text style={styles.cardText}>{I18n.t('drawer.drwSettings', { locale: language })}</Text>
        </TouchableOpacity>


        {/* 
          APİ SONRA YAPILACAK
        */}

        {/*
          <TouchableOpacity
            style={styles.card}
            onPress={() => _drawerButtonsHandler('affiliate')}>
            <Ortaklık color={theme[mode].textblack} />
            <Text style={styles.cardText}>{I18n.t('drawer.drwOrtaklik', {locale: language})}</Text>
          </TouchableOpacity>

         <TouchableOpacity
          style={styles.card}
          onPress={() => _drawerButtonsHandler('api')}>
          <Api color={theme[mode].textblack} />
          <Text style={styles.cardText}>{I18n.t('drawer.drwApi', {locale: language})}</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.card}
          onPress={() => _drawerButtonsHandler('support')}>
          <Support color={theme[mode].textblack} />
          <Text style={styles.cardText}>{I18n.t('drawer.drwSupport', { locale: language })}</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default Drawer;

const DrawerHeader = ({ mode, props }) => {
  const styles = setStyle(mode);
  const { walletTL } = useContext(DataContext)
  return (
    <View style={styles.header}>
      <View style={styles.amountContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.amount}>{parseFloat(walletTL).toFixed(3)}</Text>
          <Tl width={8} color={theme[mode].btnPrimaryColor} />
        </View>
        <Wallet style={{ marginLeft: 15 }} width={12} color={theme[mode].btnPrimaryColor} />
      </View>
      {/* <View>
        <Text>TR</Text>
      </View> */}
      <View>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <X color={theme[mode].darkblue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Divider = ({ mode }) => {
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 0.5,
        borderColor: theme[mode].lineColor,
      }}
    />
  );
};

const setStyle = mode => ({
  container: {
    flex: 1,
    backgroundColor: theme[mode].searchInputBg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  amountContent: {
    backgroundColor: theme[mode].lightblue,
    padding: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    marginRight: 1,
    color: theme[mode].btnPrimaryColor,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 17,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme[mode].textblack,
    marginLeft: 20,
  },
});
