import React, { useState, useEffect, useRef } from 'react';
import ornekappApi from '../api/ornekappApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

const MARKET_URL = '/trade/public/markets';
const TICKER_URL = '/platform/public/markets/tickers';
const SOCKET_URL = 'wss://ornekapp.com/api/v2/ws/public/?stream=global.tickers';

let ws

export const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  const _isMounted = useRef(true)
  const [marketList, setMarketList] = useState([])
  const [choosed, setChoosed] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(null)

  const [isNotEstablished, setIsNotEstablished] = useState(false)


  // __________________________________________ CHECKING NETWORK STATUS ___________________________________________________
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsModalOpen(offline);
    });

    if (isModalOpen === false) {
      _getCurrentValue();
      startWebSocket();
    }
    return () => removeNetInfoSubscription();
  }, [isModalOpen]);


  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, [])

  //_______________________________________ WEBSOCKET CONNECTION - HOMEPAGE, MARKETPLACE, EASY AND PRO TRADE SCREENS ______________________________________________________

  const _getCurrentValue = async () => {
    let counter = 10
    while (true) {
      try {
        const marketResponse = await ornekappApi.get(MARKET_URL);
        const tickerResponse = await ornekappApi.get(TICKER_URL);
        const defaultTicker = {
          last: 0,
          high: 0,
          low: 0,
          min_amount: 0.01,
          amount_precision: 2,
          price_precision: 3,
          volume: 0,
          price_change_percent: '+0.00%',
          price_change_percent_type: 0,
        }
        let wholeData = [];
        marketResponse.data.map(async (market, index) => {
          let sparkLineData = [];
          wholeData[index] = {
            id: market.id,
            title: market.name,
            subtitle: market.base_unit,
            // svg: imgNullCheck(market.base_unit),
            svg: market.base_unit,
            graph: sparkLineData,
            price: (tickerResponse.data[market.id].ticker || defaultTicker).last,
            last: (tickerResponse.data[market.id].ticker || defaultTicker).last,
            high: (tickerResponse.data[market.id].ticker || defaultTicker).high,
            low: (tickerResponse.data[market.id].ticker || defaultTicker).low,
            min_amount: (market || defaultTicker).min_amount,
            amount_precision: (market || defaultTicker).amount_precision,
            price_precision: (market || defaultTicker).price_precision,
            volume: (tickerResponse.data[market.id].ticker || defaultTicker).volume,
            percentage: (tickerResponse.data[market.id].ticker || defaultTicker).price_change_percent,
          };

          const BASE_URL = '/trade/public/markets/' + market.id + '/k-line?period=60&limit=20';
          const graphResponse = await ornekappApi.get(BASE_URL);
          if (graphResponse.data) {
            graphResponse.data.map(dt => {
              sparkLineData.push(dt[4]);
            });
          }
          //SplashScreen.hide();
        });

        const jsonValue = JSON.stringify(wholeData)
        await AsyncStorage.setItem('MARKET_LIST', jsonValue)

        if (_isMounted.current) {
          setMarketList(wholeData)
          setChoosed(wholeData[0])
          setIsNotEstablished(false)
        }
        return wholeData
      } catch (error) {
        if (counter == 0) {
          console.log('network hatası _getCurrentValue: ', error.message);
          setIsNotEstablished(true)
          break
        }
        counter--;
        continue;
        //console.log('network hatası _getCurrentValue: ', error.message);
      }
    }
  }
  //_________________________________________________________________________________________________________________________________________
  // const imgNullCheck = data => {
  //   var source = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/icon/btc.svg';
  //   try {
  //     var imgVar = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/icon/' + data + '.svg';
  //     if (imgVar) {
  //       source = imgVar;
  //     }
  //   } catch { }
  //   return source;
  // };
  //__________________________________________________________________________________________________________________________________________
  const startWebSocket = async () => {
    console.log("starting socketcontext websocket....")
    const wholeData = await _getCurrentValue();
    ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      //console.log("ws state", ws.readyState)
      while (ws.readyState == 0) return
      ws.send(
        JSON.stringify({
          type: 'subscribe',
          product_ids: ['ETH-USD', 'ETH-EUR'],
          channels: ['ticker'],
        }),
      );
    }

    ws.onmessage = e => {
      //console.log("onmessage event:", e.data)
      const response = JSON.parse(e.data);
      if (response['global.tickers']) {
        if (isNotEstablished) {
          const stringifiedData = AsyncStorage.getItem('MARKET_LIST')
          const jsonValue = JSON.parse(stringifiedData)
          handleReceive(response, jsonValue)
        } else {
          handleReceive(response, wholeData)
        }
      }
    };

    ws.onclose = e => {
      console.log('Reconnecting socketcontext websocket : ', e.message);
      //setTimeout(startWebSocket, 5000)
    };

    ws.onerror = (e) => {
      console.log(`SocketContext Socket Error: ${e.response} - ${e.message}`);
      setTimeout(startWebSocket, 10000)
    };
  };

  const handleReceive = async (response, wholeData) => {

    let newMarketList = [...wholeData];
    newMarketList.map((market, index) => {
      let durum = response['global.tickers'][market.id]['price_change_percent'].charAt(0)
      if (durum == '+') {
        price_change_percent_type = 1;
      } else {
        price_change_percent_type = -1;
      }

      // if (newMarketList[index].price !== response['global.tickers'][market.id].last) {
      newMarketList[index].price = response['global.tickers'] && response['global.tickers'][market.id].last
      newMarketList[index]['last'] = response['global.tickers'] && response['global.tickers'][market.id].last
      newMarketList[index]['percentage'] = response['global.tickers'] && response['global.tickers'][market.id]['price_change_percent'];
      newMarketList[index]['percentage_type'] = price_change_percent_type;
      newMarketList[index]['volume'] = response['global.tickers'] && response['global.tickers'][market.id]['volume'];
      //console.log("Market Name: ", newMarketList[index].title, ' => Price: ', newMarketList[index].price)
      //console.log("Eski Fiyat: ", newMarketList[index].price, ' => Yeni Fiyat: ', response['global.tickers'][market.id].last)
      if (_isMounted.current) {
        setMarketList(newMarketList)
      }
      //  }
    });
  }

  const _chooseCurrency = (currency) => {
    setChoosed(currency)
  }



  return (
    <SocketContext.Provider
      value={{
        marketList,
        choosed,
        isModalOpen,
        _chooseCurrency,
        _getCurrentValue,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
