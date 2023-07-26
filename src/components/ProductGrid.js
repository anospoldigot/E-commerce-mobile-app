import {View, Text, Image, ScrollView, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';

import {ProductStore} from '../store/product';
import styles from '../styles';
import {observer} from 'mobx-react';
import { BASE_URL, BASE_URL_ASSET } from '../store/url';
import { numberFormat } from '../utils/currency';

export const ProductGrid = observer(({searchText, navigation, byCategory}) => {
  const {
    state: {searchedProducts, category},
    setProduct,
    getSearchedProducts,
    getProductsByCategories,
  } = ProductStore;

  useEffect(() => {
    byCategory
      ? getProductsByCategories(category)
      : getSearchedProducts(searchText);
  }, [category]);

  return (
    <View>
      {!byCategory && (
        <Text style={styles.searchText}>
          {searchedProducts.length === 0 && 'no'} search results for "
          {searchText}"
        </Text>
      )}
      <ScrollView contentContainerStyle={styles.productGrid}>
        {searchedProducts.map((x, i) => (
          <Pressable
            onPress={() => {
              setProduct(x);
              navigation.navigate('Product');
            }}
            key={i}
            style={styles.sliderItem}>
            <Image style={styles.sliderImg} source={{uri: BASE_URL_ASSET + x.assets[0].filename}} />
            <Text style={styles.sliderText}>{x.title}</Text>
            <Text style={styles.sliderPrice}>Rp. {numberFormat(x.real_price)}</Text>
          </Pressable>
        ))}
        <View style={{height: 350}}></View>
      </ScrollView>
    </View>
  );
});
