import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import api from '../utils/api';
import { Skeleton } from '@rneui/themed';

const Orders = ({ navigation }) => {
  const [selected, setSelected] = useState('ongoing');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initializeState = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('orders');
      setOrders(response.data.data)
      setIsLoading(false)
    } catch (error) {

    }
  }

  useEffect(() => {
    initializeState()
  }, [])

  const [index, setIndex] = useState(0);
  

  return (
    
    <View>
      <View style={styles.switch}>
        <Pressable
          onPress={() => setSelected('ongoing')}
          style={
            selected === 'ongoing' ? styles.switchBtnSelected : styles.switchBtn
          }>
          <Text
            style={
              selected === 'ongoing'
                ? styles.switchTextSelected
                : styles.switchText
            }>
            Ongoing
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelected('history')}
          style={
            selected === 'history' ? styles.switchBtnSelected : styles.switchBtn
          }>
          <Text
            style={
              selected === 'history'
                ? styles.switchTextSelected
                : styles.switchText
            }>
            History
          </Text>
        </Pressable>
      </View>
      <ScrollView style={{ padding: 20 }}>
        {
          isLoading ?
            <View>
              <Skeleton animation="pulse" width={'100%'} height={50} style={{ marginBottom: 15 }} />
              <Skeleton animation="pulse" width={'100%'} height={50} style={{ marginBottom: 15 }} />
              <Skeleton animation="pulse" width={'100%'} height={50} style={{ marginBottom: 15 }} />
            </View> :
            orders.map(order => {
              return (
                <Pressable
                  key={order.id}
                  onPress={() => navigation.navigate('Order', { orderId: order.id })}
                  style={styles.orderItem}>
                  <View>
                    <Text style={styles.orderNo}>{order.invoice_number}</Text>
                    <Text style={styles.orderItemCount}>{order.items.length} items</Text>
                  </View>
                  <View
                    style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <FontAwesomeIcon icon={faChevronDown} />
                    <Text style={styles.orderDate}>Date: {order.created_at}</Text>
                  </View>
                </Pressable>
              )
            })
        }

        {/* <Pressable
          onPress={() => navigation.navigate('Order')}
          style={styles.orderItem}>
          <View>
            <Text style={styles.orderNo}>Order Number. 111</Text>
            <Text style={styles.orderItemCount}>2 items</Text>
          </View>
          <View
            style={{alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <FontAwesomeIcon icon={faChevronDown} />
            <Text style={styles.orderDate}>Date: 10.01.2022</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Order')}
          style={styles.orderItem}>
          <View>
            <Text style={styles.orderNo}>Order Number. 111</Text>
            <Text style={styles.orderItemCount}>2 items</Text>
          </View>
          <View
            style={{alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <FontAwesomeIcon icon={faChevronDown} />
            <Text style={styles.orderDate}>Date: 10.01.2022</Text>
          </View>
        </Pressable> */}
      </ScrollView>
    </View>
  );
};

export default Orders;
