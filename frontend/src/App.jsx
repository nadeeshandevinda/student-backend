import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// 🔥 ඔයාගේ Live Render Link එක
const API_URL = "https://student-backend-jzaa.onrender.com";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  // 1. READ: දත්ත ගැනීම
  const loadStudents = () => {
    // URL එක වෙනස් කළා
    axios.get(`${API_URL}/students`)
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  };

  // 2. CREATE: ඇතුලත් කිරීම
  const handleSubmit = (e) => {
    e.preventDefault();
    // /add-student නෙමෙයි, දැන් /students (Standard)
    axios.post(`${API_URL}/students`, { name, age, city })
      .then(() => {
        alert("Student Added Successfully!");
        loadStudents(); 
        setName(""); setAge(""); setCity(""); 
      })
      .catch(err => console.error(err));
  };

  // 3. DELETE: ඉවත් කිරීම
  const handleDelete = (id) => {
    // /delete-student නෙමෙයි, දැන් /students/${id}
    axios.delete(`${API_URL}/students/${id}`)
      .then(() => {
        alert("Student Deleted!");
        loadStudents();
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "50px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🎓 Student Management System (Live)</h1>
      <p style={{ textAlign: "center", color: "green" }}>Connected to Render Server ✅</p>

      {/* --- FORM --- */}
      <form onSubmit={handleSubmit} style={{ 
          maxWidth: "500px", margin: "0 auto 30px", padding: "20px", 
          border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" 
      }}>
        <div style={{ marginBottom: "10px" }}>
          <input 
            type="text" placeholder="Name" value={name} 
            onChange={(e) => setName(e.target.value)} required 
            style={{ width: "95%", padding: "10px", marginBottom: "10px" }}
          />
          <input 
            type="number" placeholder="Age" value={age} 
            onChange={(e) => setAge(e.target.value)} required 
            style={{ width: "95%", padding: "10px", marginBottom: "10px" }}
          />
          <input 
            type="text" placeholder="City" value={city} 
            onChange={(e) => setCity(e.target.value)} required 
            style={{ width: "95%", padding: "10px", marginBottom: "10px" }}
          />
        </div>
        <button type="submit" style={{ 
            width: "100%", padding: "12px", backgroundColor: "#28a745", 
            color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" 
        }}>
          Add Student 🚀
        </button>
      </form>

      {/* --- LIST --- */}
      <ul style={{ maxWidth: "600px", margin: "0 auto", padding: 0 }}>
        {students.map((student) => (
          <li key={student._id} style={{ 
              backgroundColor: "#f9f9f9", marginBottom: "10px", padding: "15px", 
              borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <span>
              <strong>{student.name}</strong> <span style={{ color: "#555" }}>({student.age} years)</span> - {student.city}
            </span>
            <button 
              onClick={() => handleDelete(student._id)}
              style={{ 
                  backgroundColor: "#dc3545", color: "white", border: "none", 
                  padding: "8px 12px", borderRadius: "5px", cursor: "pointer" 
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App