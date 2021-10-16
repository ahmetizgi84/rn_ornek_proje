import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';

import I18n from '../lang/_i18n'
import HeaderLogin from '../components/HeaderLogin';
import ProfileCard from '../components/ProfileCard';
import UAParser from '../helpers/UAParser';

import Card from '../components/Card'
import { Vector, Check, Ordericon } from '../components/svg'

import { theme, } from '../constants/ThemeStyle';
import { Context as ThemeContext } from '../context/ThemeContext';
import Button from '../components/Button';
import AccountScreenModal from './AccountScreenModal';

import { Context as AuthContext } from '../context/AuthContext';
import { _getLoginActivityData, _getWalletList } from '../context/AccountDataApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from '../components/Layout';

export function VirtualizedView({ children }) {
  return (
    <FlatList
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      listKey={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={() => (
        <React.Fragment>{children}</React.Fragment>
      )}
    />
  );
}

const AccountScreen = ({ navigation }) => {
  const _isMounted = useRef(true)
  const { state: { mode, language } } = useContext(ThemeContext);
  // const { walletBTC, walletTL, walletList, activityData, _getLoginActivityData } = useContext(AccountDataApi)
  const styles = setStyle(mode);
  const [userWallet, setUserWallet] = useState(null);
  const [activityData, setActivityData] = useState(null);

  const [securtyType, setSecurtyType] = useState("");
  const [securtyModal, setSecurtyModal] = useState(false);
  const { state: { userData } } = useContext(AuthContext);
  const [userOTP, setUserOTP] = useState(false);
  const [securtyCount, seSecurtyCount] = useState(0);
  const [userEmail, setUserEmail] = useState({ enabled: false, value: "verify" });
  const [userPhone, setUserPhone] = useState({ enabled: false, value: "verify" });
  const [userProfile, setUserProfile] = useState({ enabled: false, value: "verify" });
  const [userDocument, setUserDocument] = useState({ enabled: false, value: "verify" });
  const [userAdress, setUserAdress] = useState({ enabled: false, value: "verify" });
  const [loader, setLoader] = useState(true);

  useEffect(async () => {
    if (_isMounted.current) {
      await refreshControl()
    }
  }, [userData]);

  const refreshControl = async () => {
    setLoader(true)
    const response = await _getLoginActivityData()
    setActivityData(response);
    const alertLoginShow = await loginControle(response)
    if (alertLoginShow > 0) {
      const mesage1 = I18n.t('account.login_failed_alert_text1', { locale: language })
      const mesage2 = I18n.t('account.login_failed_alert_text2', { locale: language })
      Alert.alert(JSON.stringify(mesage1 + ' ' + alertLoginShow + ' ' + mesage2));
    }

    const response1 = await _getWalletList()
    setUserWallet(response1);
    var count = 0;

    userData.labels.find(function (item, index) {
      if (item.key == 'otp') {
        setUserOTP(true);
      }

      if (item.key == 'email') {
        if (item.value == 'enabled') {
          count++
          setUserEmail({ enabled: true, value: "enabled" });
        }
        else if (item.value == 'verified') {
          count++
          setUserEmail({ enabled: true, value: "verified" });
        }
        else if (item.value == 'drafted') {
          setUserEmail({ enabled: false, value: "drafted" });
        }
        else if (item.value == 'rejected') {
          setUserEmail({ enabled: false, value: "rejected" });
        }
        else setUserEmail({ enabled: false, value: "verify" });

      }

      if (item.key == 'phone') {
        if (item.value == 'enabled') {
          count++
          setUserPhone({ enabled: true, value: "enabled" });
        }
        else if (item.value == 'verified') {
          count++
          setUserPhone({ enabled: true, value: "verified" });
        }
        else if (item.value == 'drafted') {
          setUserPhone({ enabled: false, value: "drafted" });
        }
        else if (item.value == 'rejected') {
          setUserPhone({ enabled: false, value: "rejected" });
        }
        else setUserPhone({ enabled: false, value: "verify" });


      }

      if (item.key == 'profile') {

        if (item.value == 'enabled') {
          count++
          setUserProfile({ enabled: true, value: "enabled" });
        }
        else if (item.value == 'verified') {
          count++
          setUserProfile({ enabled: true, value: "verified" });
        }
        else if (item.value == 'drafted') {
          setUserProfile({ enabled: false, value: "drafted" });
        }
        else if (item.value == 'rejected') {
          setUserProfile({ enabled: false, value: "rejected" });
        }
        else setUserProfile({ enabled: false, value: "verify" });

      }
      if (item.key == 'document') {

        if (item.value == 'enabled') {
          count++
          setUserDocument({ enabled: true, value: "enabled" });
        }
        else if (item.value == 'verified') {
          count++
          setUserDocument({ enabled: true, value: "verified" });
        }
        else if (item.value == 'drafted') {
          setUserDocument({ enabled: false, value: "drafted" });
        }
        else if (item.value == 'rejected') {
          setUserDocument({ enabled: false, value: "rejected" });
        }
        else setUserDocument({ enabled: false, value: "verify" });

      }

      if (item.key == 'address') {

        if (item.value == 'enabled') {
          count++
          setUserAdress({ enabled: true, value: "enabled" });
        }
        else if (item.value == 'verified') {
          count++
          setUserAdress({ enabled: true, value: "verified" });
        }
        else if (item.value == 'drafted') {
          setUserAdress({ enabled: false, value: "drafted" });
        }
        else if (item.value == 'rejected') {
          setUserAdress({ enabled: false, value: "rejected" });
        }
        else setUserAdress({ enabled: false, value: "verify" });

      }
      seSecurtyCount(count);
    });

    setLoader(false)
  }
  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, [])

  const userAgentParse = (data) => {
    var info = data;
    try {
      var parser = new UAParser();
      info = parser.setUA(data).getResult();
    } catch (error) {
      console.log(error)
    }

    return info.browser.name ? (info.browser.name + " - " + (info.device.model == undefined ? info.os.name : info.device.model)) : null
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={() => console.log()}>
      {/* <View >{item.svg}</View> */}
      <Text style={[styles.itemText, { color: theme[mode].textblack }]}>{item.title}</Text>
      <Text style={[styles.itemText, { color: theme[mode].green }]}>{item.id == 'try' ? formatMoney(item.balance) : item.balance}</Text>
    </TouchableOpacity>
  );

  const loginControle = async (userActivity) => {
    var counter = 0
    var failedAttemptList = []
    const loginAlert_Get = await AsyncStorage.getItem("loginAlert");

    for (var entry of userActivity) {
      if (entry.action === "login") {
        if (counter > 1) {
          break;
        }
        if (entry.result === "failed") {
          failedAttemptList.push(entry.id)

        }
        else if (entry.result === "succeed") {
          counter += 1
        }
      }
    }

    if (loginAlert_Get != JSON.stringify(failedAttemptList)) {
      await AsyncStorage.setItem("loginAlert", JSON.stringify(failedAttemptList));
    } else {
      return 0
    }

    return failedAttemptList.length;
  }

  const renderItemLastActivity = ({ item, index }) => (
    <View style={[styles.row, { paddingVertical: 7 }]}>

      <View  >
        <Text style={styles.itemTitle}>{I18n.t('account.login_' + item.result, { locale: language })} </Text>
        <Text style={styles.itemSub}>{userAgentParse(item.user_agent)}</Text>
      </View>

      <View  >
        <Text style={[styles.itemTitle, { textAlign: "right" }]}>{item.user_ip}</Text>
        <Text style={[styles.itemSub, { textAlign: "right" }]}>{(new Date(item.created_at)).toUTCString()}</Text>
      </View>
    </View>
  );


  const formatMoney = (n) => {
    return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').replace(/\.(\d+)$/, ',$1');
  }

  const listEmpty = () => {
    return (
      <View style={styles.nodata}>
        <Text>{I18n.t('walletScreen.norec', { locale: language })}</Text>
      </View>
    )
  }
  const setSecurtyModalFunc = () => {
    setSecurtyModal(false)
    if (securtyModal) {
      refreshControl()
    }
  }
  const closeModalFunc = () => {
    setSecurtyModal(false)
  }
  const securtyModelOpen = (type) => {
    setSecurtyModal(true)
    setSecurtyType(type)
  }

  return (
    <Layout nodrawer>

      {loader ? <ActivityIndicator style={{ flex: 1 }} size="large" color={theme[mode].lightblue} />
        :
        <VirtualizedView  >
          <View style={{ paddingBottom: 10 }}>
            {/* TODO : Profil */}
            <ProfileCard />


            {/* TODO : Hesap Bakiyesi */}
            <Card  >
              <View style={{ padding: 10 }}>
                <Text style={styles.title}>{I18n.t('account.balance', { locale: language })}</Text>
                <View style={{ flexDirection: "row", alignSelf: "flex-end", paddingVertical: 15 }}>
                  <Button containerStyle={{ height: 24 }} textStyle={{ fontWeight: "700", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 12 }} title={I18n.t('account.depositMoney', { locale: language })} btnSm btnLightBlue callback={() => navigation.navigate('WalletForAccount', { page: "Account", event: "yatir" })} />
                  <View style={{ width: 5.75 }} />
                  <Button containerStyle={{ height: 24 }} textStyle={{ fontWeight: "700", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 12 }} title={I18n.t('account.withdrawMoney', { locale: language })} btnSm btnDarkBlue callback={() => navigation.navigate('WalletForAccount', { page: "Account", event: "cek" })} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 5 }}>

                  <Text style={styles.btc}>BTC</Text>
                  <Text style={styles.btc}>{parseFloat(userWallet && userWallet.walletBTC).toFixed(6)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 5 }}>
                  <Text style={styles.try}>TRY</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.tl}>{formatMoney(userWallet && userWallet.walletTL)}</Text>
                    <Text style={styles.tl}> ₺</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 15 }}>

                  <Text style={[styles.degisim, { color: userWallet && userWallet.total_24h_percent > 0 ? theme[mode].lightblue : theme[mode].red }]}>{I18n.t('account.daily_change', { locale: language })}  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.percent24, { color: userWallet && userWallet.total_24h_percent > 0 ? theme[mode].lightblue : theme[mode].red }]}>% {userWallet && userWallet.total_24h_percent != null && userWallet.total_24h_percent.toFixed(2)}</Text>
                    <Text style={[styles.tl, { color: userWallet && userWallet.total_24h_percent > 0 ? theme[mode].lightblue : theme[mode].red }]}> {formatMoney(userWallet && userWallet.total_24h)}</Text>
                  </View>
                </View>

                <FlatList
                  nestedScrollEnabled={false}
                  data={userWallet && userWallet.walletList && userWallet.walletList.sort((a, b) => b.balance - a.balance).slice(0, 5)}
                  keyExtractor={(item, index) => 'v' + index.toString()}
                  listKey={(item, index) => 'v' + index.toString()}
                  renderItem={renderItem}
                  ListEmptyComponent={listEmpty}
                  ListFooterComponent={
                    <TouchableOpacity style={{ flexDirection: "row", alignSelf: "flex-end", paddingVertical: 10 }} onPress={() => navigation.navigate('WalletForAccount', { page: "", event: "" })}>
                      <Text style={styles.theadText}>{I18n.t('account.other', { locale: language })}</Text>
                    </TouchableOpacity>
                  }
                />
              </View>
            </Card>

            {/* TODO : Güvenlik */}

            <Card  >
              <View style={{ padding: 10 }}>
                <Text style={styles.title}>{I18n.t('account.security', { locale: language })}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, alignItems: "center" }}>
                  <Text style={styles.securityScore}>{I18n.t('account.securityScore')}</Text>
                  <View style={{ flexDirection: "row", }}>

                    <Vector
                      width={15.75}
                      height={18}
                      style={{ right: 3, alignSelf: "center" }}
                      color={theme[mode].green}
                      onPress={() => console.log()}
                    />
                    <Text style={styles.percentage}>{((100 / 5) * securtyCount).toFixed()}</Text>
                  </View>
                </View>
                <View style={[styles.row,]}>
                  <View  >
                    <Text style={styles.itemTitle}>{I18n.t('account.emailAdres', { locale: language })}</Text>
                    <Text style={styles.itemSub}>{I18n.t('account.withdrawalsAllowed', { locale: language })}</Text>
                  </View>
                  <Check
                    width={24.95}
                    height={18.64}
                    style={{ right: 35, alignSelf: "center" }}
                    color={theme[mode].inputIconColor}
                    onPress={() => console.log()}
                  />

                </View>

                <View style={[styles.row,]}>
                  <View  >
                    <Text style={styles.itemTitle}>{I18n.t('account.phoneNumber', { locale: language })}</Text>
                    <Text style={styles.itemSub}>{I18n.t('account.depositsAllowed', { locale: language })}</Text>
                  </View>
                  {userEmail.enabled && userPhone.enabled ? <Check
                    width={24.95}
                    height={18.64}
                    style={{ right: 35, alignSelf: "center" }}
                    color={theme[mode].inputIconColor}
                    onPress={() => console.log()}
                  /> :
                    <Button disabled={!(userEmail.enabled)} containerStyle={{ height: 24 }} textStyle={{ fontWeight: "700", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 12 }} title={I18n.t('account.' + userPhone.value, { locale: language })} btnSm btnLightBlue callback={() => securtyModelOpen("phoneNumber")} />





                  }
                </View>

                <View style={[styles.row,]}>
                  <View  >
                    <Text style={styles.itemTitle}>{I18n.t('account.completeProfile', { locale: language })}</Text>
                    <Text style={styles.itemSub}>{I18n.t('account.profileInformation', { locale: language })}</Text>
                  </View>
                  {
                    userPhone.enabled && userProfile.enabled ? <Check
                      width={24.95}
                      height={18.64}
                      style={{ right: 35, alignSelf: "center" }}
                      color={theme[mode].inputIconColor}
                      onPress={() => console.log()}
                    /> :
                      <Button disabled={!(userPhone.enabled) || userProfile.value == "drafted"} containerStyle={{ height: 24 }} textStyle={{ fontWeight: "700", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 12 }} title={I18n.t('account.' + userProfile.value, { locale: language })} btnSm btnLightBlue callback={() => securtyModelOpen("completeProfile")} />


                  }
                </View>

                <View style={[styles.row,]}>
                  <View  >
                    <Text style={styles.itemTitle}>{I18n.t('account.verifyIdentity', { locale: language })}</Text>
                    <Text style={styles.itemSub}>{I18n.t('account.increaseWithdrawalLimit10', { locale: language })}</Text>
                  </View>
                  {
                    userProfile.enabled && userDocument.enabled ? <Check
                      width={24.95}
                      height={18.64}
                      style={{ right: 35, alignSelf: "center" }}
                      color={theme[mode].inputIconColor}
                      onPress={() => console.log()}
                    /> :
                      <Button disabled={!(userProfile.enabled) || userDocument.value == "drafted"} containerStyle={{ height: 24 }} textStyle={{ fontWeight: "700", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 12 }} title={I18n.t('account.' + userDocument.value, { locale: language })} btnSm btnLightBlue callback={() => securtyModelOpen("verifyIdentity")} />


                  }
                </View>

                <View style={[styles.row,]}>
                  <View  >
                    <Text style={styles.itemTitle}>{I18n.t('account.verifyResidence', { locale: language })}</Text>
                    <Text style={styles.itemSub}>{I18n.t('account.increaseWithdrawalLimit100', { locale: language })}</Text>
                  </View>
                  {
                    userDocument.enabled && userAdress.enabled ? <Check
                      width={24.95}
                      height={18.64}
                      style={{ right: 35, alignSelf: "center" }}
                      color={theme[mode].inputIconColor}
                      onPress={() => console.log()}
                    /> : <Button disabled={!(userDocument.enabled) || userAdress.value == "drafted"} containerStyle={{ height: 24 }} textStyle={{ fontWeight: "700", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 12 }} title={I18n.t('account.' + userAdress.value, { locale: language })} btnSm btnLightBlue callback={() => securtyModelOpen("verifyAddress")} />


                  }
                </View>

                <View style={[styles.row,]}>
                  <View  >
                    <Text style={styles.itemTitle}>{I18n.t('account.changeLoginPassword', { locale: language })}</Text>
                  </View>
                  <Button containerStyle={{ height: 24 }} textStyle={{ fontWeight: "700", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 12 }} title={I18n.t('account.change', { locale: language })} btnSm btnLightBlue callback={() => securtyModelOpen("changeLoginPassword")} />
                </View>

                <View style={[styles.row,]}>
                  <View  >
                    <Text style={styles.itemTitle}>{I18n.t('account.enable2FA', { locale: language })}</Text>
                    <Text style={styles.itemSub}>{I18n.t('account.notActive', { locale: language })}</Text>
                  </View>
                  <Button containerStyle={{ height: 24 }} textStyle={{ fontWeight: "700", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 12 }} title={userOTP ? I18n.t('account.deActivate', { locale: language }) : I18n.t('account.activate', { locale: language })} btnSm btnLightBlue callback={() => securtyModelOpen("enable2FA")} />
                </View>


              </View>
            </Card>

            {/* TODO : Giriş hereketleri */}
            <Card  >
              <View style={{ padding: 10 }}>
                <Text style={styles.title}>{I18n.t('account.lastActivity', { locale: language })}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 14, alignItems: "center" }}>
                  <Text style={styles.securityScore}>{I18n.t('account.lastActivityWeek', { locale: language })}</Text>

                </View>
                <FlatList
                  nestedScrollEnabled={false}
                  data={activityData}
                  keyExtractor={(item, index) => 'A' + index.toString()}
                  listKey={(item, index) => 'A' + index.toString()}
                  renderItem={renderItemLastActivity}
                  ListEmptyComponent={listEmpty}
                // ListFooterComponent={
                //   <View style={{ flexDirection: "row", alignSelf: "flex-end", paddingVertical: 10 }}>
                //     <Text style={styles.theadText}>Tümü</Text>
                //   </View>
                // }
                />


              </View>
            </Card>


            {/* TODO : İşlem hereketleri */}
            <Card  >
              <View style={{ padding: 15, flexDirection: "row", justifyContent: "space-evenly", }}>
                <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: 240 }}>
                  <View style={{ alignItems: "center", justifyContent: "center", borderRadius: 81, width: 81, height: 81, backgroundColor: theme[mode].lightblueopact, }}>
                    <Ordericon
                      width={26}
                      height={22}
                      color={theme[mode].lightblueD}
                      onPress={() => console.log()}
                    />
                  </View>
                  <View style={{ marginVertical: 10, alignItems: "center", justifyContent: "center", borderRadius: 81, width: 81, height: 81, backgroundColor: theme[mode].lightblueopact, }}>
                    <Ordericon
                      width={26}
                      height={22}
                      color={theme[mode].lightblueD}
                      onPress={() => console.log()}
                    />
                  </View>
                  <View style={{ alignItems: "center", justifyContent: "center", borderRadius: 81, width: 81, height: 81, backgroundColor: theme[mode].lightblueopact, }}>
                    <Ordericon
                      width={26}
                      height={22}
                      color={theme[mode].lightblueD}
                      onPress={() => console.log()}
                    />
                  </View>

                </View>
                <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ justifyContent: "center", height: 81, alignItems: "center" }}>
                    <Text style={styles.textButtonTitle}>{I18n.t('account.openOrders', { locale: language })}</Text>
                    <Button containerStyle={{ height: 24, top: 10, width: 94 }} textStyle={{ fontWeight: "500", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 11 }} title={I18n.t('account.show', { locale: language })} btnSm btnBorderedBlue callback={() => navigation.navigate('OpenOrdersTab')} />

                  </View>
                  <View style={{ marginVertical: 10, justifyContent: "center", height: 81, alignItems: "center", }}>
                    <Text style={styles.textButtonTitle}>{I18n.t('account.transactionHistory', { locale: language })}</Text>
                    <Button containerStyle={{ height: 24, top: 10, width: 94 }} textStyle={{ fontWeight: "500", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 11 }} title={I18n.t('account.show', { locale: language })} btnSm btnBorderedBlue callback={() => navigation.navigate('Transaction')} />

                  </View>
                  <View style={{ justifyContent: "center", height: 81, alignItems: "center" }}>
                    <Text style={styles.textButtonTitle}>{I18n.t('account.purchaseSaleHistory', { locale: language })}</Text>
                    <Button containerStyle={{ height: 24, top: 10, width: 94 }} textStyle={{ fontWeight: "500", fontFamily: (Platform.OS === 'ios') ? 'AppleSDGothicNeo-Thin' : 'Roboto', fontSize: 11 }} title={I18n.t('account.show', { locale: language })} btnSm btnBorderedBlue callback={() => navigation.navigate('History')} />

                  </View>
                </View>

              </View>
            </Card>

            {securtyType != "" && securtyModal &&
              <AccountScreenModal isModalVisible={securtyType == "" ? false : securtyModal} modalCloseBtn={closeModalFunc} closeButton={setSecurtyModalFunc} securtyType={securtyType} userSecurityStatusData={{ userEmail, userPhone, userProfile, userDocument, userAdress, userOTP }} />
            }

          </View>
        </VirtualizedView>
      }
    </Layout>
  );
};

export default AccountScreen;



const setStyle = mode => ({
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

  title: {
    alignItems: "flex-start",
    fontSize: 11,
    color: theme[mode].lightblue,
    marginBottom: 7,
    lineHeight: 13,
  },
  percentage: {
    alignItems: "flex-start",
    fontWeight: "300",
    fontSize: 18,
    lineHeight: 21,
    color: theme[mode].lightblue,
    left: 3
  },
  securityScore: {
    alignItems: "flex-start",
    fontSize: 12,
    lineHeight: 14,
    color: theme[mode].darkblue,
  },

  textButtonTitle: {
    fontSize: 12,
    lineHeight: 14,
    color: theme[mode].textblack,
  },
  itemTitle: {
    alignItems: "flex-start",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 14,
    color: theme[mode].textblack,
  },

  itemSub: {
    top: 1,
    alignItems: "flex-start",
    fontSize: 10,
    lineHeight: 12,
    color: theme[mode].buttontextgray,
  },

  tl: {
    color: theme[mode].lightblue,
    marginBottom: 3,
    alignSelf: "flex-end",
    fontSize: 18,
    fontWeight: "500",
  },
  btc: {
    color: theme[mode].darkblue,
    alignSelf: "flex-end",
    fontWeight: "500",
    fontSize: 24,
  },


  try: {
    color: theme[mode].lightblue,
    alignSelf: "flex-start",
    fontWeight: "500",
    fontSize: 24,
  },

  percent24: {
    color: theme[mode].lightblue,
    alignSelf: "center",
    fontWeight: "400",
    fontSize: 14,
  },

  degisim: {
    color: theme[mode].lightblue,
    alignSelf: "flex-start",
    fontWeight: "400",
    fontSize: 18,
  },

  thead: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
    justifyContent: "space-between",
  },

  theadText: {
    fontSize: 14,
    lineHeight: 13,
    color: theme[mode].darkblue,

  },

  modalContainer: {
    //backgroundColor: theme[mode].bg,
    backgroundColor: theme[mode].white,
    ...theme.shadow,
    padding: 10,
    borderRadius: 8,
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
    paddingRight: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },


  row: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: theme[mode].white,
    marginBottom: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.2,
    borderColor: theme[mode].buttontextgray,
    justifyContent: "space-between"
  },

  itemText: {
    fontSize: 14,
    lineHeight: 13,
  },

  nodata: {
    paddingHorizontal: 5,
    paddingVertical: 12,
  },






})


