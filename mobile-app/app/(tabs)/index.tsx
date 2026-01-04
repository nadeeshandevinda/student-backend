import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';

// 🔥 ඔයාගේ Live Render Link එක
const API_URL = "https://student-backend-jzaa.onrender.com/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Inputs
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // 1. READ: Data ගන්න
  const loadData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setStudents(json);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
    }
  };

  // 2. CREATE: Data ඇතුලත් කරන (Age එක Number එකක් කරා)
  const addStudent = async () => {
    if (name === "" || age === "" || city === "") {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 👇 Age එක Number එකක් බවට හරවලා යවනවා (parseInt)
        body: JSON.stringify({ name, age: parseInt(age), city })
      });

      if (response.ok) {
        Alert.alert("Success", "Student Added Successfully!");
        setName(""); setAge(""); setCity(""); 
        loadData(); 
      } else {
        // Error එක මොකක්ද කියලා හරියටම බලාගන්න
        const errorText = await response.text();
        Alert.alert("Error", "Server Error: " + errorText);
      }

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // 3. DELETE: Data මකන කොටස
  const deleteStudent = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this student?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                Alert.alert("Deleted", "Student removed!");
                loadData(); // ලිස්ට් එක අලුත් කරමු
              } else {
                Alert.alert("Error", "Failed to delete");
              }
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Manager (CRUD) 🚀</Text>

      {/* Form Section */}
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
        <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
        
        <TouchableOpacity style={styles.addButton} onPress={addStudent}>
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>
      </View>

      {/* List Section */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>Age: {item.age} | City: {item.city}</Text>
              </View>
              {/* 👇 Delete Button එක */}
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteStudent(item._id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f0f2f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  
  form: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 3 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, fontSize: 16 },
  addButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  card: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  details: { color: '#555' },
  
  deleteButton: { backgroundColor: '#dc3545', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  deleteText: { color: 'white', fontWeight: 'bold' }
});