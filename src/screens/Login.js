import React, { useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import Input from '../components/Input';
import styles from '../styles';
import { AuthStore } from '../store/auth';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { BASE_URL_API } from '../store/url';
import { useEffect } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);

  useEffect(() => {
    axios.defaults.baseURL = BASE_URL_API;
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '778109261856-sbf631rfrcrndsh71ke6stcq2q4ccgdm.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, [])


  const onSubmit = async () => {
    try {
      const response = await axios.post('login', { email: email, password: password });
      AuthStore.login({ user: response.data.data, token: response.data.token });
    } catch (err) {
      console.log(err)
      // ToastAndroid.show(err.response.data.errors.username[0], ToastAndroid.SHORT);
    }
  };

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // const { accessToken, idToken } = await GoogleSignin.signIn();
      const userInfo = await GoogleSignin.signIn();
      console.log("userinfo", userInfo)
      const response = await axios.post('google/login', userInfo.user);
      AuthStore.login({ user: response.data.data, token: response.data.token });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        console.log(error)
        alert(error)
        // some other error happened
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setloggedIn(false);
      setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 30 }}>
        <Image
          style={{ width: 200, height: 200 }}
          source={require('../../assets/icons/Login.jpg')}
        />
      </View>

      <ScrollView style={styles.form}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 30,
            fontFamily: 'Poppins-SemiBold',
            color: '#000',
            marginBottom: 20,
          }}>
          Sign in
        </Text>

        <Input
          text={email}
          setText={setEmail}
          icon={faUser}
          placeholder="Enter email"
        />

        <Input
          text={password}
          setText={setPassword}
          placeholder="Enter password"
          password={true}
          icon={faLock}
        />

        <Pressable
          style={{ alignSelf: 'flex-end', marginVertical: 10 }}
          onPress={() => navigation.navigate('signup')}>
          <Text
            style={{
              color: 'gray',
              textDecorationColor: 'gray',
              textDecorationLine: 'underline',
            }}>
            Create an account
          </Text>
        </Pressable>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => onSubmit()}>
          <Text style={{ ...styles.btnTextPrimary, color: '#fff' }}>Submit</Text>
        </TouchableOpacity>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={_signIn}
        // disabled={state.isSigninInProgress}
        />
      </ScrollView>
    </View>
  );
};

export default Login;
