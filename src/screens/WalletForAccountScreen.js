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
    return null
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

const WalletForAccountScreen = ({ navigation }) => {
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
    <Layout nodrawer>
      <ProfileCard />
      <Card>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{I18n.t('walletScreen.estimated', { locale: language })}</Text>
          <Text style={styles.tl}>{formatMoney(walletTL)} ₺</Text>
          <Text style={styles.btc}>{parseFloat(walletBTC).toFixed(6)} BTC</Text>
        </View>
      </Card>

      <View style={styles.thead}>
        <View style={{ flex: 1 }} />
        <Text style={styles.theadText}>{I18n.t('walletScreen.chill', { locale: language })}</Text>
        <Text style={styles.theadText}>{I18n.t('walletScreen.total', { locale: language })}</Text>
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

export default WalletForAccountScreen;


export class RenderItemComponent extends React.PureComponent {
  static contextType = ThemeContext;

  render() {
    const { item, toggleModal } = this.props
    const { state: { mode } } = this.context;
    const styles = setStyle(mode);
    return (
      <TouchableOpacity style={styles.row} onPress={() => toggleModal(item.id)}>
        <View style={{ flex: 1 }}>
          {UpperKelime(item.id)}
        </View>
        <Text style={[styles.itemText, { color: theme[mode].textblack }]}>{item.title}</Text>
        <Text style={[styles.itemText, { color: theme[mode].textblack }]}>{item.id == 'try' ? formatMoney(item.balance) : item.balance}</Text>
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





/*
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal'
import I18n from '../lang/_i18n'
import { useFocusEffect } from "@react-navigation/native";

import HeaderLogin from '../components/HeaderLogin';
import Card from '../components/Card'
import InputText from '../components/InputText'
import Clipboard from '@react-native-clipboard/clipboard';
import Toast, { callToast } from '../components/Toast';
import SkeletonLoaderWallet from '../components/SkeletonLoaderWallet';
import { X, Copy, Tl, Akbank, Btc, Eth, Uni, Xrp, Usdt, Link } from '../components/svg'

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import { SocketContext } from '../context/SocketContext';
import { DataContext } from '../context/DataContext';
import Button from '../components/Button';
import ProfileCard from '../components/ProfileCard';
import { Context as AuthContext } from '../context/AuthContext';

const bankData = [
  {
    id: 0,
    bankName: 'Akbank',
    logo: <Akbank height="20" />,
    priceType: 'TRY (Türk Lirası)',
    accountName: 'AS GLOBAL BİLiŞiM TEKNOLOJİ YATIRIM ÜRETİM PAZARLAMA İHRACAT ANONİM ŞİRKETİ',
    ibanNo: 'TR72 0004 6006 3088 8000 1072 18',
  },
];

const svgData = {
  'btc': <Btc />,
  'xrp': <Xrp />,
  'eth': <Eth />,
  'link': <Link />,
  'uni': <Uni />,
  'usdt': <Usdt />,
}

const WalletForAccountScreen = ({ route, navigation }) => {
  const { page, event } = route.params
  const { state: { mode, language } } = useContext(ThemeContext);
  const { walletTL, walletBTC, walletList, _getWalletList } = useContext(DataContext)
  const styles = setStyle(mode);
  const [isModalVisible, setModalVisible] = useState(false);
  const [clickedItem, setClickedItem] = useState(null)
  const { state: { userData } } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(false);

  const toggleModal = (id) => {
    const item = walletList.find(i => i.id === id)
    setClickedItem(item)
    setModalVisible(!isModalVisible);
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
      if (event)
        toggleModal('try')
    }, [])
  );

  useEffect(async () => {
    userData&&  userData.labels.find(function (item, index) {
      if (item.key == 'profile') {
        if (item.value == 'enabled') {
          setUserProfile(true);
        }
        else if (item.value == 'verified') {
          setUserProfile(true);
        }
        else if (item.value == 'drafted') {
          setUserProfile(false);
        }
        else if (item.value == 'rejected') {
          setUserProfile(false);
        }
        else setUserProfile(false);
      }

    });
  }, [userData]);

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme[mode].bg,
    }}>
      <HeaderLogin settings navigation={navigation} />
      <ProfileCard />
      <Card>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{I18n.t('walletScreen.estimated', { locale: language })}</Text>
          <Text style={styles.tl}>{parseFloat(walletTL).toFixed(3)} TL</Text>
          <Text style={styles.btc}>{parseFloat(walletBTC).toFixed(6)} BTC</Text>
        </View>
      </Card>

      <View style={styles.thead}>
        <View style={{ flex: 1 }} />
        <Text style={styles.theadText}>{I18n.t('walletScreen.chill', { locale: language })}</Text>
        <Text style={styles.theadText}>{I18n.t('walletScreen.total', { locale: language })}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={walletList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>

      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.20}
        hasBackdrop={true}
        useNativeDriver={true}
        style={{ flex: 1, margin: 0, marginHorizontal: 10 }}
      >
        <ChildModal
          mode={mode}
          language={language}
          callback={() => setModalVisible(false)}
          item={clickedItem}
          event={event}
          userProfile={userProfile}
        />
      </Modal>
    </View>
  );

}


export default WalletForAccountScreen;


export class RenderItemComponent extends React.PureComponent {

  static contextType = ThemeContext;
  render() {
    const { item, toggleModal } = this.props
    const { state: { mode } } = this.context;
    const styles = setStyle(mode);
    return (
      <TouchableOpacity style={styles.row} onPress={() => toggleModal(item.id)}>
        <View style={{ flex: 1 }}>
          {
            item.id == 'try' ?
              <View style={styles.circle}><Tl width='16' height='22' color='white' /></View> :
              // <SvgUri width="24" height="24" uri={item.svg} />
              svgData[item.svg]
          }
        </View>
        <Text style={[styles.itemText, { color: theme[mode].textblack }]}>{item.title}</Text>
        <Text style={[styles.itemText, { color: theme[mode].textblack }]}>{item.balance}</Text>
      </TouchableOpacity>
    )
  }

  static contextType = ThemeContext;
  render() {
    const { item, toggleModal } = this.props
    const { state: { mode } } = this.context;
    const styles = setStyle(mode);
    return (
      <TouchableOpacity style={styles.row} onPress={() => toggleModal(item.id)}>
        <View style={{ flex: 1 }}>
          {
            item.id == 'try' ?
              <View style={styles.circle}><Tl width='16' height='22' color='white' /></View> :
              // <SvgUrik width="24" height="24" uri={item.svg} />
              svgData[item.svg]
          }
        </View>
        <Text style={[styles.itemText, { color: theme[mode].textblack }]}>{item.title}</Text>
        <Text style={[styles.itemText, { color: theme[mode].textblack }]}>{item.balance}</Text>
      </TouchableOpacity>
    )
  }

}





const ChildModal = ({ ...props }) => {

  const { _adresCryptoOlustur } = useContext(SocketContext)
  const styles = setStyle(props.mode);
  const [isActive, setIsActive] = useState((props.event == "cek" ? true : false));
  const [choosed, setChoosed] = useState("erc")

  const [ibanAddr, setIbanAddr] = useState("")
  const [addressTag, setAddressTag] = useState("")
  const [amount, setAmount] = useState("")

  const copyHandler = (data) => {
    Clipboard.setString(data)
    callToast()
  }
  const copyMax = (data) => {
    setAmount(data)
  }

  let walletAddressSplit = []
  if (props.item.deposites) {
    walletAddressSplit = props.item.deposites.address.split("?dt=")
  }


  return (
    <View style={styles.modalContainer}>
      <ScrollView keyboardShouldPersistTaps="handled">

        <Toast message='Kopyalandı' type='success' />
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={props.modalCloseBtn}>
            <X color={theme[props.mode].textblack} />
          </TouchableOpacity>
        </View>

        <View style={styles.cekYatir}>
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            {
              props.item.id == 'try' ?
                <View style={styles.circle}><Tl width='16' height='22' color='white' /></View> :
                // <SvgUri width="24" height="24" uri={props.item.svg} />
                svgData[props.item.svg]
            }
            <Text style={{ color: theme[props.mode].textblack, marginLeft: 5, fontSize: 10 }}>{props.item.title.toUpperCase()}</Text>
          </View>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
            <Pressable style={[styles.sellBuyBtn, isActive ? styles.active : styles.passive]} onPress={() => setIsActive(true)} >
              <Text style={[styles.btnText, isActive ? styles.activeText : styles.passiveText]}>{I18n.t('walletScreen.get', { locale: props.language })}</Text>
            </Pressable>
            <Pressable style={[styles.sellBuyBtn, !isActive ? styles.active : styles.passive]} onPress={() => setIsActive(false)}>
              <Text style={[styles.btnText, !isActive ? styles.activeText : styles.passiveText]}>{I18n.t('walletScreen.set', { locale: props.language })}</Text>
            </Pressable>
          </View>
        </View>

        {
          props.item.id == 'try' ? null :
            props.item.id == 'xrp' ? null :
              props.item.id == 'btc' ? null :
                <View style={{
                  flexDirection: "row",
                  marginBottom: 10,
                }}><Button title="ERC 20" btnSm btnDefault btnBlack={choosed === "erc" && true} btnBordered callback={() => setChoosed("erc")} />
                </View>
        }

        {
          isActive ? (
            props.item.deposit_enabled ?
              props.userProfile ?
                (<View style={styles.cekContainer}>
                  <View>
                    <Text style={styles.inpTitle}>
                      {I18n.t('walletScreen.addr', { locale: props.language })}{props.item.id == 'try' ? <Text>IBAN</Text> : props.item.id.toUpperCase()}{I18n.t('walletScreen.addr2', { locale: props.language })}
                    </Text>

                    <InputText
                      keyboardType="email-address"
                      capitalize="characters"
                      onChangeText={(txt) => setIbanAddr(txt.trim())}
                      isEmpty={false}
                      dirty
                      amountValue={ibanAddr}
                    />
                  </View>

                  <View style={{
                    marginBottom: 10
                  }}>
                    <View style={{ flexDirection: 'row' }}>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.inpTitle}>
                          {I18n.t('walletScreen.amount', { locale: props.language })}
                        </Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={styles.inpTitle2}>
                          {I18n.t('easyScreen.avalible', { locale: props.language })}:{props.item.balance} {props.item.id.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <InputText
                      keyboardType="number-pad"
                      onChangeText={onChangeText => setAmount(onChangeText.trim())}
                      isEmpty={false}
                      green
                      amountValue={amount}
                      rightIcon={<TouchableOpacity
                        onPress={() => copyMax(props.item.balance)}>
                        <Text style={{ color: theme[props.mode].green }}>Max.</Text>
                      </TouchableOpacity>}
                    />
                  </View>

                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: 20,
                  }}>
                    <Button title={I18n.t('walletScreen.btnTitle', { locale: props.language })} btnLg btnSuccess />
                  </View>

                  <View>
                    <Text style={{ color: theme[props.mode].textblack, fontSize: 10, fontWeight: "500" }}>{I18n.t('walletScreen.desc1', { locale: props.language })}</Text>
                    <Text style={{ color: theme[props.mode].textblack, fontSize: 10, fontWeight: "400" }}>{I18n.t('walletScreen.desc2', { locale: props.language })}{I18n.t('walletScreen.desc3', { locale: props.language })}</Text>
                  </View>
                </View>
                ) : <Text style={styles.notProfil}>{I18n.t('walletScreen.deposite_Not_Profile', { locale: props.language })}</Text>
              : (
                <View style={styles.disabled}>
                  <Text style={{ color: theme[props.mode].textblack }}>{I18n.t('walletScreen.deposite_enabled', { locale: props.language })}</Text>
                </View>
              )
          ) : (
            props.item.withdrawal_enabled ? (

              props.item.id == 'try' ?
                props.userProfile ? (<View >
                  <View>{bankData[0].logo}</View>
                  <View><Text style={styles.priceType}>{bankData[0].priceType}</Text></View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.accountName}>{bankData[0].accountName}</Text>
                    <TouchableOpacity onPress={() => copyHandler(bankData[0].accountName)} style={{ width: 30 }}>
                      <Copy style={{ color: theme[props.mode].inputIconColor, alignItems: "flex-end" }} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.ibanNo}>{bankData[0].ibanNo}</Text>
                    <TouchableOpacity onPress={() => copyHandler(bankData[0].ibanNo)} style={{ width: 30 }}>
                      <Copy style={{ color: theme[props.mode].inputIconColor, alignItems: "flex-end" }} />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text style={styles.deposite_title}>{I18n.t('walletScreen.deposite_title', { locale: props.language })}</Text>
                    <Text style={styles.deposite_li}>1. {I18n.t('walletScreen.deposite_li1', { locale: props.language })}</Text>
                    <Text style={styles.deposite_li}>2. {I18n.t('walletScreen.deposite_li2', { locale: props.language })}</Text>
                    <Text style={styles.deposite_li}>3. {I18n.t('walletScreen.deposite_li3', { locale: props.language })}</Text>
                    <Text style={styles.deposite_li}>4. {I18n.t('walletScreen.deposite_li4', { locale: props.language })}</Text>
                    <Text style={styles.deposite_li}>5. {I18n.t('walletScreen.deposite_li5', { locale: props.language })}</Text>
                  </View>

                </View>)
                    : <Text style={styles.notProfil}>{I18n.t('walletScreen.deposite_Not_Profile', { locale: props.language })}</Text>

                :
                (
                  props.item.deposites ? (
                    <View style={styles.yatirContainer}>
                      <View style={styles.qrCode}>
                        <QRCode
                          value={props.item.deposites && walletAddressSplit[0]}
                          logoSize={112}
                        />
                      </View>
                      <View style={{ marginBottom: 38 }}>

                        <Text style={{ fontSize: 9 }}>{I18n.t('walletScreen.deposite_input', { locale: props.language })}</Text>
                        <InputText
                          keyboardType="email-address"
                          onChangeText={onChangeText => setAddress(onChangeText.trim())}
                          isEmpty={false}
                          dirty
                          amountValue={props.item.deposites && walletAddressSplit[0]}
                          rightIcon={
                            <TouchableOpacity
                              onPress={() => copyHandler(props.item.deposites && walletAddressSplit[0])}>
                              <Copy color={theme[props.mode].inputIconColor} />
                            </TouchableOpacity>
                          }
                        />
                        {
                          props.item.id.toLowerCase() == 'xrp' ?
                            <View>
                              <Text style={{ fontSize: 9 }}>{I18n.t('walletScreen.deposite_tag', { locale: props.language })}</Text>
                              <InputText
                                keyboardType="email-address"
                                onChangeText={onChangeText => setAddressTag(onChangeText.trim())}
                                isEmpty={false}
                                dirty
                                amountValue={props.item.deposites && walletAddressSplit[1]}
                                rightIcon={
                                  <TouchableOpacity
                                    onPress={() => copyHandler(props.item.deposites && walletAddressSplit[1])}>
                                    <Copy color={theme[props.mode].inputIconColor} />
                                  </TouchableOpacity>
                                }
                              />
                            </View>
                            : null

                        }
                      </View>
                      <View>
                        <Text style={{ color: theme[props.mode].textblack, fontSize: 10, fontWeight: "500" }}>{I18n.t('walletScreen.desc1', { locale: props.language })}</Text>
                        <Text style={{ color: theme[props.mode].textblack, fontSize: 10, fontWeight: "400" }}>{I18n.t('walletScreen.desc2', { locale: props.language })}{I18n.t('walletScreen.desc3', { locale: props.language })}</Text>
                      </View>
                    </View>
                  ) : (

                    <View style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginBottom: 20,
                    }}>
                      <Button callback={() => _adresCryptoOlustur(props.item.id)} title={I18n.t('walletScreen.btnAdresOlustur', { locale: props.language })} btnLg btnSuccess />
                    </View>
                  )
                )
            ) : (
              <View style={styles.disabled}>
                <Text style={{ color: theme[props.mode].textblack }}>{I18n.t('walletScreen.withdraw_enabled', { locale: props.language })}</Text>
              </View>
            )

          )
        }

      </ScrollView>
    </View>
  )

}



const setStyle = mode => ({

  inp: {
    backgroundColor: theme[mode].cardinputdirty,
    borderRadius: 8,
    height: 42,
    color: theme[mode].textblack,
    paddingHorizontal: 20
  },
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

  cekContainer: {
    flex: 1,
    padding: 10,
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

  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 500,
    backgroundColor: theme[mode].white,
    ...theme.shadow,
    padding: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderWidth: 0.5,
    borderColor: theme[mode].inputbordercolor,
    flex: 1
  },

  modalHeader: {
    alignItems: "flex-end",
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderColor: theme[mode].searchInputBorderColor,
    marginBottom: 5,
  },

  modalCloseBtn: {
    padding: 2,
    backgroundColor: theme[mode].bg,
    borderRadius: 5
  },

  cekYatir: {
    paddingVertical: 10,
    paddingRight: 2,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },

  circle: {
    borderRadius: 30,
    width: 30,
    height: 30,
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
    //paddingVertical: 10,
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

  nodata: {
    paddingHorizontal: 5,
    paddingVertical: 12,
  },


  sellBuyBtn: {
    width: 91.25,
    //paddingHorizontal: 35,
    paddingVertical: 5,
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
    borderRadius: 5,
  },

  btnText: {
    fontSize: 12,
  },

  activeText: {
    fontWeight: "700",
    color: theme[mode].lightblue
  },

  passiveText: {
    fontWeight: "400",
    color: theme[mode].textblack
  },

  inpTitle: {
    color: theme[mode].textblack,
    fontSize: 10,
    marginBottom: 5,
  },

  inpTitle2: {
    color: theme[mode].textblack,
    fontSize: 10,
    marginBottom: 5
  },

  qrCode: {
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 30
  },

  priceType: {
    fontSize: 10,
    color: theme[mode].textblack,
    marginTop: 10,
    marginBottom: 10
  },

  accountName: {
    flex: 1,
    color: theme[mode].textblack,
    fontSize: 12,
    marginBottom: 10
  },

  ibanNo: {
    flex: 1,
    color: theme[mode].textblack,
    fontSize: 15,
    fontWeight: 'bold'
  },

  deposite_title: {
    marginTop: 20,
    fontSize: 9,
    color: theme[mode].textblack,
  },

  deposite_li: {
    marginTop: 5,
    fontSize: 8,
    color: theme[mode].textblack,
  },

  disabled: {
    marginTop: 30,
    marginBottom: 30,
    marginHorizontal: 80,
    justifyContent: "center",
    alignItems: "center",
  }

})

*/
