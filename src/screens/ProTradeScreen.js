import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import I18n from '../lang/_i18n'
import NetInfo from "@react-native-community/netinfo";


// Pure Components, shouldComponentUpdate => Class based components
// React.memo, useMemo, useCallback => Functional components

/**
 * Memoization:
 * İhtiyaç duyulan bir değerin sürekli olarak hesaplanması
 * yerine bir kere hesaplanıp ihtiyaç duyulduğunda 
 * bu değerin yeniden kullanılması kullanılmasına verilen addır
 */

import Card from '../components/Card';
import Layout from '../components/Layout';
import Toast from '../components/Toast'
import { MarketSelector, OrderBook, ButtonGroup, OpenOrders, MakeAnOrder, LatestTransactions, GraphicsLine, TradingView } from '../components/ProTradeScreenComps';

import { theme } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { Context as ProTradeContext } from '../context/ProTradeContext';
import { DataContext } from '../context/DataContext';


const ProTradeScreen = ({ navigation, route }) => {
  const { item } = route.params
  const _isMounted = useRef(true)
  const { state: { mode, language } } = useContext(ThemeContext);
  const { toastMessage } = useContext(DataContext)
  const { state: { marketDetails, asks, bids }, _startWebSocket, _closeSocket } = useContext(ProTradeContext)

  const [currentMarket, setCurrentMarket] = useState()
  const [isOffline, setOfflineStatus] = useState(null);


  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('blur', () => {
        _closeSocket();
      })

      return unsubscribe
    }, [navigation])
  );

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
        const offline = !(state.isConnected && state.isInternetReachable);
        setOfflineStatus(offline)
      });
      if (isOffline === false) {
        if (_isMounted.current) {
          setCurrentMarket(item.id)
          _startWebSocket();
        }
      } else if (isOffline === true) {
        _closeSocket();
      }

      return () => removeNetInfoSubscription();
    }, [isOffline])
  );

  return (
    <Layout nodrawer>
      <View style={{ flex: 1, zIndex: 1 }}>
        {
          toastMessage ? (toastMessage === 'order_success' ? <Toast message={I18n.t('easyScreen.toast.success', { locale: language })} type={"success"} /> :
            toastMessage === 'order_balance_zero' ? <Toast message={I18n.t('easyScreen.toast.danger', { locale: language })} type={"danger"} /> :
              toastMessage === 'order_login_required' ? <Toast message={I18n.t('easyScreen.toast.danger2', { locale: language })} type={"danger"} /> :
                toastMessage === 'order_amount_zero' ? <Toast message={I18n.t('easyScreen.toast.amount_zero', { locale: language })} type={"danger"} /> :
                  toastMessage === 'cancel_order_success' ? <Toast message={I18n.t('ordersScreen.toast.success', { locale: language })} type={"success"} /> :
                    toastMessage === 'cancel_order_failed' ? <Toast message={I18n.t('ordersScreen.toast.danger', { locale: language })} type={"danger"} /> :
                      toastMessage === 'cancel_order_session_error' ? <Toast message={I18n.t('ordersScreen.toast.session', { locale: language })} type={"danger"} /> :
                        toastMessage === 'amount_zero' ? <Toast message={I18n.t('ordersScreen.toast.amount', { locale: language })} type={"danger"} /> :
                          toastMessage === 'no_valid_session' ? <Toast message={I18n.t('ordersScreen.toast.continue', { locale: language })} type={"danger"} /> :
                            <Toast message={I18n.t('easyScreen.toast.error', { locale: language })} type={"danger"} />) : (null)
        }
        <MarketSelector relatedMarket={item} />

        <TradeContent
          item={item}
          marketDetails={marketDetails}
          asks={asks}
          bids={bids}
          currentMarket={currentMarket}
          navigation={navigation}
        />
      </View>

    </Layout>
  );
};

export default ProTradeScreen;



/**
 *
 * DİKKAT!
 * AŞAĞIDAKİ VIRTUALIZEDVIEW KOMPONENTİ İÇERİSİNDE KULLANILAN FLATLİST DÜZENLİ BİR ŞEKİLDE RE-RENDER OLARAK (NEDENİNİ ÇÖZEMEDİM!)
 * LİSTHEADERCOMPONENT BÜNYESİNDE BULUNAN CHİLD COMPONENTLERİN STATELERİNİN SIFIRLANMASINA NEDEN OLUYOR
 * 
 * https://github.com/facebook/react-native/issues/13602#issuecomment-300608431
 * yukardaki linkteki yoruma göre re-render olmuyor.
 * "...React will treat it as a new react component class and will destroy and recreate the instance every time, just as if you were switching back and forth between"
 *
 */

export function VirtualizedView({ children }) {
  const [list, setList] = useState([])

  const dummyList = useMemo(() => {
    return list
  }, [list])

  // ÖNEMLİ
  // always pre-bind functions you pass as props so you don't re-create the function on every render.
  const _headerComponent = () => <React.Fragment>{children}</React.Fragment>


  return (
    <FlatList
      data={dummyList}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={_headerComponent}
    />
  );
}



export function TradeContent({ item, currentMarket }) {
  const [state, setState] = useState(2);

  const changeBtnState = (state) => {
    setState(state)
  }


  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Card>
        <ButtonGroup callback={changeBtnState} state={state} />
        {
          state === 1 ? <TradingView gelenMarket={item} /> :
            state === 2 ? <MakeAnOrder relatedMarket={item} /> :
              state === 3 && <LatestTransactions item={item} />
        }
      </Card>

      {state === 1 && <OrderBook secilenMarket={item} />}
      {state === 2 && <OpenOrders currentMarket={currentMarket} />}
    </ScrollView>

  )
}







