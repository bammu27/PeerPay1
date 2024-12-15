import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../urlconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from '../../context'

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const {changeT, updatechgeT} = useAppContext()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const receiverId = await AsyncStorage.getItem("userId");
        if (receiverId) {
          const response = await axios.get(`http://${BASE_URL}/notifications/${receiverId}`);
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [changeT]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.notificationItem, item.read ? styles.read : styles.unread]}>
      <View style={styles.transactionInfo}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.transactionDetails}>
          {item.transaction_id?.amount} due on {new Date(item.transaction_id?.dueDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (

    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No notifications yet!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF4E3', // Light gray background for cleanliness
    flex: 1,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 22,
    color: '#5F6368', // Soft gray for the empty state
    fontFamily: 'OpenSans-Regular', // Clean sans-serif font for readability
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: '#ffffff', // White background for cards
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  unread: {
    borderLeftWidth: 5,
    borderColor: '#6200EE', // Purple accent for unread notifications
  },
  read: {
    borderLeftWidth: 5,
    borderColor: '#B0BEC5', // Subtle gray for read notifications
  },
  transactionInfo: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#333', // Dark text for message
    fontFamily: 'OpenSans-Regular',
    marginBottom: 8,
    fontWeight:'700'
     
  },
  transactionDetails: {
    fontSize: 12,
    color: '#555', // Slightly lighter text for transaction details
    fontFamily: 'OpenSans-Light',
    
  },
});

export default Notifications;
