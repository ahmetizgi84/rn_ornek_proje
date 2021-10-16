import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import I18n from '../../lang/_i18n';

import Button from '../../components/Button';
import HeaderLogin from '../../components/HeaderLogin';
import InputText from '../../components/InputText';
import { Sms, Mail } from '../../components/svg';
import Toast from '../../components/Toast'

import { Context as ThemeContext } from '../../context/ThemeContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { theme } from '../../constants/ThemeStyle';

const siteKey = '****';
const baseUrl = 'https://ornekapp.com';



const ResetPasswordScreen = ({ navigation }) => {
  const { state: { mode, language } } = useContext(ThemeContext);

  const { _resetPasswordHandler, state: { toastMessage } } = useContext(AuthContext);

  const styles = setStyle(mode);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);

  const setEmailHandler = ema => {
    setEmail(ema);
    setErrors([]);
  };


  const resetPasswordHandler = () => {
    let errs = [];

    if (email === '') {
      errs.push('email');
    }

    if (errs.length) {
      setErrors(errs);
      return;
    }

    const obj = {
      email
    };

    captchaForm.show();

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

  const onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        captchaForm.hide();
        return;
      } else {
        setTimeout(() => {
          captchaForm.hide();
          setEmail('')

          const params = {
            captcha_response: event.nativeEvent.data,
            email: email
          }
          _resetPasswordHandler(params);
        }, 1500);
      }
    }
  };




  return (
    <View style={{ flex: 1, backgroundColor: theme[mode].bg }}>
      <HeaderLogin navigation={navigation} />
      <ScrollView keyboardShouldPersistTaps="handled">
        {
          toastMessage === 'resetLinkSuccess'
            ? <Toast message={I18n.t('resetScreen.toast1', { locale: language })} type="success" />
            : <Toast message={I18n.t('resetScreen.toast2', { locale: language })} type="danger" />
        }

        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.title}> {I18n.t('resetScreen.title', { locale: language })}</Text>

          <View style={{ marginBottom: 20 }}>
            <Text style={styles.inpTitle}>
              {I18n.t('resetScreen.inpTitle', { locale: language })}
            </Text>

            <InputText
              leftIcon={<Mail width={20} color={theme[mode].inputIconColor} />}
              placeholder={I18n.t('resetScreen.inputMail', { locale: language })}
              keyboardType="email-address"
              onChangeText={onChangeText => setEmailHandler(onChangeText.trim())}
              isEmpty={errors.find(err => err === 'email') ? true : false}
              amountValue={email}

            />
          </View>

          {/* <View style={{ marginVertical: 20 }}>
            <Text style={styles.inpTitle}>
              {I18n.t('resetScreen.phoneTitle', {locale: language})}
            </Text>

            <InputText
              leftIcon={<Sms width={20} color={theme[mode].inputIconColor} />}
              placeholder={I18n.t('resetScreen.phoneNumber', {locale: language})}
              keyboardType="phone-pad"
              onChangeText={onChangeText => setPhoneHandler(onChangeText.trim())}
              isEmpty={false}
              amountValue={phone}

            />
          </View> */}

          <View style={{ flex: 1 }}>
            <ConfirmGoogleCaptcha
              ref={_ref => (captchaForm = _ref)}
              siteKey={siteKey}
              baseUrl={baseUrl}
              languageCode="en"
              onMessage={onMessage}
            />
          </View>

          <Button
            btnLg
            btnPrimary
            title={I18n.t('resetScreen.send', { locale: language })}
            callback={resetPasswordHandler}
          />

          <View style={{ marginTop: 20 }}>
            <View style={styles.passwordView}>
              <Pressable
                style={styles.pressable}
                onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.password2}>
                  {I18n.t('resetScreen.login', { locale: language })}
                </Text>
              </Pressable>
              <Pressable
                style={styles.pressable}
                onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.password2}>
                  {I18n.t('resetScreen.createAccount', { locale: language })}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResetPasswordScreen;

const setStyle = mode => ({
  title: {
    alignSelf: 'center',
    width: 260,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 12,
    color: theme[mode].textblack,
  },

  inpTitle: {
    color: theme[mode].textblack,
    fontSize: 10,
    marginBottom: 5,
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
