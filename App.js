import 'react-native-gesture-handler';
import React, { useEffect } from 'react';

import SplashScreen from 'react-native-splash-screen';

import { Navigator } from './src/navigation/navigator';
import websocket from './src/utils/websocket';
import { Notifications } from 'react-native-notifications';


export const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    websocket();

    Notifications.registerRemoteNotifications();

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
      completion({ alert: false, sound: false, badge: false });
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      completion();
    });
      
  }, []);

  return <Navigator />;
};
