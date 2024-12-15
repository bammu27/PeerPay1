import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';
import { Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../urlconfig';
import { useAppContext } from '../../context'

const PeerList = () => {
  const [users, setUsers] = useState([]);
  const [amount, setAmount] = useState('');
  const [distance, setDistance] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState({
    amount: '',
    description: '',
    duration: '',
  });


  
  const { changeT, updatechangeT } = useAppContext();
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`http://${BASE_URL}/users`);
      const formattedUsers = response.data.map((user) => ({
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
      const response = await axios.get(
        `http://${BASE_URL}/users/amount?amount=${amount}`
      );
      const formattedUsers = response.data.map((user) => ({
        ...user,
        interest_rate: user.interest_rate?.$numberDecimal || user.interest_rate,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      Alert.alert('Error', 'Users do not exist with an amount higher than that');
    }
  };

  const fetchUsersByDistance = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(
        `http://${BASE_URL}/users/${userId}/distance?distance=${distance}`
      );
      const formattedUsers = response.data.map((user) => ({
        ...user,
        interest_rate: user.interest_rate?.$numberDecimal || user.interest_rate,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      Alert.alert('Error', 'Users do not exist within that distance');
    }
  };

  const openRequestModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeRequestModal = () => {
    setTransactionDetails({ amount: '', description: '', duration: '' });
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleTransactionSubmit = async () => {
    try {
      const receiverId = await AsyncStorage.getItem('userId');
      const { amount, description, duration } = transactionDetails;

      if (!amount || !description || !duration) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      const payload = {
        sender_id: selectedUser._id,
        receiver_id: receiverId,
        amount,
        duration,
        description,
      };

      await axios.post(`http://${BASE_URL}/transaction/create`, payload);

      Alert.alert('Success', 'Transaction request created successfully');
      closeRequestModal();
      updatechangeT()
      updatechangeT()
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create transaction request');
    }
  };

  const renderUser = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Phone: {item.phone}</Text>
        <Text>Interest Rate: {item.interest_rate}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => openRequestModal(item)}>
          Request
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Directory</Text>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          placeholderTextColor="#6c757d"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.filterButton} onPress={fetchUsersByAmount}>
          <Text style={styles.filterButtonText}>Filter by Amount</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Distance (km)"
          placeholderTextColor="#6c757d"
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={fetchUsersByDistance}
        >
          <Text style={styles.filterButtonText}>Filter by Distance</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContainer}
      />

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeRequestModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Transaction Request</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Enter Amount"
                placeholderTextColor="#6c757d"
                keyboardType="numeric"
                value={transactionDetails.amount}
                onChangeText={(value) =>
                  setTransactionDetails((prev) => ({ ...prev, amount: value }))
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Description"
                placeholderTextColor="#6c757d"
                value={transactionDetails.description}
                onChangeText={(value) =>
                  setTransactionDetails((prev) => ({ ...prev, description: value }))
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Duration (days)"
                placeholderTextColor="#6c757d"
                keyboardType="numeric"
                value={transactionDetails.duration}
                onChangeText={(value) =>
                  setTransactionDetails((prev) => ({ ...prev, duration: value }))
                }
              />

              <View style={styles.modalActions}>
                <Button mode="outlined" onPress={closeRequestModal}>
                  Cancel
                </Button>
                <Button mode="contained" onPress={handleTransactionSubmit}>
                  Submit
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
});

export default PeerList;
