import {View, Text, Image, ScrollView, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../styles';

import {ProductStore} from '../store/product';
import { numberFormat } from '../utils/currency';
import { BASE_URL_ASSET } from '../store/url';
import { observer } from 'mobx-react';

export const ProductSlider = observer(({navigation}) => {
  const {
    state: { products },
    setProduct, getRandomProducts
  } = ProductStore;


  return (
    <ScrollView horizontal={true} style={styles.productSlider}>
      {products.map((value, i) => (
        <Pressable
          onPress={() => {
            setProduct(value);
            navigation.navigate('Product');
          }}
          key={i}
          style={styles.sliderItem}>
          <Image style={styles.sliderImg} source={{uri: BASE_URL_ASSET + value.assets[0].filename}} />
          <Text style={styles.sliderText}>{value.title}</Text>
          <Text style={styles.sliderPrice}>Rp. {numberFormat(value.real_price)}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
});
