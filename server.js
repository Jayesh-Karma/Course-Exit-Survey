const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require("dotenv").config();
const app = express();
const PORT =  5000;
// const HOST= process.env.HOST;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(`mongodb://0.0.0.0:27017/Final-feedbackdb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Feedback model
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enrollment: {
    type: String,
    required: true,
    unique: true,
  },
  selectedCourse: {
    type: String,
    required: true,
  },
  selectedBranch: {
    type: String,
    required: true,
  },
  selectedSemester: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  subjects: {
    type: Map,
    of: {
      type: Map,
      of: String,
    },
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/submit-feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback({
      name: req.body.name,
      enrollment: req.body.rollNo, // Assuming rollNo is the enrollment field
      selectedCourse: req.body.course,
      selectedBranch: req.body.branch,
      selectedSemester: req.body.semester,
      session: req.body.session,
      subjects: req.body.subjects,
    });

    const savedFeedback = await newFeedback.save();
    // console.log('Feedback saved:', savedFeedback);
    res.json({ message: 'Data received and saved successfully.' });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.enrollment) {
      // Enrollment field is not unique
      res.json({ error: 'Enrollment must be unique.' });
    } else {
      console.error('Error saving data to MongoDB:', error);
      res.json({ error: 'Internal Server Error' });
    }
  }
});
app.get('/get-all-feedback', async (req, res) => {
  try {
    const allFeedback = await Feedback.find();
    res.json(allFeedback);
  } catch (error) {
    console.error('Error retrieving feedback data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// allowed username and password
const allowedUsername = 'admin';
const allowedPassword = 'admin'; // replace with a secure password 

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check 
    if (username === allowedUsername && password === allowedPassword) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// app.listen(PORT,HOST, () => {
//   console.log(`Server is running on port http://${HOST}:${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Server is running on port at${PORT}`);
});
