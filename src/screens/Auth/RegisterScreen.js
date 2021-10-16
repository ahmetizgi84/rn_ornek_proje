import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, Linking } from 'react-native';
import Modal from 'react-native-modal';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import I18n from '../../lang/_i18n';

import Button from '../../components/Button';
import HeaderLogin from '../../components/HeaderLogin';
import InputText from '../../components/InputText';
import { Mail, Password, Key } from '../../components/svg';
import Toast from '../../components/Toast'


import { Context as ThemeContext } from '../../context/ThemeContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { theme } from '../../constants/ThemeStyle';
import Checkbox from '../../components/Checkbox/Checkbox';

const { width, height } = Dimensions.get('window');
const siteKey = '*****';
const baseUrl = 'https://ornekapp.com';

const USER_AGGREMENT_LINK = 'https://ornekapp.com/user-agreement';
const PRIVACY_POLICY_LINK = 'https://ornekapp.com/privacy';

export default function RegisterScreen({ navigation }) {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [refid, setRefId] = useState('');

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isKvkkAccepted, setIsKvkkAccepted] = useState(false);

  const { state: { mode, language } } = useContext(ThemeContext);
  const { _signupHandler, state: { toastMessage } } = useContext(AuthContext);

  const styles = setStyle(mode);

  const userAggreementLink = () => {
    Linking.canOpenURL(USER_AGGREMENT_LINK).then((supported) => {
      if (supported) {
        Linking.openURL(USER_AGGREMENT_LINK);
      } else {
        console.log("Don't know how to open URI: " + USER_AGGREMENT_LINK);
      }
    });
  }

  const privacyPolicyLink = () => {
    Linking.canOpenURL(PRIVACY_POLICY_LINK).then((supported) => {
      if (supported) {
        Linking.openURL(PRIVACY_POLICY_LINK);
      } else {
        console.log("Don't know how to open URI: " + PRIVACY_POLICY_LINK);
      }
    });
  }

  const clearFields = () => {
    setErrors([])
    setEmail('')
    setPassword('')
    setRePassword('')
    setRefId('')
    setIsTermsAccepted(false)
    setIsKvkkAccepted(false)
  }

  useEffect(() => {
    if (toastMessage === 'signup_success') {
      clearFields();
    }
  }, [toastMessage])

  const signupHandler = () => {
    let errs = [];

    if (email === '') {
      errs.push('email');
    }

    if (password === '') {
      errs.push('password');
    }

    if (rePassword === '') {
      errs.push('rePassword');
    }

    if (isTermsAccepted === false) {
      errs.push('isTermsAccepted');
    }

    if (isKvkkAccepted === false) {
      errs.push('isKvkkAccepted');
    }

    if (password !== rePassword) {
      errs.push('passwordsIsNotSame');
    }

    if (errs.length) {
      setErrors(errs);
      return;
    }

    captchaForm.show();
  };

  const setEmailHandler = ema => {
    setEmail(ema);
    setErrors([]);
  };

  const setPasswordHandler = pwd => {
    setPassword(pwd);
    setErrors([]);
  };

  const setRePasswordHandler = rpwd => {
    setRePassword(rpwd);
    setErrors([]);
  };

  const setRefCodeHandler = ref => {
    setRefId(ref);
    setErrors([]);
  };

  const firstCheckboxHandler = () => {
    setIsTermsAccepted(!isTermsAccepted);
    setErrors([]);
  };

  const secondCheckboxHandler = () => {
    setIsKvkkAccepted(!isKvkkAccepted);
    setErrors([]);
  };

  function captchaForm() {
    const hide = () => {
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating
        deviceHeight={height}
        deviceWidth={width}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={false}
      />;
    };

    const show = () => {
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating
        deviceHeight={height}
        deviceWidth={width}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={true}
      />;
    };
  }

  const onMessage = (event) => {
    try {
      if (event && event.nativeEvent.data) {
        var data = event.nativeEvent.data 
        if (['cancel', 'error', 'expired'].includes(data)) {
          captchaForm.hide();
          return;
        } else {
          //console.log('Verified code from Google', event.nativeEvent.data);
          setTimeout(() => {
            captchaForm.hide();

            const params = new URLSearchParams();
            params.append('captcha_response', data);
            params.append('data', '{ "language": "tr" }');
            params.append('email', email);
            params.append('password', password);

            if (refid !== '') {
              params.append('refid', refid);
            }

            _signupHandler(params);

          }, 1500);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setErrors([]);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: theme[mode].bg }}>
      <HeaderLogin navigation={navigation} />
      <ScrollView keyboardShouldPersistTaps="handled">
        {
          toastMessage === 'email' ? <Toast message={I18n.t('signupPage.toast1', { locale: language })} type={"error"} /> :
            toastMessage === 'signup_success' ? <Toast message={I18n.t('signupPage.toast2', { locale: language })} type={"success"} /> :
              <Toast message={I18n.t('signupPage.toast3', { locale: language })} type={"error"} />
        }
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.title}> {I18n.t('signupPage.title', { locale: language })}</Text>

          <InputText
            leftIcon={<Mail width={20} color={theme[mode].inputIconColor} />}
            placeholder={I18n.t('signupPage.inputMail', { locale: language })}
            keyboardType="email-address"
            onChangeText={onChangeText => setEmailHandler(onChangeText.trim())}
            isEmpty={errors.find(err => err === 'email') ? true : false}
            amountValue={email}
          />

          <InputText
            leftIcon={<Password width={20} color={theme[mode].inputIconColor} />}
            placeholder={I18n.t('signupPage.inputPasword', { locale: language })}
            onChangeText={onChangeText => setPasswordHandler(onChangeText.trim())}
            isEmpty={errors.find(err => err === 'password') ? true : false}
            amountValue={password}
          />

          <InputText
            leftIcon={<Password width={20} color={theme[mode].inputIconColor} />}
            placeholder={I18n.t('signupPage.inputPasword2', { locale: language })}
            onChangeText={onChangeText => setRePasswordHandler(onChangeText.trim())}
            isEmpty={errors.find(err => err === 'rePassword') ? true : false}
            amountValue={rePassword}
          />

          <InputText
            leftIcon={<Key width={20} color={theme[mode].inputIconColor} />}
            placeholder={I18n.t('signupPage.refCode', { locale: language })}
            onChangeText={onChangeText => setRefCodeHandler(onChangeText.trim())}
            amountValue={refid}
          />

          <View>
            <Text style={styles.desc}> {I18n.t('signupPage.desc', { locale: language })} </Text>

            <View
              style={{
                marginBottom: 10,
                paddingRight: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Checkbox
                  callback={firstCheckboxHandler}
                  isEmpty={
                    errors.find(err => err === 'isTermsAccepted') ? true : false
                  }
                />
                <Pressable onPress={userAggreementLink}>
                  <Text style={styles.terms}>{I18n.t('signupPage.terms', { locale: language })}</Text>
                </Pressable>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Checkbox
                  callback={secondCheckboxHandler}
                  isEmpty={
                    errors.find(err => err === 'isKvkkAccepted') ? true : false
                  }
                />
                <Pressable onPress={privacyPolicyLink}>
                  <Text style={styles.terms}>{I18n.t('signupPage.kvkk', { locale: language })}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <ConfirmGoogleCaptcha
              ref={_ref => (captchaForm = _ref)}
              siteKey={siteKey}
              baseUrl={baseUrl}
              languageCode={language}
              onMessage={onMessage}
            />
          </View>

          <Button
            btnLg
            btnPrimary
            title={I18n.t('signupPage.signupButton', { locale: language })}
            callback={signupHandler}
          //callback={callToast}
          />

          <View style={{ marginTop: 12 }}>
            <View style={styles.passwordView}>
              <Text style={styles.password1}>
                {I18n.t('signupPage.haveAccount', { locale: language })}
              </Text>
              <Pressable
                style={styles.pressable}
                onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.password2}>
                  {I18n.t('signupPage.login', { locale: language })}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const setStyle = mode => ({
  title: {
    alignSelf: 'center',
    width: 260,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 12,
    color: theme[mode].textblack,
  },

  desc: {
    fontSize: 12,
    color: theme[mode].textDimColor,
    marginBottom: 20,
  },

  terms: {
    fontSize: 12,
    fontWeight: '500',
    color: theme[mode].textblack,
  },

  passwordView: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  password1: {
    color: theme[mode].textDimColor,
    marginRight: 10,
  },
  password2: {
    color: theme[mode].textShineColor,
    fontWeight: '500',
  },

  modal: { margin: 0 },

  pressable: {
    padding: 8,
  },
});
