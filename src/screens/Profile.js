import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import styles from '../styles';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBoxes,
  faCartShopping,
  faCheck,
  faCheckCircle,
  faChevronRight,
  faCreditCard,
  faHeart,
  faHome,
  faLocation,
  faLocationPin,
  faReceipt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../utils/api';
import { AuthStore } from '../store/auth';
import { observer } from 'mobx-react';
import {  BASE_URL_ASSET } from '../store/url';

const Profile = observer(({ navigation }) => {

  const { state : {user}} = AuthStore

  console.log(BASE_URL_ASSET + user.profile)

  return (
    <View>
      <View style={styles.profile}>
        <Image
          style={{ width: 150, height: 150 }}
          source={{
            uri: BASE_URL_ASSET  + user.profile,
          }}
        />
        <Text style={styles.profileName}>{user.name}</Text>
      </View>
      <View style={styles.menuOptions}>
        <Pressable style={styles.menuOption}>
          <FontAwesomeIcon color="#ccc" icon={faUser} />
          <Text style={styles.menuText}>Edit Profile</Text>
          <FontAwesomeIcon color="#ccc" icon={faChevronRight} />
        </Pressable>

        <Pressable style={styles.menuOption}>
          <FontAwesomeIcon color="#ccc" icon={faLocationPin} />
          <Text style={styles.menuText}>Shopping Address</Text>
          <FontAwesomeIcon color="#ccc" icon={faChevronRight} />
        </Pressable>

        <Pressable style={styles.menuOption}>
          <FontAwesomeIcon color="#ccc" icon={faHeart} />
          <Text style={styles.menuText}>Wishlist</Text>
          <FontAwesomeIcon color="#ccc" icon={faChevronRight} />
        </Pressable>

        <Pressable style={styles.menuOption} onPress={() => navigation.navigate('Orders')}>
          <FontAwesomeIcon color="#ccc" icon={faReceipt} />
          <Text style={styles.menuText}>Orders</Text>
          <FontAwesomeIcon color="#ccc" icon={faChevronRight} />
        </Pressable>

        <Pressable style={styles.menuOption}>
          <FontAwesomeIcon color="#ccc" icon={faCreditCard} />
          <Text style={styles.menuText}>Cards</Text>
          <FontAwesomeIcon color="#ccc" icon={faChevronRight} />
        </Pressable>
      </View>
    </View>
  );
})

export default Profile;
