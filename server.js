require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = express();
const path = require('path');

// Generate a secret key for JWT signing
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

const muser = process.env.MONGODB_USERNAME;
const mpass = process.env.MONGODB_PASSWORD;
const db = process.env.MONGODB_DATABASE;

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
const uri = `mongodb+srv://${muser}:${mpass}@alphadbv1.9q93m.mongodb.net/${db}?retryWrites=true&w=majority`;

// Route for handling the registration form submission
app.post('/register', async (req, res) => {
  const { username, email, location, password } = req.body;

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
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Insert the registration details into the collection
    await collection.insertOne({ username, email, location, password: hashedPassword });

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

// Route for handling the login request
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  let client;

  try {
    client = new MongoClient(uri);

    await client.connect();
    console.log('Connected to MongoDB');

    const collection = client.db('SkyWise').collection('users');

    // Find the user with the provided username
    const user = await collection.findOne({ username });

    if (!user) {
      // User not found
      return res.status(401).json({ success: false, message: 'Invalid Username' });
    }

    // Hash the provided password and compare it with the stored password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedPassword !== user.password) {
      // Passwords don't match
      return res.status(401).json({ success: false, message: 'Invalid Password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

    // Login successful, send the token as a response
    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.log('Error during login:', error);

    res.status(500).json({ success: false, message: 'Login failed' });
  } finally {
    // Close the MongoDB connection if the client is defined
    if (client) {
      client.close();
      console.log('Disconnected from MongoDB');
    }
  }
});

// Protected route
app.get('/protected', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token not provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    const { username } = decoded;

    console.log('Protected route accessed by:', username);
    // Perform any necessary actions for the protected route
    // ...

    res.json({ success: true, message: 'Protected route accessed successfully.' });
  });
});

// Middleware for verifying JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token not provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    req.decoded = decoded;
    next();
  });
};

// ...

// Route for fetching the user's favorite location
app.get('/api/user/favorite-location', verifyToken, (req, res) => {
  // Extract the username from the decoded token
  const { username } = req.decoded;

  let client;

  try {
    client = new MongoClient(uri);

    client.connect(async (error) => {
      if (error) {
        console.log('Error connecting to MongoDB:', error);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      console.log('Connected to MongoDB');

      const collection = client.db('SkyWise').collection('users');

      // Find the user with the provided username
      const user = await collection.findOne({ username });

      if (!user) {
        // User not found
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Send the favorite location as a response
      res.status(200).json({ success: true, favoriteLocation: user.location });
    });
  } catch (error) {
    console.log('Error fetching favorite location:', error);

    res.status(500).json({ success: false, message: 'Server error' });
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
