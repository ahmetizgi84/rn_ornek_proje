import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal'
import I18n from '../../lang/_i18n';

import Button from '../../components/Button';
import HeaderLogin from '../../components/HeaderLogin';
import InputText from '../../components/InputText';
import { Mail, Password, Eye, Eyeoff } from '../../components/svg';
import Toast from '../../components/Toast'

import { Context as ThemeContext } from '../../context/ThemeContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { theme } from '../../constants/ThemeStyle';

const LoginScreen = ({ navigation }) => {
  const { state: { mode, language } } = useContext(ThemeContext);
  const { _loginHandler, state: { indicator, toastMessage } } = useContext(AuthContext);

  const styles = setStyle(mode);
  const [passwordHide, setPasswordHide] = useState(true);
  const [errors, setErrors] = useState([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const passwordHideFun = () => {
    setPasswordHide(!passwordHide);
  };

  const loginHandler = () => {
    let errs = [];

    if (email === '') {
      errs.push('email');
    }

    if (password === '') {
      errs.push('password');
    }

    if (errs.length) {
      setErrors(errs);
      return;
    }

    const obj = {
      email,
      password,
    };

    _loginHandler(obj, navigation);
  };

  const setEmailHandler = ema => {
    setEmail(ema);
    setErrors([]);
  };

  const setPasswordHandler = pwd => {
    setPassword(pwd);
    setErrors([]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setErrors([]);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: theme[mode].bg }}>
      <Modal
        isVisible={indicator}
        backdropOpacity={0.20}
        hasBackdrop={true}
        animationIn="zoomIn"
        animationOut="zoomOut"
        useNativeDriver={true}
        style={{ alignItems: 'center', margin: 10 }}
      >

        <ActivityIndicator size="large" color={theme[mode].indicatorColor} />
      </Modal>


      <HeaderLogin navigation={navigation} />
      <ScrollView  nestedScrollEnabled={false} keyboardShouldPersistTaps="handled">
        {
          toastMessage === 'email_pending' ? (
            <Toast message={I18n.t('loginPage.toast1', { locale: language })} type={"error"} />
          ) : (
            <Toast message={I18n.t('loginPage.toast2', { locale: language })} type={"error"} />
          )
        }

        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.title}> {I18n.t('loginPage.title', { locale: language })}</Text>
          <InputText
            leftIcon={<Mail width={20} color={theme[mode].inputIconColor} />}
            placeholder={I18n.t('loginPage.inputMail', { locale: language })}
            keyboardType="email-address"
            onChangeText={onChangeText => setEmailHandler(onChangeText.trim())}
            isEmpty={errors.find(err => err === 'email') ? true : false}
            amountValue={email}
          />
          <InputText
            leftIcon={<Password width={20} color={theme[mode].inputIconColor} />}
            rightIcon={
              passwordHide ? (
                <Eye
                  width={20}
                  color={theme[mode].inputIconColor}
                  onPress={() => passwordHideFun()}
                />
              ) : (
                <Eyeoff
                  width={20}
                  color={theme[mode].inputIconColor}
                  onPress={() => passwordHideFun()}
                />
              )
            }
            placeholder={I18n.t('loginPage.inputPasword', { locale: language })}
            passwordHide={passwordHide}
            onChangeText={onChangeText => setPasswordHandler(onChangeText.trim())}
            isEmpty={errors.find(err => err === 'password') ? true : false}
            amountValue={password}
          />
          <Button
            btnLg
            btnPrimary
            title={I18n.t('loginPage.loginButton', { locale: language })}
            callback={loginHandler}
          />

          <View style={{ marginTop: 24 }}>
            <View style={styles.passwordView}>
              <Text style={styles.password1}>
                {I18n.t('loginPage.forgotPassword', { locale: language })}
              </Text>
              <Pressable
                style={styles.pressable}
                onPress={() => navigation.navigate('Reset')}>
                <Text style={styles.password2}>
                  {I18n.t('loginPage.resetPasword', { locale: language })}
                </Text>
              </Pressable>
            </View>

            <View style={styles.passwordView}>
              <Text style={styles.password1}>
                {I18n.t('loginPage.dontAccont', { locale: language })}
              </Text>
              <Pressable
                style={styles.pressable}
                onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.password2}>
                  {I18n.t('loginPage.createAccount', { locale: language })}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

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
});
