import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // 1. දත්ත තියාගන්න තැන් (State)
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");

  // 2. පටන් ගන්නකොටම ඩේටා ටික ගෙන්න ගන්න (Read)
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    axios.get('http://localhost:3000/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  };

  // 3. අලුත් ළමයෙක් ඇතුලත් කිරීම (Create)
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/add-student', { name, age, city })
      .then(() => {
        alert("Student Added!");
        loadStudents(); // ලිස්ට් එක refresh කරනවා
        setName(""); setAge(""); setCity(""); // ෆෝම් එක හිස් කරනවා
      })
      .catch(err => console.error(err));
  };

  // 4. ළමයෙක් ඉවත් කිරීම (Delete)
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/delete-student/${id}`)
      .then(() => {
        loadStudents();
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>🎓 Student Management System</h1>

      {/* --- FORM එක --- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input 
          type="text" placeholder="Name" value={name} 
          onChange={(e) => setName(e.target.value)} required 
          style={{ margin: "5px", padding: "10px" }}
        />
        <input 
          type="number" placeholder="Age" value={age} 
          onChange={(e) => setAge(e.target.value)} required 
          style={{ margin: "5px", padding: "10px" }}
        />
        <input 
          type="text" placeholder="City" value={city} 
          onChange={(e) => setCity(e.target.value)} required 
          style={{ margin: "5px", padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "green", color: "white" }}>
          Add Student
        </button>
      </form>

      {/* --- LIST එක --- */}
      <ul>
        {students.map((student) => (
          <li key={student._id} style={{ borderBottom: "1px solid #ccc", padding: "10px", listStyle: "none" }}>
            <strong>{student.name}</strong> - {student.age} years old ({student.city}) 
            <button 
              onClick={() => handleDelete(student._id)}
              style={{ marginLeft: "10px", backgroundColor: "red", color: "white", border: "none", padding: "5px" }}
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
