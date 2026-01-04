const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// --- Database Connection (Devinda's DB) ---
const mongoURI = "mongodb+srv://devinda:devinda123@cluster0.bppuh4q.mongodb.net/?appName=Cluster0"; 

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ Connection Error:", err));

// --- Schema & Model ---
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    city: String
});
const Student = mongoose.model('Student', studentSchema);

// --- Routes (Standard REST API) ---

// 1. GET: Data ගන්න (App එකේ loadData)
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST: Data දාන්න (App එකේ addStudent)
// කලින් තිබ්බේ /add-student, දැන් දාන්නේ /students මයි.
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

// 3. DELETE: Data මකන්න (App එකේ deleteStudent)
// කලින් තිබ්බේ /delete-student/:id, දැන් /students/:id
app.delete('/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});