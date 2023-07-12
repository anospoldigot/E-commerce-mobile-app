import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { ProductStore } from '../store/product';
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../utils/api';
import { BASE_URL_ASSET } from '../store/url';
import { Picker } from '@react-native-picker/picker';
import { numberFormat } from '../utils/currency';
import { observer } from 'mobx-react';
import { Button } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { PrimaryColor } from '../styles/theme';
import styles from '../styles';
import { ToastAndroid } from 'react-native';

const Checkout = observer(({ navigation }) => {
  const { getCheckedCart } = ProductStore;

  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');

  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [paymentFee, setPaymentFee] = useState(0)
  const [shippingCost, setShippingCost] = useState(0)
  const [voucherAmount, setVoucherAmount] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [ppnAmount, setPpnAmount] = useState(0)

  const [paymentName, setPaymentName] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(0);


  const initializeState = async () => {
    try {
      const payments = await api.get('payments', {
        params: {
          amount: items.reduce((sum, item) => sum + item.real_price, 0)
        }
      });
      setPayments(payments.data.data);
      const couriers = await api.get('couriers');
      setCouriers(couriers.data.data);

      const addresses = await api.get('address');
      setAddresses(addresses.data.data);
      const address = addresses.data.data.find(address => address.is_priority > 0);
      setSelectedAddress(address.id);

    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeCourier = async (itemValue) => {
    try {
      const courier_code = itemValue.split('&')[0]
      const courier_service_code = itemValue.split('&')[1]
      const response = await api.post(`couriers/check`, {
        items, courier: courier_code, address_id: selectedAddress
      });

      const courier = response.data.data.find(value => {
        if (value.courier_code == courier_code && value.courier_service_code == courier_service_code) {
          return value;
        }
      })
      setShippingCost(courier.price)
      setSelectedCourier(itemValue)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeAddress = (itemValue) => {
    setSelectedAddress(itemValue)
  }

  const handleChangePayment = (paymentMethod) => {
    setSelectedPayment(paymentMethod)

    const payment = payments.find(payment => payment.paymentMethod == paymentMethod)
    console.log(payment)
    setPaymentName(payment.paymentName)
    setPaymentFee(payment.totalFee)
    setPaymentMethod(paymentMethod)
  }

  const handlePay = async () => {
    try {
      const payload = {
        totalAmount   : total,
        subtotal      : subtotal,
        shippingCost  : shippingCost,
        voucherAmount : voucherAmount,
        ppnAmount     : ppnAmount,
        paymentName   : paymentName,
        paymentMethod : paymentMethod,
        paymentFee    : paymentFee,
        addressId     : selectedAddress,
        products      : items.map(item => {
          return {
            id        : item.id,
            title     : item.title,
            sku       : item.sku,
            price     : item.price,
            real_price: item.real_price,
            quantity  : item.quantity,
          }
        }),
      }
      console.log(payload);
      const response = await api.post('orders', payload);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
    } catch (error) {
      console.error(error)
    }

  }


  useEffect(() => {
    const carts = getCheckedCart();
    setItems(carts.map((value) => {
      const result    =  value.product;
      result.quantity = value.quantity

      return result;
    }))
    setSubtotal(carts.map((value) => value.product).reduce((sum, item) => sum + item.real_price, 0));

    initializeState();
  }, [])

  useEffect(() => {
    setTotal(parseInt(subtotal) + parseInt(shippingCost) + parseInt(paymentFee))
  }, [items, shippingCost, paymentFee])

  return (
    <ScrollView>
      <View style={style.container}>
        <View style={{ marginBottom: 40 }}>
          <Text style={style.heading}>order items</Text>
          {
            items.map(item => {
              return (
                <View style={{
                  flexDirection: 'row',
                  marginBottom: 10
                }}>
                  <Image
                    style={{ width: 100, height: 100, borderRadius: 5, marginRight: 10 }}
                    source={{
                      uri: BASE_URL_ASSET + item.assets[0].filename
                    }} />
                  <View style={{ justifyContent: 'space-between' }}>
                    <Text>{item.title}</Text>
                    <Text>Rp. {numberFormat(item.real_price)}</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text>
            Alamat Pengiriman
          </Text>
          <Picker
            selectedValue={selectedAddress}
            onValueChange={handleChangeAddress}
          >
            <Picker.Item label={'Pilih Alamat'} value={''} />
            {
              addresses.map(address => {
                return (
                  <Picker.Item label={address.detail} value={address.id} key={address.id} />
                )
              })
            }
          </Picker>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text>
            Metode Pembayaran
          </Text>
          <Picker
            selectedValue={selectedPayment}
            onValueChange={handleChangePayment}
          >
            <Picker.Item label={'Pilih Pembayaran'} value={''} />
            {
              payments.map(payment => {
                return (
                  <Picker.Item label={payment.paymentName} value={payment.paymentMethod} key={payment.paymentMethod} />
                )
              })
            }
          </Picker>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text>
            Kurir Pengiriman
          </Text>
          <Picker
            selectedValue={selectedCourier}
            onValueChange={handleChangeCourier}
          >
            <Picker.Item label={'Pilih Pengiriman'} value={''} />
            {
              couriers.map(courier => {
                return (
                  <Picker.Item value={courier.courier_code + '&' + courier.courier_service_code}
                    label={courier.courier_name + ' - ' + courier.courier_service_name + ' (' + courier.shipment_duration_range + ' ' + courier.shipment_duration_unit + ')'} key={courier.courier_name + ' - ' + courier.courier_service_name + ' (' + courier.shipment_duration_range + ' ' + courier.shipment_duration_unit + ')'} />
                )
              })
            }
          </Picker>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text>
              Subtotal
            </Text>
            <Text>
              Rp. {numberFormat(subtotal)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text>
              Shipping Cost
            </Text>
            <Text>
              Rp. {numberFormat(shippingCost)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text>
              Payment Fee
            </Text>
            <Text>
              Rp. {numberFormat(paymentFee)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text>
              Total
            </Text>
            <Text>
              Rp. {numberFormat(total)}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handlePay} style={{
          ...styles.primaryBtn, width: '100%'
        }} >
          <Text style={{ ...styles.btnTextPrimary, color: '#fff' }}>Pay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
})

const style = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white'
  },
  heading: {
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
    marginBottom: 20,
    textTransform: 'uppercase'
  }

})

export default Checkout