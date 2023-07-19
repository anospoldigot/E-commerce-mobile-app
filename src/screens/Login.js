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
import MaterialButton from '../components/Button';
import { clientId } from '../store/google';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setuserInfo] = useState([]);

  useEffect(() => {
    axios.defaults.baseURL = BASE_URL_API;
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: clientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
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

  const googleeSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
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

        <MaterialButton onPress={onSubmit} title={'Login'} style={{ marginBottom: 50 }} />
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={googleeSignIn}
          style={{ width: '100%' }}
        // disabled={state.isSigninInProgress}
        />
      </ScrollView>
    </View>
  );
};

export default Login;
