const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // අලුතෙන් දාපු කෑල්ල
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // React එකට අවසර දීම

// --- Database Connection ---
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

// --- Routes (API Endpoints) ---

// 1. Create (දත්ත ඇතුලත් කිරීම)
app.post('/add-student', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.send("Student Saved!");
    } catch (err) {
        res.status(400).send("Error: " + err);
    }
});

// 2. Read (දත්ත බැලීම)
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
});

// 3. Update (දත්ත වෙනස් කිරීම)
app.put('/update-student/:id', async (req, res) => {
    try {
        // ID එකෙන් හොයලා ඩේටා වෙනස් කරනවා
        await Student.findByIdAndUpdate(req.params.id, req.body);
        res.send("Student Updated!");
    } catch (err) {
        res.status(400).send("Error: " + err);
    }
});

// 4. Delete (දත්ත මැකීම)
app.delete('/delete-student/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.send("Student Deleted!");
    } catch (err) {
        res.status(400).send("Error: " + err);
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});