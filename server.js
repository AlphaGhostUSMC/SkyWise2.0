require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request body
app.use(express.json());

// Define a route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/app.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'app.html'));
});

// MongoDB connection string
const uri = 'mongodb+srv://AlphaDBAdmin2:Zoo05rF9PMR3UeGG@alphadbv1.9q93m.mongodb.net/SkyWise?retryWrites=true&w=majority';

// Route for handling the registration form submission
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate the registration details here (same validation logic as in auth.js)
  // ...

  let client; // Declare the client variable outside the try block

  try {
    client = new MongoClient(uri);

    await client.connect();
    console.log('Connected to MongoDB');

    const collection = client.db('SkyWise').collection('users');

    // Check if the username or email already exists in the collection
    const existingUser = await collection.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log('User already exists:', existingUser);

      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the registration details into the collection
    await collection.insertOne({ username, email, password: hashedPassword });

    console.log('Registration details stored in MongoDB');

    // Redirect to the login.html page
    res.redirect('/login.html');
  } catch (error) {
    console.log('Error storing registration details:', error);

    res.status(500).json({ success: false, message: 'Registration failed' });
  } finally {
    // Close the MongoDB connection if the client is defined
    if (client) {
      client.close();
      console.log('Disconnected from MongoDB');
    }
  }
});

// Start the server
const port = 5050; // Change this to the desired port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
