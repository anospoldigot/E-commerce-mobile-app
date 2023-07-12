import { View, Text, Image, ScrollView, TouchableHighlight } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {
  faAddressCard,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import api from '../utils/api';
import { useEffect } from 'react';
import { numberFormat } from '../utils/currency';
import { BASE_URL_ASSET } from '../store/url';
import { TextColorPrimary, TextColorSecondary } from '../styles/theme';

const Order = () => {

  const route = useRoute();
  const { orderId } = route.params;
  const [order, setOrder] = useState({
    items: [],
  });

  const initializeState = async () => {
    try {
      const response = await api.get(`orders/${orderId}`)
      setOrder(response.data.data)

      console.log(response.data.data)
    } catch (error) {

    }
  }

  const handleCopy =  () => {
    Clipboard.setString(order.payment_code);
    alert('Teks berhasil disalin!');
  }

  useEffect(() => {
    initializeState()
  }, [])

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 10, backgroundColor: '#fff' }}>
        <Text
          style={{ fontFamily: 'Poppins-SemiBold', fontSize: 22, color: '#000' }}>
          Order Information
        </Text>
        <Text
          style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: '#000' }}>
          Delivery to
        </Text>

        <View
          style={{
            borderRadius: 5,
            borderColor: '#ccc',
            // borderWidth: 1,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* <Image
            style={{ width: 100, height: 100, marginRight: 10 }}
            source={{
              uri: 'https://img.freepik.com/premium-vector/folded-location-map-with-marker-city-map-with-pin-pointer_349999-746.jpg?w=2000',
            }}
          /> */}
          <View>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                style={{ marginTop: 5 }}
                color="grey"
                icon={faAddressCard}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#000',
                  width: 180,
                  marginLeft: 10,
                }}>
                {order.shipping_address}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                style={{ marginTop: 5 }}
                color="grey"
                icon={faUser}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  color: '#000',
                  width: 180,
                  marginLeft: 10,
                }}>
                {order.user?.name}
              </Text>
            </View>

          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: '#eee',
          flexDirection: 'row',
          padding: 5,
          justifyContent: 'space-between',
        }}>
      </View>
      <View style={{ padding: 10, backgroundColor: '#fff' }}>
        <Text
          style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: '#000', marginBottom: 10 }}>
          Payment Details
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text>Status </Text>
          <Text>: {order.status_label}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text>Virtual Number </Text>
            <Text>: {order.payment_code}</Text>
          </View>
          <View>
            <TouchableHighlight onPress={handleCopy}>
              <Text><MaterialIcon name="content-copy" size={20} color="#000" /></Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#eee',
          flexDirection: 'row',
          padding: 5,
          justifyContent: 'space-between',
        }}>
      </View>

      <View style={{ backgroundColor: '#fff', padding: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12, color: TextColorSecondary }}>Items</Text>
        <View>
          {
            order.items.map(item => {
              return (
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 5, marginRight: 10 }}
                    source={{
                      uri: BASE_URL_ASSET + item.product.assets[0].filename,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        color: '#000',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 14,
                      }}>
                      {numberFormat(item.price_after_disc)}
                    </Text>
                  </View>
                </View>
              )
            })
          }

        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              color: '#000',
            }}>
            Subtotal (1 item)
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
            }}>
            Rp. {numberFormat(order.items.reduce((sum, item) => sum + item.price_after_disc, 0))}
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              color: '#000',
            }}>
            Shipping Cost
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
            }}>
            Rp. {numberFormat(order.shipping_amount)}
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              color: '#000',
            }}>
            Total
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
            }}>
            Rp. {numberFormat(order.total_amount)}
          </Text>
        </View>
      </View>

      <View
        style={{ backgroundColor: '#eee', flexDirection: 'row', padding: 10 }}>
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#000' }}>
          Note
        </Text>
      </View>

      <View style={{ backgroundColor: '#fff', flex: 1, padding: 10 }}>
        <Text
          style={{
            backgroundColor: '#f7f7f7',
            height: 70,
            padding: 10,
            borderRadius: 5,
          }}>
          this is a note
        </Text>
      </View>
    </ScrollView>
  );
};

export default Order;
