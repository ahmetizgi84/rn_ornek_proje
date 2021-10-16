
import React, { useContext } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import I18n from './lang/_i18n';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Tab Navigation Screens___________________________________________
import HomeScreen from './screens/HomeScreen';
import MarketScreen from './screens/MarketsScreen';
import EasyScreen from './screens/EasyScreen';
import OpenOrdersScreen from './screens/OpenOrdersScreen';
import WalletScreen from './screens/WalletScreen';
// #Tab Navigation Screens___________________________________________

import ChillDetailScreen from './screens/Wallet/ChillDetail'
import WithdrawalScreen from './screens/Wallet/WithdrawalScreen'

import LoginScreen from './screens/Auth/LoginScreen';
import TwoFactorScreen from './screens/Auth/TwoFactorScreen';
import AccountScreen from './screens/AccountScreen';
import WalletforAccountScreen from './screens/WalletForAccountScreen';

import RegisterScreen from './screens/Auth/RegisterScreen';
import ResetPasswordScreen from './screens/Auth/ResetPasswordScreen';
import ProTradeScreen from './screens/ProTradeScreen';

import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/Settings/ProfileScreen';
import NotificationScreen from './screens/Settings/NotificationScreen';
import FinanceScreen from './screens/Settings/FinanceScreen';
import LoginActivityScreen from './screens/Settings/LoginActivityScreen';
import LanguageScreen from './screens/Settings/LanguageScreen';

import TransactionHistoryScreen from './screens/TransactionHistoryScreen'
import TradeHistoryScreen from './screens/TradeHistoryScreen';

import ApiScreen from './screens/ApiScreen'
import SupportCenterScreen from './screens/SupportCenterScreen'
import AffiliateScreen from './screens/AffiliateScreen'

import { navigationRef, isReadyRef } from './RootNavigation';

import { theme } from './constants/ThemeStyle';
import { Context as ThemeContext } from './context/ThemeContext';
import { Context as AuthContext } from './context/AuthContext';

import { Home, Piyasalar, Alsat, Orders, Wallet } from './components/svg';
import DrawerContent from './components/Drawer';
import DrawerContentNotLoggedIn from './components/DrawerNotLoggedIn';

const Stack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//_______________________________________ HOME SCREEN STACK FLOW ___________________________________________//
const _screenOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
};

function HomeScreenFlow() {
  const { state: { isLoggedIn } } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={_screenOptions}>
      {
        !isLoggedIn ?
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ProTrade" component={ProTradeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="TwoFactorScreen" component={TwoFactorScreen} />
            <Stack.Screen name="Signup" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetPasswordScreen} />
          </> :
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ProTrade" component={ProTradeScreen} />
          </>
      }
    </Stack.Navigator>
  );
}


function MarketScreenFlow() {
  const { state: { isLoggedIn } } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={_screenOptions}>
      {
        !isLoggedIn ?
          <>
            <Stack.Screen name="Trade" component={MarketScreen} />
            <Stack.Screen name="ProTrade" component={ProTradeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="TwoFactorScreen" component={TwoFactorScreen} />
            <Stack.Screen name="Signup" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetPasswordScreen} />
          </> :
          <>
            <Stack.Screen name="Trade" component={MarketScreen} />
            <Stack.Screen name="ProTrade" component={ProTradeScreen} />
          </>
      }
    </Stack.Navigator>
  );
}


function EasyScreenFlow() {
  const { state: { isLoggedIn } } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={_screenOptions}>
      {
        !isLoggedIn ?
          <>
            <Stack.Screen name="Easy" component={EasyScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="TwoFactorScreen" component={TwoFactorScreen} />
            <Stack.Screen name="Signup" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetPasswordScreen} />
          </> :
          <Stack.Screen name="Easy" component={EasyScreen} />

      }
    </Stack.Navigator>
  )
}

function OpenOrdersFlow() {
  const { state: { isLoggedIn } } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={_screenOptions}>
      {
        isLoggedIn ?
          <Stack.Screen name="OpenOrders" component={OpenOrdersScreen} /> :
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="TwoFactorScreen" component={TwoFactorScreen} />
            <Stack.Screen name="Signup" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetPasswordScreen} />
          </>
      }
    </Stack.Navigator>
  )
}

function WalletFlow() {
  const { state: { isLoggedIn } } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={_screenOptions}>
      {
        isLoggedIn ?
          <>
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="ChillDetail" component={ChillDetailScreen} />
            <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
          </> :
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="TwoFactorScreen" component={TwoFactorScreen} />
            <Stack.Screen name="Signup" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetPasswordScreen} />
          </>
      }
    </Stack.Navigator>
  )
}


//_______________________________________ TAB NAVIGATION FLOW ___________________________________________//
const BottomTabNavFlow = () => {
  const { state: { mode, language } } = useContext(ThemeContext);

  return (
    <>
      <Tab.Navigator
        tabBarOptions={{
          keyboardHidesTabBar: true,
          activeTintColor: theme[mode].tabbuttonactive,
          inactiveTintColor: theme[mode].tabbuttonpassive,
          style: {
            backgroundColor: mode === 'dark' ? theme[mode].bg : theme[mode].white,
            borderTopColor: mode === 'dark' ? theme[mode].bg : theme[mode].white,
          },
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeScreenFlow}
          options={{
            title: I18n.t('home', { locale: language }),
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="TradeTab"
          component={MarketScreenFlow}
          options={{
            title: I18n.t('market', { locale: language }),
            tabBarIcon: ({ color, size }) => (
              <Piyasalar color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="EasyTab"
          component={EasyScreenFlow}
          options={{
            title: I18n.t('trade', { locale: language }),
            tabBarIcon: ({ color, size }) => <Alsat color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="OpenOrdersTab"
          component={OpenOrdersFlow}
          options={{
            title: I18n.t('orders', { locale: language }),
            tabBarIcon: ({ color, size }) => <Orders color={color} size={size} />,
          }}
        />

        <Tab.Screen
          name="WalletTab"
          component={WalletFlow}
          options={{
            title: I18n.t('wallet', { locale: language }),
            tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

//_______________________________________ DRAWER FLOW ___________________________________________//

function DrawerNavFlow() {
  const { state: { isLoggedIn } } = useContext(AuthContext);
  if (isLoggedIn) {
    return (
      <Drawer.Navigator
        drawerContent={props => <DrawerContent {...props} />}
        initialRouteName="TabHome"
        drawerType="front"
        drawerPosition="right"
        screenOptions={{
          swipeEnabled: false,
        }}
        drawerStyle={{
          backgroundColor: '#48515B',
          width: 260,
        }}>
        <Drawer.Screen name="TabHome" component={BottomTabNavFlow} />
      </Drawer.Navigator>
    );
  } else {
    return (
      <Drawer.Navigator
        drawerContent={props => <DrawerContentNotLoggedIn {...props} />}
        initialRouteName="TabHome"
        drawerType="front"
        drawerPosition="right"
        screenOptions={{
          swipeEnabled: false,
        }}
        drawerStyle={{
          backgroundColor: '#48515B',
          width: 260,
        }}>
        <Drawer.Screen name="TabHome" component={BottomTabNavFlow} />
      </Drawer.Navigator>
    );
  }
}


//_______________________________________ MAIN FLOW ___________________________________________//
function Router() {
  const { state: { mode } } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1 }} backgroundColor={theme[mode].bg}>
      <StatusBar
        barStyle={mode === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={theme[mode].bg}
        hidden={false}
      />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}>
        <MainStack.Navigator screenOptions={_screenOptions}>
          <MainStack.Screen name="Drawer" component={DrawerNavFlow} />
          <MainStack.Screen name="Settings" component={SettingsScreen} />
          <MainStack.Screen name="AccountScreen" component={AccountScreen} />
          <MainStack.Screen name="WalletForAccount" component={WalletforAccountScreen} />
          <MainStack.Screen name="ChillDetail" component={ChillDetailScreen} />
          <MainStack.Screen name="Withdrawal" component={WithdrawalScreen} />
          <MainStack.Screen name="Profile" component={ProfileScreen} />
          <MainStack.Screen name="Notification" component={NotificationScreen} />
          <MainStack.Screen name="Finance" component={FinanceScreen} />
          <MainStack.Screen name="LoginActivity" component={LoginActivityScreen} />
          <MainStack.Screen name="Language" component={LanguageScreen} />
          <MainStack.Screen name="Api" component={ApiScreen} />
          <MainStack.Screen name="Support" component={SupportCenterScreen} />
          <MainStack.Screen name="Affiliate" component={AffiliateScreen} />
          <MainStack.Screen name="Transaction" component={TransactionHistoryScreen} />
          <MainStack.Screen name="History" component={TradeHistoryScreen} />
          <MainStack.Screen name="OpenOrders" component={OpenOrdersScreen} />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default Router;
