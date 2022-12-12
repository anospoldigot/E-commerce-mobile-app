import React from 'react';
import {View,ScrollView} from 'react-native';

import Header from '../components/Header';
import Products from '../components/Products';
import Catagories from '../components/Catagories';

const Dashboard = ({route,navigation}) => {
  return (
    <View>
      <Header heading="Dashboard" navigation={navigation} />
      <ScrollView>
      <Catagories route={route} navigation={navigation} />
      
      </ScrollView>
    </View>
  );
};

export default Dashboard;
