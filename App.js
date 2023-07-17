import 'react-native-gesture-handler';
import React, { useEffect } from 'react';

import SplashScreen from 'react-native-splash-screen';

import { Navigator } from './src/navigation/navigator';
import { Notifications } from 'react-native-notifications';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import NotifService from './NotifService';
import { useState } from 'react';

export const App = () => {

  const [registerToken, setRegisterToken] = useState('');
  const [fcmRegistered, setFcmRegistered] = useState(false);
  // const notif = new NotifService(onRegister, onNotif)

  // const onRegister = (token) => { 
  //   setRegisterToken(token.token)
  //   setFcmRegistered(true)
  // }

  // const onNotif = (notif) => {
  //   Alert.alert(notif.title, notif.message);
  // }

  // const handlePerm = (perms) => {
  //   Alert.alert('Permissions', JSON.stringify(perms));
  // }

  const getFCMRegistrationToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Registration Token:', token);
      return token;
      // Lakukan tindakan lain dengan FCM Registration Token
    } catch (error) {
      console.log('Error getting FCM Registration Token:', error);
    }
  };

  useEffect(() => {
    SplashScreen.hide();
    // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    // getFCMRegistrationToken()
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });
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
