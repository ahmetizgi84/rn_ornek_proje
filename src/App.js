import React from 'react';

import { Provider as ThemeProvider } from './context/ThemeContext';
import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as RouterProvider } from './context/RouterContext';
import { DataProvider } from './context/DataContext';
import { SocketProvider } from './context/SocketContext';

import { Provider as ProTradeProvider } from './context/ProTradeContext';
//import { ProTradeProvider } from './context/ProTradeContext';

import Router from './Router';
import OnesignalConfig from './config/OnesignalConfig';

OnesignalConfig();
const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <SocketProvider>
          <ProTradeProvider>
            <ThemeProvider>
              <RouterProvider>
                <Router />
              </RouterProvider>
            </ThemeProvider>
          </ProTradeProvider>
        </SocketProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
