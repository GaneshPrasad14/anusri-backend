
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin credentials
const adminCredentials = {
  username: 'admin@anusriapparels',
  password: 'AnusriApparels$'
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if credentials match
    if (username !== adminCredentials.username || password !== adminCredentials.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: 'admin', username: adminCredentials.username },
      'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        username: adminCredentials.username,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
