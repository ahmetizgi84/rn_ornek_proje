import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import I18n from '../lang/_i18n'

import Layout from '../components/Layout';
import Card from '../components/Card'
import { Right, Settings } from '../components/svg';
import Switch from '../components/Switch'

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { Context as AuthContext } from '../context/AuthContext'
import DeviceInfo from 'react-native-device-info';


const SettingsScreen = ({ navigation }) => {
  const { state: { mode, isDark, language }, _toggleTheme } = useContext(ThemeContext);
  const { state: { isLoggedIn } } = useContext(AuthContext);


  const styles = setStyle(mode);


  const themeModeHandler = () => {
    _toggleTheme(mode);
  }

  const listItemNavigationHandler = (item) => {
    navigation.navigate(item.route)
  }



  const loggedInData = [
    {
      id: '1',
      title: I18n.t('settingsScreen.profile', { locale: language }),
      desc: '',
      ico: <Right />,
      route: 'Profile'
    },
    // {
    //   id: '2',
    //   title: I18n.t('settingsScreen.settings', { locale: language }),
    //   desc: '',
    //   ico: <Right />,
    //   route: 'Notification'
    // },
    // {
    //   id: '3',
    //   title: I18n.t('settingsScreen.settings', { locale: language }),
    //   desc: '',
    //   ico: <Right />,
    //   route: 'Finance'
    // },
    {
      id: '4',
      title: I18n.t('settingsScreen.activity', { locale: language }),
      desc: '',
      ico: <Right />,
      route: 'LoginActivity'
    },
    // {
    //   id: '5',
    //   title: I18n.t('settingsScreen.settings', { locale: language }),
    //   desc: 'Sistem Dili',
    //   ico: <Right />,
    //   route: 'Language'
    // },
  ];


  return (
    <Layout nodrawer navigation={navigation}>

      <Card profile>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Settings color={theme[mode].lightblue} />
        </View>
        <Text style={{ flex: 4, fontSize: 18, fontWeight: '500', color: theme[mode].lightblue }}>{I18n.t('settingsScreen.settings', { locale: language })}</Text>
        <View style={{ flexDirection: 'row', flex: 3, justifyContent: "space-around" }} />
      </Card>

      <View style={{ marginTop: 10 }}>
        <FlatList
          data={isLoggedIn ? loggedInData : null}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ListCard
              item={item}
              callback={() => listItemNavigationHandler(item)}
            />
          )}
          ListFooterComponentStyle={{ marginHorizontal: 10, paddingBottom: 10 }}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Language')}
      >
        <View style={styles.icon}>
          <Text style={styles.text}>{I18n.t('settingsScreen.language', { locale: language })}</Text>
        </View>
        <View style={styles.type}>
          <Text style={{ marginRight: 10, color: theme[mode].tabbuttonpassive, fontSize: 12 }}>
            {
              language === 'system' ? I18n.t('settingsScreen.sys', { locale: language }) :
                language === 'en' ? 'English' : 'Türkçe'
            }

          </Text>
          <Right color={theme[mode].inputIconColor} />
        </View>
      </TouchableOpacity>

      <View
        style={[styles.item]}
      >
        <View style={styles.icon}>
          <Text style={styles.text}>{I18n.t('settingsScreen.mode', { locale: language })}</Text>
        </View>
        <View style={styles.type}>
          <Switch value={isDark} callback={themeModeHandler} />
        </View>
      </View>

      <View style={{ alignItems: 'center', flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
        <Text style={{ marginRight: 10, fontSize: 12, color: theme[mode].textblack }}>{I18n.t('settingsScreen.version', { locale: language })}</Text>
        <Text style={{ fontSize: 12, color: theme[mode].tabbuttonpassive }}>{DeviceInfo.getVersion()}</Text>
      </View>


    </Layout>
  );
};

export default SettingsScreen;

function ListCard({ item, callback }) {
  const {
    state: { mode },
  } = useContext(ThemeContext);
  const styles = setStyle(mode);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      TouchableOpacity
      style={styles.item}
      onPress={callback}
    >
      <View style={styles.icon}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
      <View style={styles.type}>
        <Text style={{ marginRight: 10, color: theme[mode].tabbuttonpassive, fontSize: 12 }}>
          {item.desc}
        </Text>
        <Right color={theme[mode].inputIconColor} />
      </View>
    </TouchableOpacity>
  );
}

const setStyle = mode => ({
  item: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme[mode].white,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  type: {
    flexDirection: 'row',
    alignItems: "center"
  },

  welcomeContainer: {
    flexDirection: "row"
  },

  welcome: {
    color: theme[mode].darkblue,
    marginRight: 5
  },
  user: {
    color: theme[mode].lightblue
  },

  email: {
    color: theme[mode].usertextblack,
    fontSize: 12
  },
  uid: {
    color: theme[mode].usertextblack,
    fontSize: 12
  },

  text: {
    color: theme[mode].textblack,
    fontSize: 12
  }


});

const notLoggedInData = [
  {
    id: '1',
    title: 'Dil Seçimi',
    desc: 'Sistem Dili',
    ico: <Right />,
    route: 'Language'
  },
]


