import createContext from './createContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../RootNavigation';
import ornekappApi from '../api/ornekappApi'
import axios from 'axios'
import SplashScreen from 'react-native-splash-screen'

import { callToast } from '../components/Toast'

const SESSION_URL = '/auth/resource/users/me'
const LOGIN_URL = '/auth/identity/sessions'
const RESET_URL = '/auth/identity/users/password/generate_code'
//https://ornekapp.com/api/v2/auth/resource/users/me

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: action.payload };
    case 'USER_DATA':
      return { ...state, userData: action.payload };
    case 'LOGOUT':
      return { ...state, isLoggedIn: action.payload, userData: null };
    case 'SET_INDICATOR':
      return { ...state, indicator: action.payload };
    case 'TOAST_MESSAGE':
      return { ...state, toastMessage: action.payload };
    default:
      return state;
  }
};

// ___________________________________ CHECK FOR AUTH ________________________________________
const _checkingForAuth = dispatch => async () => {
  let counter = 5
  while (true) {
    try {
      const { data } = await ornekappApi.get(SESSION_URL);
      if (data.uid) { // session is still valid
        if (data.state === 'verified' || data.state === 'active') {
          if (data.profiles.length <= 0) {
            let tempUserData = {
              profiles: [
                {
                  address: "",
                  city: "",
                  country: "",
                  created_at: "",
                  dob: "",
                  first_name: "ornekapp",
                  last_name: "",
                  metadata: null,
                  postcode: "",
                  state: "",
                  updated_at: "",
                }
              ]
            }
            dispatch({ type: 'LOGIN', payload: true });
            dispatch({ type: 'USER_DATA', payload: { ...data, ...tempUserData } })
            SplashScreen.hide();
            //console.log("lack of profile data")
            return true
          } else {
            dispatch({ type: 'LOGIN', payload: true });
            dispatch({ type: 'USER_DATA', payload: data })
            //console.log("session is valid. User is authenticated...")
            SplashScreen.hide();
            return true
          }
        } else {
          await AsyncStorage.setItem('TOKEN', '');
          dispatch({ type: 'LOGOUT', payload: false });
          console.log("email is not verified!")
          SplashScreen.hide();
          return false
        }

      } else { // session is expired
        await AsyncStorage.setItem('TOKEN', '');
        dispatch({ type: 'LOGOUT', payload: false });
        console.log("session is expired! user is not authenticated")
        SplashScreen.hide();
        return false;
      }
    } catch (error) {
      //console.log("counter: ", counter)
      if (counter == 0) {
        await AsyncStorage.setItem('TOKEN', '');
        dispatch({ type: 'LOGOUT', payload: false });
        //console.log("_checkingForAuth: ", error.response.data.errors[0])
        //console.log("_checkingForAuth: ", error.response.data)
        //console.log("_checkingForAuth network status: ", error.response.status)
        SplashScreen.hide();
        return false
      }
      counter--
    }
  }
}

//_________________________________________ LOGIN FUNC _________________________________________
const _loginHandler = dispatch => async (object, navigation) => {
  dispatch({ type: 'SET_INDICATOR', payload: true });
  var responseTemp = null;
  let response = null;
  response = await ornekappApi.post(LOGIN_URL, object)
    .catch(({ response }) => {
      if (response.data.errors[0] === "identity.session.missing_otp") {
        dispatch({ type: 'LOGOUT', payload: false });
        dispatch({ type: 'SET_INDICATOR', payload: false });
        navigation.navigate('TwoFactorScreen', { object })
        dispatch({ type: 'TOAST_MESSAGE', payload: '' })
        // callToast();
        responseTemp = response.data;
        return response.data
      }

    })
  if (responseTemp && responseTemp.errors[0] === "identity.session.missing_otp")
    return response

  if (response && response.data.uid) { // valid user exists
    if (response.data.state === 'verified' || response.data.state === 'active') { // email is verified
      await AsyncStorage.setItem('TOKEN', response.data.csrf_token);
      dispatch({ type: 'SET_INDICATOR', payload: false });
      dispatch({ type: 'LOGIN', payload: true });
      if (response.data.profiles.length <= 0) {
        let tempUserData = {
          profiles: [
            {
              address: "",
              city: "",
              country: "",
              created_at: "",
              dob: "",
              first_name: "ornekapp",
              last_name: "",
              metadata: null,
              postcode: "",
              state: "",
              updated_at: "",
            }
          ]
        }
        dispatch({ type: 'USER_DATA', payload: { ...response.data, ...tempUserData } })

      } else {
        dispatch({ type: 'USER_DATA', payload: response.data })
      }
    } else {
      //pending email status is not allowed to login!
      dispatch({ type: 'LOGOUT', payload: false });
      dispatch({ type: 'SET_INDICATOR', payload: false });
      dispatch({ type: 'TOAST_MESSAGE', payload: 'email_pending' })
      callToast();
    }
  } else {
    console.log('Login Error valid user exists : ', response);
    dispatch({ type: 'LOGOUT', payload: false });
    dispatch({ type: 'SET_INDICATOR', payload: false });
    dispatch({ type: 'TOAST_MESSAGE', payload: 'login_error' })
    callToast();
  }
  if (response != null || response != undefined)
    dispatch({ type: 'TOAST_MESSAGE', payload: '' })

  return response

};

//_________________________________________ // LOGOUT FUNC _________________________________________
const _logoutHandler = dispatch => async () => {
  await AsyncStorage.removeItem('TOKEN')
  dispatch({ type: 'LOGOUT', payload: false });
  const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking');
  RCTNetworking.clearCookies(() => { '_auth_session', null });
  RootNavigation.navigate('HomeTab');
};

//_________________________________________ SIGNUP FUNC _________________________________________
const _signupHandler = dispatch => async object => {

  await axios.post('https://ornekapp.com/api/v2/auth/identity/users', object).then(response => {
    if (response.data.uid) { // success
      AsyncStorage.setItem('TOKEN', response.data.csrf_token)
      dispatch({ type: 'TOAST_MESSAGE', payload: 'signup_success' })
      callToast()
      setTimeout(() => {
        RootNavigation.navigate('Home')
      }, 3500)
    } else {
      console.log('no incoming data on _signupHandler fn');
    }
  }).catch(err => {
    if (err.response.data.errors[0] === 'email.taken') {
      dispatch({ type: 'TOAST_MESSAGE', payload: 'email' })
      callToast();
    } else if (err.response.data.errors[0] === 'password.requirements') {
      dispatch({ type: 'TOAST_MESSAGE', payload: 'password' })
      callToast();
    } else if (err.response.data.errors[0] === 'password.weak') {
      dispatch({ type: 'TOAST_MESSAGE', payload: 'password' })
      callToast();
    } else if (err.response.data.errors[0] === 'email.invalid') {
      dispatch({ type: 'TOAST_MESSAGE', payload: 'email' })
      callToast();
    }
  }).finally(res => {
    return res
  })


}

// _________________________________________________ RESET PASSWORD ________________________________________________
const _resetPasswordHandler = dispatch => async (object) => {
  try {
    const response = await ornekappApi.post(RESET_URL, object)
    if (response.status === 201) {
      dispatch({ type: 'TOAST_MESSAGE', payload: 'resetLinkSuccess' })
      callToast();
    }
  } catch (error) {
    dispatch({ type: 'TOAST_MESSAGE', payload: 'resetLinkError' })
    callToast();
  }
}


// __________________________________________________________________________________________________
export const { Provider, Context } = createContext(
  authReducer,
  { _loginHandler, _logoutHandler, _signupHandler, _checkingForAuth, _resetPasswordHandler },
  { isLoggedIn: false, userData: null, indicator: false, toastMessage: '' },
);

