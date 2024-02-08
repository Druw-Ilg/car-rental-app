/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = (props) => {
  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => props.navigation.closeDrawer()}>
        <Icon name="close" size={30} color="#000" />
      </TouchableOpacity>

      {/* Drawer content */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* Add additional items as needed */}
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay color
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});



export default CustomDrawerContent;
