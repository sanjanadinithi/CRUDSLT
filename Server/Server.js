const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoute = require('./routes/books');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection - PROPERLY FORMATTED CONNECTION STRING
mongoose.connect('mongodb+srv://sanjana_123:1234@cluster0.hchvybm.mongodb.net/bookDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Database connected successfully!"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/books', bookRoute);

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});