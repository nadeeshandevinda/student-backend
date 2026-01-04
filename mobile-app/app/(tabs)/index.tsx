import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function App() {
  // --- මෙතනට ඔයාගේ මැෂින් එකේ IP එක දාන්න ---
  const API_URL = "http://192.168.1.173:3000"; 

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");

  // 1. Data Load කිරීම
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    axios.get(`${API_URL}/students`)
      .then(res => setStudents(res.data))
      .catch(err => console.log("Error loading data:", err));
  };

  // 2. Data ඇතුලත් කිරීම
  const addStudent = () => {
    if (!name || !age || !city) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    axios.post(`${API_URL}/add-student`, { name, age, city })
      .then(() => {
        Alert.alert("Success", "Student Added!");
        setName(""); setAge(""); setCity("");
        loadStudents();
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Error", "Could not connect to server");
      });
  };

  // 3. Data මැකීම
  const deleteStudent = (id) => {
    axios.delete(`${API_URL}/delete-student/${id}`)
      .then(() => {
        Alert.alert("Deleted", "Student removed");
        loadStudents();
      })
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Mobile Student App</Text>

      {/* --- FORM --- */}
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
      
      <Button title="Add Student" onPress={addStudent} />

      {/* --- LIST --- */}
      <FlatList
        data={students}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 20, width: '100%' }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.age} years - {item.city}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteStudent(item._id)} style={styles.deleteBtn}>
              <Text style={{color: 'white'}}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', width: '100%' },
  name: { fontSize: 18, fontWeight: 'bold' },
  deleteBtn: { backgroundColor: 'red', padding: 8, borderRadius: 5 }
});