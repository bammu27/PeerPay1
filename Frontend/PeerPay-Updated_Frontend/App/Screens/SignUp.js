import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../urlconfig";



const SignUp = ({ navigation }) => {

  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [panCard, setPanCard] = useState("");
  const [aadharCard, setAadharCard] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  const handleSignUp = async () => {
    const payload = {
      name,
      aadhaar: aadharCard, // Remove spaces for backend validation
      pan: panCard,
      dob: dob.toISOString(), // Send in ISO format
      phone,
      email,
      address: { street, city, state, pincode: pinCode },
    };

    try {
      const response = await fetch(`http://${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userId', result.userId);
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("AadharVerify"); // Navigate to Login screen after success
      } else {
        Alert.alert("Error", result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handlePhoneChange = (text) => {
    if (/^\d*$/.test(text) && text.length <= 10) {
      setPhone(text);
    }
  };

  const handlePinCodeChange = (text) => {
    if (/^\d*$/.test(text) && text.length <= 6) {
      setPinCode(text);
    }
  };

  

  const handleAadharChange = (text) => {
    setAadharCard(text);
  };

  const handlePanChange = (text) => {
    const formatted = text.toUpperCase().slice(0, 10); // Ensure uppercase and length constraint
    setPanCard(formatted);
  };

  return (
    <ImageBackground
      style={styles.background}
     
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDobPicker(true)}
        >
          <Text>{dob.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDobPicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDobPicker(false);
              if (selectedDate) {
                setDob(selectedDate);
              }
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="numeric"
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="PAN Card Number"
          value={panCard}
          onChangeText={handlePanChange}
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="AadharCard Number in 4 4 4  forma"  
          value={aadharCard}
          onChangeText={handleAadharChange}
          keyboardType="TextInput"
          maxLength={14}
        />

        <TextInput
          style={styles.input}
          placeholder="State"
          value={state}
          onChangeText={setState}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          style={styles.input}
          placeholder="Street"
          value={street}
          onChangeText={setStreet}
        />

        <TextInput
          style={styles.input}
          placeholder="Pin Code"
          value={pinCode}
          onChangeText={handlePinCodeChange}
          keyboardType="numeric"
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
    
    width: "90%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "orange",
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SignUp;
