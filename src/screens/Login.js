import React, {useState} from 'react';
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

import {AuthStore} from '../store/auth';
import {PrimaryColor, SecondaryColor} from '../styles/theme';

import {faUser, faLock} from '@fortawesome/free-solid-svg-icons';
import Svg, {Path} from 'react-native-svg';
import axios from 'axios';
import {  BASE_URL_API } from '../store/url';
const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const onSubmit = async () => {
    try{
      axios.defaults.baseURL = BASE_URL_API;
      const response = await axios.post('login', {email: email, password: password});
      AuthStore.login({user: response.data.data, token: response.data.token});
    }catch(err){
      console.log(err)
      // ToastAndroid.show(err.response.data.errors.username[0], ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginVertical: 30}}>
        <Image
          style={{width: 200, height: 200}}
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
          style={{alignSelf: 'flex-end', marginVertical: 10}}
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
          <Text style={{...styles.btnTextPrimary, color: '#fff'}}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Login;
