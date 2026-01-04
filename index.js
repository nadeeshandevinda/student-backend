const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Data කියවන්න මේක ඕනමයි

// Database Connection
mongoose.connect('mongodb+srv://nadeeshan:nadeeshan123@cluster0.mongodb.net/studentdb?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("DB Connected!"))
  .catch(err => console.error(err));

// Create Schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String
});

const Student = mongoose.model('Student', studentSchema);

// 1. Routes - READ (Data ගන්න)
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Routes - CREATE (Data දාන්න) - මේක තමයි ඔයාට නැත්තේ
app.post('/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json(newStudent);
    console.log("Student Added!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Routes - DELETE (Data මකන්න)
app.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});