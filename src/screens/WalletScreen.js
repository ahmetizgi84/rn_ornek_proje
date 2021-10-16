import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import I18n from '../lang/_i18n'
import { useFocusEffect } from "@react-navigation/native";

import Layout from '../components/Layout';
import Card from '../components/Card'
import { Tl } from '../components/svg'
 import * as componentsMap from '../components/svg/icon';

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { DataContext } from '../context/DataContext';
import ProfileCard from '../components/ProfileCard';

import SkeletonLoaderWallet from '../components/SkeletonLoaderWallet';

 
function isNumeric(s) {
  return !isNaN(s - parseFloat(s));
}

 
function UpperKelime(string) {
  if (string == null)
    return null
  try {
    if (isNumeric(string.charAt(0)))
      string = "Svg" + string.charAt(0) + (string.charAt(1)).toUpperCase() + string.slice(2)
    else
      string = (string.charAt(0)).toUpperCase() + string.slice(1)
    const DynamicComponent = componentsMap[string];
    if (DynamicComponent == null)
      return null
    return <DynamicComponent height={32} width={32} />;
  } catch (error) {
     return null;
  }
}
export function Try() {
  const { state: { mode } } = useContext(ThemeContext);
  const styles = setStyle(mode);
  return (
    <View style={styles.circle}>
      <Tl width='13' height='19' color='white' />
    </View>
  )
}

const formatMoney = (n) => {
  return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').replace(/\.(\d+)$/, ',$1');
}

const WalletScreen = ({ navigation }) => {
  const { state: { mode, language } } = useContext(ThemeContext);
  const { walletTL, walletBTC, walletList, _getWalletList } = useContext(DataContext)
  const styles = setStyle(mode);

  const toggleModal = (id) => {
    const item = walletList.find(i => i.id === id)
    navigation.navigate("ChillDetail", { item: item })
  };

  const renderItem = ({ item }) => (
    <RenderItemComponent item={item} toggleModal={toggleModal} />
  );

  const ListEmptyComponent = () => {
    return (
      [1, 2, 3, 4, 5, 6, 7].map(index => (
        <View key={index}>
          <SkeletonLoaderWallet />
        </View>
      ))
    )
  }

  useFocusEffect(
    React.useCallback(() => {
      _getWalletList()
    }, [])
  );

  return (
    <Layout>
      <ProfileCard />

      <Card>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{I18n.t('walletScreen.estimated', { locale: language })}</Text>
          <Text style={styles.tl}>{formatMoney(walletTL)} ₺</Text>
          <Text style={styles.btc}>{parseFloat(walletBTC).toFixed(6)} BTC</Text>
        </View>
      </Card>

      <View style={styles.thead}>
        <View style={{ width: 30 }} />
        <Text style={[styles.theadText, { flex: 2 }]}>{I18n.t('walletScreen.chill', { locale: language })}</Text>
        <Text style={[styles.theadText, { flex: 1.2 }]}>{I18n.t('walletScreen.available', { locale: language })}</Text>
        <Text style={[styles.theadText, { flex: 1.2 }]}>{I18n.t('walletScreen.locked', { locale: language })}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={walletList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>

    </Layout>
  );
};

export default WalletScreen;


export class RenderItemComponent extends React.PureComponent {
  static contextType = ThemeContext;

  render() {
    const { item, toggleModal } = this.props
    const { state: { mode } } = this.context;
    const styles = setStyle(mode);
    return (
      <TouchableOpacity style={styles.row} onPress={() => toggleModal(item.id)}>
        <View style={{ width: 40 }}>
           {UpperKelime(item.id)}
        </View>
        <Text style={[styles.itemText, { color: theme[mode].textblack, flex: 2 }]}>{item.title}</Text>
        <Text style={[styles.itemText, { color: theme[mode].textblack, flex: 1.2 }]}>{item.id == 'try' ? formatMoney(item.balance) : item.balance}</Text>
        <Text style={[styles.itemText, { color: theme[mode].textblack, flex: 1.2 }]}>{item.id == 'try' ? formatMoney(item.locked) : item.locked}</Text>
      </TouchableOpacity>
    )
  }
}

const setStyle = mode => ({

  title: {
    fontSize: 10,
    color: theme[mode].textblack,
    marginBottom: 7
  },
  tl: {
    color: theme[mode].lightblue,
    marginBottom: 3
  },
  btc: {
    color: theme[mode].darkblue,
  },

  thead: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  notProfil: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
    color: theme[mode].textblack
  },
  theadText: {
    fontSize: 12,
    color: theme[mode].textblack,
    width: 75,
    flex: 2
  },

  circle: {
    borderRadius: 24,
    width: 24,
    height: 24,
    borderWidth: 5,
    borderColor: '#e9ba45',
    backgroundColor: '#e9ba45',
    alignItems: 'center',
    justifyContent: 'center'
  },

  row: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    height: 42,
    backgroundColor: theme[mode].white,
    marginBottom: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center"
  },

  itemText: {
    fontSize: 12,
    width: 75,
    flex: 2
  },

})

