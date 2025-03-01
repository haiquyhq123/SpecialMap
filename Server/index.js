const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());

// Get user
app.get('/api/users', (req, res) => {
  res.json({ message: 'Get user successful' });
});

// Create user
app.post('/api/users', (req, res) => {
  const { username, email } = req.body;
  res.status(201).json({
    message: 'Create user',
    createdUser: { username, email }
  });
});

// modify user
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;
  res.json({
    message: `Modify ${userId} successful.`,
    updatedData: { username, email }
  });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  // 
  res.json({
    message: `Delete ${userId} successful.`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server start port number ${PORT}.`);
});
