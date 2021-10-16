import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Platform } from 'react-native';
import I18n from '../lang/_i18n';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Layout from '../components/Layout';
import { Tl, X, Down } from '../components/svg'
import * as componentsMap from '../components/svg/icon';
import Button from '../components/Button';
import InputText from '../components/InputText';
import Card from '../components/Card'
import Toast from '../components/Toast'

import { theme } from '../constants/ThemeStyle';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ThemeContext } from '../context/ThemeContext';
import { SocketContext } from '../context/SocketContext';
import { DataContext } from '../context/DataContext';


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
    return null
  }
}

const EasyScreen = ({ navigation }) => {
  const { state: { mode, language } } = useContext(ThemeContext);
  const { state: { isLoggedIn } } = useContext(AuthContext);
  const { choosed, marketList, _chooseCurrency } = useContext(SocketContext)
  const { toastMessage, balance, _getBalance, _easyTradeHandler } = useContext(DataContext)

  const styles = setStyle(mode);

  const [isActive, setIsActive] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("")
  const [total, setTotal] = useState(0)
  const [errors, setErrors] = useState([]);
  const [marketId, setMarketId] = useState("usdttry")

  const onPressHandler = () => {
    let errs = [];
    let newAmount = 0
    if (amount === '') {
      errs.push('amount');
    }
    if (errs.length) {
      setErrors(errs);
      return;
    }
    if (isActive) {
      newAmount = total
    } else {
      newAmount = amount
    }

    const pair = choosed.id;
    _easyTradeHandler(newAmount, pair, isActive, choosed)
  }

  const calculateRate = (rate) => {
    if (isLoggedIn) {
      let availableBalance = 0
      let ratedAmount = 0
      let totalFixed = 0
      let currentMarketLastPrice = parseFloat(choosed.price).toFixed(choosed.price_precision)
      if (isActive) {
        availableBalance = parseFloat(avalibleBalance())
        ratedAmount = (availableBalance * rate).toFixed(3)
        totalFixed = (ratedAmount / currentMarketLastPrice).toFixed(choosed.amount_precision)

        let precision = parseFloat(choosed.amount_precision)
        let val = Math.pow(10, precision)
        let newVal = 1 / val
        totalFixed = (parseFloat(totalFixed) - parseFloat(newVal)).toFixed(precision)
        ratedAmount = (totalFixed * currentMarketLastPrice).toFixed(3)

        // console.log('-------------- ')
        // console.log('totalFixed: ',totalFixed)
        // console.log('ratedAmount: ',ratedAmount)
        // console.log('min_amount: ',choosed.min_amount)

        // if(totalFixed < choosed.min_amount){
        //   ratedAmount = 0
        //   totalFixed = 0
        // }
      } else {
        availableBalance = parseFloat(avalibleBalance())
        ratedAmount = (availableBalance * rate).toFixed(choosed.amount_precision)
        totalFixed = (ratedAmount * currentMarketLastPrice).toFixed(3)
      }
      setAmount(ratedAmount)
      setTotal(totalFixed)
    }
  }

  const setAmountHandler = (amount) => {
    if (amount > 0) {
      if (isActive) {
        let calculated = amount / choosed.price
        setTotal(calculated.toFixed(choosed.amount_precision))
      } else {
        let calculated = amount * choosed.price
        setTotal(calculated.toFixed(3))
      }
    } else {
      setTotal(0)
    }
    setAmount(amount)
    setErrors([]);
  }

  const setTradeIsActive = (type) => {
    setAmountHandler('')
    setIsActive(type);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const chooseCurrencyHandler = currency => {
    setMarketId(currency.id)
    _chooseCurrency(currency)
    setAmountHandler('')
    setModalVisible(false)
  }

  const decimalInt = (value, decimals) => {
    if (!value) {
      return ''
    }
    if (value === '.') {
      return value = '0.'
    }

    var regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`)
    const decimalsNumber = value.toString().match(regex)[0]
    const parsed = parseFloat(decimalsNumber).toFixed(decimals)
    if (isNaN(parsed)) {
      return '0'
    }
    return parsed
  }

  const avalibleBalance = () => {
    let index = 0;
    let market_index = 0;
    let lastBalance = 0;
    let price_pre = 3;
    const token = AsyncStorage.getItem('TOKEN');
    if (balance.length > 0 && token) {
      if (isActive) {
        index = balance.findIndex(x => x.currency === 'try');
        return decimalInt(balance[index].balance, price_pre)
      } else {
        index = balance.findIndex(x => x.currency === choosed.subtitle);
        market_index = marketList.findIndex(x => x.subtitle === choosed.subtitle)
        price_pre = marketList[market_index].amount_precision
        lastBalance = balance[index].balance
        if (lastBalance == 0) {
          return lastBalance
        }
        return decimalInt(lastBalance, price_pre)
      }
    } else {
      return 0
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      _getBalance();
    });

    return unsubscribe;
  }, [navigation]);

  const customFilter = () => {
    const filtered = marketList.filter(item => item.id == choosed.id)
    return filtered[0].last
  }
  
  const customFilterItem = () => {
    const filtered = marketList.filter(item => item.id == choosed.id)
    return filtered[0]
  }
  const currencyFormat = (numStr) => {
  
    let precision = customFilterItem().price_precision
    var price_precision = precision? precision === 0 ? 8 : precision:0;
    var formatter = new Intl.NumberFormat('en-US', { minimumSignificantDigits: price_precision === 0 ? 3 : price_precision, maximumSignificantDigits: 8 }).format(numStr);
    if (parseInt(formatter) < 1)
      formatter = parseFloat(formatter).toFixed(price_precision)

    return formatter;
  }
  return (
    <Layout>
      <ScrollView keyboardShouldPersistTaps="handled" >
        {
          toastMessage ? (toastMessage === 'order_success' ? <Toast message={I18n.t('easyScreen.toast.success', { locale: language })} type={"success"} /> :
            toastMessage === 'order_balance_zero' ? <Toast message={I18n.t('easyScreen.toast.danger', { locale: language })} type={"danger"} /> :
              toastMessage === 'order_login_required' ? <Toast message={I18n.t('easyScreen.toast.danger2', { locale: language })} type={"danger"} /> :
                toastMessage === 'order_amount_zero' ? <Toast message={I18n.t('easyScreen.toast.amount_zero', { locale: language })} type={"danger"} /> :
                  <Toast message={I18n.t('easyScreen.toast.error', { locale: language })} type={"danger"} />) : (null)
        }
        <View style={{ marginBottom: 10, paddingBottom: 250 }}>

          <Card>
            <Text style={styles.title}>{I18n.t("easyScreen.currency", { locale: language })}</Text>

            <TouchableOpacity style={styles.dropdown} onPress={toggleModal}>
              <View>
                {UpperKelime(choosed.svg)}
              </View>
              <View>
                <Text style={styles.txt}>{choosed.title} </Text>
              </View>
              <View>
                <Down color={theme[mode].inputIconColor} />
              </View>
            </TouchableOpacity>

            <View style={styles.btnContainer}>
              <Pressable style={[styles.sellBuyBtn, isActive ? styles.active : styles.passive]} onPress={() => setTradeIsActive(true)} >
                <Text style={[styles.btnText, isActive ? styles.activeText : styles.passiveText]}>{choosed.subtitle.toUpperCase()} AL</Text>
              </Pressable>
              <Pressable style={[styles.sellBuyBtn, !isActive ? styles.active : styles.passive]} onPress={() => setTradeIsActive(false)}>
                <Text style={[styles.btnText, !isActive ? styles.activeText : styles.passiveText]}>{choosed.subtitle.toUpperCase()} SAT</Text>
              </Pressable>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>{currencyFormat(customFilter())} </Text>
              <Tl width={32} height={34} color={theme[mode].lightblue} />
            </View>


            <View style={styles.btnGroup}>
              <Button title="%25" btnXsm btnDefault btnBordered callback={() => calculateRate(0.25)} />
              <Button title="%50" btnXsm btnDefault btnBordered callback={() => calculateRate(0.50)} />
              <Button title="%75" btnXsm btnDefault btnBordered callback={() => calculateRate(0.75)} />
              <Button title="%100" btnXsm btnDefault btnBordered callback={() => calculateRate(1)} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={styles.avalibleContainer}>
                <Text style={styles.avalibleText}>{I18n.t("easyScreen.avalible", { locale: language })} : {avalibleBalance()} {isActive ? 'TRY' : choosed.subtitle.toUpperCase()}</Text>
              </View>
            </View>

            <InputText
              keyboardType={Platform.OS === "android" ? "number-pad" : "numbers-and-punctuation"}
              leftIcon={<Text style={{ color: theme[mode].textblack }} >{isActive ? 'TRY' : choosed.subtitle.toUpperCase()}</Text>}
              onChangeText={onChangeText => setAmountHandler(onChangeText.replace(/[^0-9.]/g, ''))}
              dirty
              isEmpty={errors.find(err => err === 'amount') ? true : false}
              amountValue={amount.toString()}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setAmountHandler('')}
                  style={{ padding: 3, backgroundColor: theme[mode].bg, borderRadius: 10 }}>
                  <X width={20} color={theme[mode].textblack} />
                </TouchableOpacity>
              }
            />

            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>{I18n.t("protrade.makeanorder.total", { locale: language })} ≌ : {total} {isActive ? choosed.subtitle.toUpperCase() : 'TRY'}</Text>
              </View>
            </View>

            <View style={styles.btn}>
              <Button title={isActive ? I18n.t("easyScreen.buy", { locale: language }) : I18n.t("easyScreen.sell", { locale: language })} btnLg btnSuccess={isActive} btnDanger={!isActive} callback={onPressHandler} />
            </View>
          </Card>

        </View>

      </ScrollView>
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.50}
        hasBackdrop={true}
        useNativeDriver={true}
        style={{ alignItems: 'center', margin: 10 }}
      >
        <ChildModal mode={mode} callback={() => setModalVisible(false)} setCurrency={chooseCurrencyHandler} />
      </Modal>
    </Layout >
  );
};

export default EasyScreen;


const ChildModal = ({ mode, callback, setCurrency }) => {
  const { marketList } = useContext(SocketContext)

  return (
    <View style={{
      width: "90%",
      height: "90%",
      backgroundColor: theme[mode].modalbgcolor,
      ...theme.shadow,
      padding: 10,
    }}>
      <View style={{
        alignItems: "flex-end",
        paddingBottom: 10,
        borderBottomWidth: 0.3,
        borderColor: theme[mode].searchInputBorderColor,
        marginBottom: 5,
      }}>
        <TouchableOpacity
          style={{
            padding: 2,
            backgroundColor: theme[mode].bg,
            borderRadius: 5
          }}
          onPress={callback}>
          <X color={theme[mode].textblack} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{}}>
        {
          marketList?.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setCurrency(item)}
              style={{
                flexDirection: "row",
                paddingVertical: 10,
                backgroundColor: theme[mode].modalItembgcolor,
                marginBottom: 5,
                alignItems: "center"
              }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                {UpperKelime(item.svg)}
              </View>
              <Text style={{ flex: 2, fontSize: 12, color: theme[mode].textblack }}>{item.title}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </View>
  )
}







const setStyle = mode => ({

  title: {
    fontSize: 11,
    color: theme[mode].textblack,
    marginBottom: 15
  },

  dropdown: {
    height: 50,
    marginBottom: 15,
    backgroundColor: theme[mode].cardinputbgcolor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 8
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  sellBuyBtn: {
    flex: 1,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  active: {
    ...theme.shadow,
    backgroundColor: theme[mode].btnActiveColor,
    borderRadius: 5
  },

  passive: {
    backgroundColor: theme[mode].btnPassiveColor,
    //borderRadius: 5,
  },

  btnText: {
    fontSize: 12,
  },

  txt: {
    fontSize: 12,
    color: theme[mode].textblack
  },

  activeText: {
    fontWeight: "700",
    color: theme[mode].lightblue
  },

  passiveText: {
    fontWeight: "400",
    color: theme[mode].textblack
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 45,
  },
  avalibleContainer: {
    flex: 1,
    flexDirection: "column",
    marginBottom: 5
  },
  totalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  avalibleText: {
    color: theme[mode].textblack
  },
  totalText: {
    color: theme[mode].textblack,
    alignSelf: 'flex-end'
  },
  price: {
    fontSize: 48,
    color: theme[mode].lightblue,
    fontWeight: "500",
    marginRight: 5
  },

  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25
  },

  btn: {
    marginTop: 10,
    marginBottom: 20
  }


});
