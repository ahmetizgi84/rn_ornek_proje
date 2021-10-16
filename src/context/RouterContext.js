import createContext from './createContext';
import * as RootNavigation from '../RootNavigation';

const routerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_IS_SPLASH':
      return { ...state, isSplash: action.payload };
    default:
      return state;
  }
};


const _drawerButtonsHandler = dispatch => btnId => {
  switch (btnId) {
    case 'account':
      RootNavigation.navigate('AccountScreen');
      break;
    case 'wallet':
      RootNavigation.navigate('WalletTab');
      break;
    case 'markets':
      RootNavigation.navigate('TradeTab');
      break;
    case 'orders':
      RootNavigation.navigate('OpenOrdersTab');
      break;
    case 'transactionHistory':
      RootNavigation.navigate('Transaction');
      break;
    case 'tradeHistory':
      RootNavigation.navigate('History');
      break;
    case 'settings':
      RootNavigation.navigate('Settings');
      break;
    case 'affiliate':
      RootNavigation.navigate('Affiliate');
      break;
    case 'api':
      RootNavigation.navigate('Api');
      break;
    case 'support':
      RootNavigation.navigate('Support');
      break;
  }
};

export const { Provider, Context } = createContext(
  routerReducer,
  { _drawerButtonsHandler },
  { currentPage: "homePage" },
);
