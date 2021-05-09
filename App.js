import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, YellowBox } from 'react-native';
import { enableScreens } from 'react-native-screens';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import * as Notifications from 'expo-notifications';

//import {composeWithDevTools}from 'redux-dev...(close the ...)tools-extension';//use when you want to monitor your redux state,actions,reducers etc on the RN debugger
//to use it, run: npm install --save-dev redux-dev...(close the ...)tools-extension, pass composeWithDevTools as 2nd arg to createStore

import ShopNavigator from './navigation/ShopNavigator';
import productsReducer from './store/reducers/productsReducer';
import cartReducer from './store/reducers/cartReducer';
import ordersReducer from './store/reducers/ordersReducer';
import authReducer from './store/reducers/authReducer';
import AppNavigator from './navigation/AppNavigator';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


enableScreens(); //useScreens(); is for lower versions of expo and react-native

//used to combine multiple reducers 
const rootReducer = combineReducers({
  productsRed: productsReducer,
  cartRed: cartReducer,
  ordersRed: ordersReducer,
  authRed: authReducer
});

//creates the store with the rootReducer as arg
const reduxStore = createStore(rootReducer, applyMiddleware(ReduxThunk));



const fetchFonts = () => {
  return Font.loadAsync({
    'OpenSansRegular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSansBold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
};

export default function App() {
  YellowBox.ignoreWarnings(['Setting a timer']); //check out the better solution than this
  const [fontIsLoaded, setFontIsLoaded] = useState(false);

  if (!fontIsLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontIsLoaded(true)}
      />);
  }

  return (
    <Provider store={reduxStore}>
      <AppNavigator />
    </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
