import React, {useState} from 'react';
import {Image, Text, Pressable, TouchableOpacity, View,StyleSheet} from 'react-native';
import Input from '../components/Input';
import MapView from "react-native-maps";

import {PrimaryColor, SecondaryColor} from '../styles/theme';
import styles from '../styles';
import GetLocation from 'react-native-get-location'


const styles2 = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
     //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: "50%",
    
  },
});

const Signup = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lat,setlat]=useState(0);
  const [lot,setlot]=useState(0);
  React.useEffect( () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
  })
  .then(location => {
      console.log(location);
      setlat(location.latitude);
      setlot(location.longitude);
  })
  .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
  })
},[])
  const Register = async () => {
    fetch('http://10.0.2.2:8000/registration', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
     
      "customer_email":email,
      "customer_password":password,
      "customer_firstname":name,
      "order_map_lat":lat,
      "order_map_lon":lot,
    
  })
});
}
  return (
    <View style={styles2.container}>
      
      <MapView
        style={styles2.map}
        //specify our coordinates.
        initialRegion={{
          latitude:  24.905875,
          longitude:  67.138275,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}
      />
      <Image
        source={{
          uri: 'https://i.pinimg.com/originals/e9/e2/78/e9e2787d0cb55d570fe1c76843506759.jpg',
        }}
        style={{width: 100, height: 100}}
      />
      <View style={styles.form}>
        <Text style={styles.label}>Name:</Text>
        <Input text={name} setText={setName} placeholder="Enter name" />
        <Text style={styles.label}>Email:</Text>
        <Input text={email} setText={setEmail} placeholder="Enter email" />
        <Text style={styles.label}>Password:</Text>
        <Input
          password={true}
          text={password}
          setText={setPassword}
          placeholder="Enter password"
        />

        <Pressable
          style={{alignSelf: 'flex-end', marginVertical: 10}}
          onPress={() => navigation.navigate('login')}>
          <Text
            style={{
              color: SecondaryColor,
              textDecorationColor: PrimaryColor,
              textDecorationLine: 'underline',
            }}>
            Already have an account
          </Text>
        </Pressable>

        <TouchableOpacity style={styles.btnPrimary} onPress={()=>{
          
          Register()
          navigation.navigate("Dashboard",{parama:[],auth:true})}
          }>
          <Text style={styles.btnTextPrimary} >Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;
