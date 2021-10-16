import createContext from './createContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'THEME':
      return { ...state, mode: action.payload };
    case 'SET_IS_DARK':
      return { ...state, isDark: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

const _toggleTheme = dispatch => async mode => {
  if (mode === 'light') {
    await AsyncStorage.setItem('MODE', 'dark');
    dispatch({ type: 'THEME', payload: 'dark' });
    dispatch({ type: 'SET_IS_DARK', payload: true });

  } else {
    await AsyncStorage.setItem('MODE', 'light');
    dispatch({ type: 'THEME', payload: 'light' });
    dispatch({ type: 'SET_IS_DARK', payload: false });
  }
};

const _checkingForMode = dispatch => async () => {
  const mode = await AsyncStorage.getItem('MODE');
  if (mode === 'dark') {
    dispatch({ type: 'THEME', payload: 'dark' });
    dispatch({ type: 'SET_IS_DARK', payload: true });
  } else {
    dispatch({ type: 'THEME', payload: 'light' });
    dispatch({ type: 'SET_IS_DARK', payload: false });
  }
}

const _toggleLanguage = dispatch => async (lang) => {
  await AsyncStorage.setItem('LANGUAGE', lang);
  dispatch({ type: 'SET_LANGUAGE', payload: lang })
}

const _getPreviousLanguage = dispatch => async () => {
  const prev = await AsyncStorage.getItem('LANGUAGE')
  if (prev) {
    dispatch({ type: 'SET_LANGUAGE', payload: prev })
  } else {
    const locales = RNLocalize.getLocales();
    dispatch({ type: 'SET_LANGUAGE', payload: locales[0].languageCode })
  }
}

export const { Provider, Context } = createContext(
  themeReducer,
  { _toggleTheme, _checkingForMode, _toggleLanguage, _getPreviousLanguage },
  { mode: 'light', isDark: false, language: 'system' },
);
