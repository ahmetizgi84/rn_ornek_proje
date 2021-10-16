import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import I18n from '../../lang/_i18n'

import InputText from '../../components/InputText'

import { theme, } from '../../constants/ThemeStyle';
import { Context as ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/Button';
import Toast, { callToast } from '../../components/Toast';
import { Context as AuthContext } from '../../context/AuthContext';
import HeaderLogin from '../../components/HeaderLogin';

const TwoFactorScreen = ({ navigation, route }) => {

  const { state: { mode, language } } = useContext(ThemeContext);
  const styles = setStyle(mode);
  const { _loginHandler } = useContext(AuthContext);
  const [twoFactorCodein, setTwoFactorCodein] = useState("");
  const { object } = route.params
  const [toastMessage, setToastMessage] = useState(null)

  const setTwoFactorCodeinHandler = value => {
    setTwoFactorCodein(value);
  };

  const enableDisableTwoFactory = async () => {
    const response = await _loginHandler({ ...object, "otp_code": twoFactorCodein });
    console.log(response)
     try {
      if (response && response.errors && response.errors[0]) {
        let messageCode = response.errors[0].split('.').join('_');
        messageNew = I18n.t('account.' + messageCode)
        setToastMessage(messageNew);
        if (toastMessage != null)
          callToast();
      } 
    } catch (error) {
       console.log("enableDisableTwoFactory :",error)
    }

  }

  return (
    <View style={{ flex: 1, backgroundColor: theme[mode].bg }}>
      <HeaderLogin navigation={navigation} />

      <ScrollView nestedScrollEnabled={false}  style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, }} keyboardShouldPersistTaps="handled">
        {toastMessage && <Toast message={toastMessage} type={"danger"} />}

        <View style={{ flex: 1, marginBottom: 0, paddingHorizontal: 10, justifyContent: "center", }}>

          <View style={{ paddingVertical: 5, }}>
            <Text style={styles.inpTitle}>
              {I18n.t('account.twoFactorCodein')}
            </Text>
            <InputText
              isEmpty={false}
              placeholder={I18n.t('account.twoFactorCodein')}
              onChangeText={onChangeText => setTwoFactorCodeinHandler(onChangeText.trim())}
              inputStyle={{
                fontSize: 14
              }}
              amountValue={twoFactorCodein}

            />
          </View>

          {/*  */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 20,
          }}>
            <Button title={I18n.t('account.goOn')}
              btnLg
              btnPrimary
              disabled={(twoFactorCodein.length < 4)}
              callback={() => {
                enableDisableTwoFactory();

              }} />
          </View>
        </View>
      </ScrollView>
    </View >
  );
};

export default TwoFactorScreen;

const setStyle = mode => ({
  title: {
    alignSelf: 'center',
    width: 260,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 12,
    color: theme[mode].textblack,
  },

  passwordView: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  password1: {
    color: theme[mode].textDimColor,
    marginRight: 10,
  },
  password2: {
    color: theme[mode].textShineColor,
    fontWeight: '500',
  },

  pressable: {
    padding: 8,
  },
  cekContainer: {
    flex: 1,
    padding: 10,
  },
  qrCode: {
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 30
  },
  title: {
    color: theme[mode].lightblue,
    left: 15,
    fontSize: 18,
    fontWeight: "500",
  },

  inpTitle: {
    color: theme[mode].textblack,
    fontSize: 10,
    marginBottom: 5,
  },

  modalContainer: {
    //backgroundColor: theme[mode].bg,
    backgroundColor: theme[mode].white,
    ...theme.shadow,
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },

  modalHeader: {
    alignItems: "center",
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",

  },

  modalCloseBtn: {
    padding: 2,
    backgroundColor: theme[mode].bg,
    borderRadius: 5
  },
})



