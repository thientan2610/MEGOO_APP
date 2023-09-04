/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-reanimated';
import 'react-native-gesture-handler';

import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Toast from 'react-native-toast-message';

import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {checkLogin} from './src/common/auth';
import DrawerNavigation from './src/common/components/DrawerNavigation';
import appStore from './src/common/store/app.store';
import RoutesName from './src/constants/route-names.const';
import LoginScreen from './src/screens/login/screens/LoginScreen';
import RegisterScreen from './src/screens/register/RegisterScreen';
import SplashScreen from './src/screens/splash/SplashScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  const checkLoggedIn = async () => {
    if (appStore.isLoggedIn === false) {
      const response = await checkLogin();
      if (response === true) {
        appStore.setIsLoggedIn(true);
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
        'https://www.googleapis.com/auth/user.birthday.read',
      ],
      webClientId:
        '768201973051-b9supnlu237m58th9c3du0qpp3m13cgl.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    checkLoggedIn();

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [appStore.isLoggedIn]);

  useEffect(() => {
    // Request permissions (required for iOS)
    notifee.requestPermission();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {loading ? (
        // <ActivityIndicator size="large" color="orange" />
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <>
              {appStore.isLoggedIn ? (
                <Stack.Group screenOptions={{headerShown: false}}>
                  <Stack.Screen
                    name={RoutesName.HOME_DRAWER}
                    component={DrawerNavigation}
                  />
                </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen
                    options={{headerShown: false}}
                    name={RoutesName.HOME_DRAWER}
                    component={DrawerNavigation}
                  />
                  <Stack.Screen
                    name={RoutesName.LOGIN}
                    component={LoginScreen}
                  />
                  <Stack.Screen
                    name={RoutesName.REGISTER}
                    component={RegisterScreen}
                  />
                </Stack.Group>
              )}
            </>
          </Stack.Navigator>
        </NavigationContainer>
      )}

      <Toast position="top" topOffset={120} key={'toast'} config={{}} />
    </View>
  );
};

export default observer(App);
