import React, { useState, useContext } from 'react';
import { View } from 'react-native';

import Layout from '../components/Layout';
import Search from '../components/Search'
import MarketList from '../components/MarketList'

import { SocketContext } from '../context/SocketContext';


const MarketsScreen = () => {
  const { marketList } = useContext(SocketContext);
  const [filtered, setFiltered] = useState([])

  const searchInTradeMarket = (searchText) => {
    let txt = searchText.toLowerCase();
    let filteredData = marketList.filter(function (item) {
      return item.title.toLowerCase().includes(txt);
    });
    setFiltered(filteredData)
  }

  return (
    <Layout>
      <View style={{ marginBottom: 5 }}>
        <Search callback={(text) => searchInTradeMarket(text)} />
      </View>

      <MarketList filtered={filtered} />

    </Layout>
  );
};

export default MarketsScreen;


