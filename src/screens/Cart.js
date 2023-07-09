import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import {ProductStore} from '../store/product';
import {observer} from 'mobx-react';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import {faTrashCan} from '@fortawesome/free-regular-svg-icons';

import {Header} from '../components/Header';
import styles from '../styles';
import axios from 'axios';
import api from '../utils/api';
import { BASE_URL_ASSET } from '../store/url';
import { numberFormat } from '../utils/currency';

export const Cart = observer(({navigation}) => {
  const {
    state: {cart},
  } = ProductStore;


  return (
    <View style={{flex: 1}}>
      {/* <Header heading="Cart" navigation={navigation} /> */}

      {cart.length > 0 ? (
        <>
          <ScrollView>
            {cart.map((item, i) => (
              <Item key={i} item={item} navigation={navigation} />
            ))}
            <View style={{height: 80}}></View>
          </ScrollView>

          <TouchableOpacity
            style={{...styles.primaryBtn, bottom: 0, position: 'absolute'}}>
            <Text style={{color: '#fff', fontFamily: 'Poppins-Regular'}}>
              Confirm Order
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={{justifyContent: 'center', flex: 1}}>
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginBottom: 20,
            }}
            source={require('../../assets/icons/empty-cart.png')}
          />
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              textAlign: 'center',
              fontSize: 26,
              color: '#000',
            }}>
            Your Cart is Empty
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
              fontSize: 12,
              color: '#000',
            }}>
            Your shopping bag has abandonment issues
          </Text>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Dashboard')}>
            <Text
              style={{
                color: '#000',
                fontSize: 16,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Continue shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const Item = ({item, navigation}) => {
  const {updateCartQuantity, setProduct} = ProductStore;
  console.log(item)
  return (
    <View style={styles.cartItem}>
      <Pressable
        onPress={() => {
          setProduct(item.product);
          navigation.navigate('Product');
        }}>
        <Image
          style={{width: 100, height: 150, borderRadius: 5}}
          source={{
            uri: BASE_URL_ASSET + item.product.assets[0].filename
          }}
        />
      </Pressable>
      <View style={{flex: 1}}>
        <Text style={styles.cartName}>{item.product.name}</Text>

        <Text style={styles.cartPrice}>
          Rp. {item.product.price * item.quantity ? numberFormat(item.product.price * item.quantity) : ''}
        </Text>
      </View>

      <View style={styles.cartQuantity}>
        <Pressable
          style={{
            width: 20,
            height: 20,
          }}
          onPress={() => {
            updateCartQuantity(item.product.id, item.quantity + 1);
          }}>
          <FontAwesomeIcon icon={faPlus} />
        </Pressable>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            marginTop: -5,
            marginHorizontal: 10,
          }}>
          {item.quantity}
        </Text>
        <Pressable
          style={{
            width: 20,
            height: 20,
          }}
          onPress={() => {
            updateCartQuantity(item.product.id, item.quantity - 1);
          }}>
          {item.quantity === 1 ? (
            <FontAwesomeIcon color="red" icon={faTrashCan} />
          ) : (
            <FontAwesomeIcon icon={faMinus} />
          )}
        </Pressable>
      </View>
    </View>
  );
};
