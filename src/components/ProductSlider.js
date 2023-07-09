import {View, Text, Image, ScrollView, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../styles';

import {ProductStore} from '../store/product';
import { numberFormat } from '../utils/currency';
import { BASE_URL_ASSET } from '../store/url';

export const ProductSlider = ({navigation}) => {
  const {
    state: { products },
    setProduct, getRandomProducts
  } = ProductStore;

  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(products)
    setData(products);
  }, []);

  return (
    <ScrollView horizontal={true} style={styles.productSlider}>
      {data.map((value, i) => (
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
};
