// Install required dependencies before starting:
// npm install axios react-native-paper react-native-elements

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  {BASE_URL}  from '../../urlconfig';

const PeerList = () => {
  const [users, setUsers] = useState([]);
  const [amount, setAmount] = useState('');
  const [distance, setDistance] = useState('');

  // Fetch all users on initial load
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`http://${BASE_URL}/users`);
      const formattedUsers = response.data.map(user => ({
        ...user,
        interest_rate: user.interest_rate?.$numberDecimal || user.interest_rate,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch users');
    }
  };

  const fetchUsersByAmount = async () => {
    try {
      const response = await axios.get(`http://192.168.105.194:3000/users/amount?amount=${amount}`);
      const formattedUsers = response.data.map(user => ({
        ...user,
        interest_rate: user.interest_rate?.$numberDecimal || user.interest_rate,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      Alert.alert( 'users does not exist more than that amount');
    }
  };

  const fetchUsersByDistance = async () => {

    
    try {
      const userId = await AsyncStorage.getItem("userId");
      console.log(userId);
     
      const response = await axios.get(
        `http://${BASE_URL}/users/${userId}/distance?distance=${distance}`
      );
      const formattedUsers = response.data.map(user => ({
        ...user,
        interest_rate: user.interest_rate?.$numberDecimal || user.interest_rate,
      }));
      Alert.alert('Success', 'Users fetched successfully')
      setUsers(formattedUsers);
    } catch (error) {
      Alert.alert('Error', "users doent exists within that distance");
    }
  };

  const handleRequest = (user) => {
    Alert.alert('Request Sent', `Request sent to ${user.name}`);
  };

  const renderUser = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Phone: {item.phone}</Text>
        <Text>Interest Rate: {item.interest_rate}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleRequest(item)}>
          Request
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Directory</Text>

      {/* Filter by Amount */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.filterButton} onPress={fetchUsersByAmount}>
          <Text style={styles.filterButtonText}>Filter by Amount</Text>
        </TouchableOpacity>
      </View>

      {/* Filter by Distance */}
      <View style={styles.filterContainer}>
    
       
        <TextInput
          style={styles.input}
          placeholder="Distance (km)"
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
        />
        <TouchableOpacity style={styles.filterButton} onPress={fetchUsersByDistance}>
          <Text style={styles.filterButtonText}>Filter by Distance</Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  filterButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PeerList;
