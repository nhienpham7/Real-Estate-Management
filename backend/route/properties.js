const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const checkUser = await pool.query(
      'SELECT * FROM User_Information WHERE Email = $1',
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into User_Information
    const result = await pool.query(
      'INSERT INTO User_Information (Email, Name, Password) VALUES ($1, $2, $3) RETURNING User_id',
      [email, name, hashedPassword]
    );

    const userId = result.rows[0].user_id;

    // Insert into Agent or Renter table based on role
    if (role === 'agent') {
      await pool.query(
        'INSERT INTO Agent (Agent_id, Agency, Job_title) VALUES ($1, $2, $3)',
        [userId, 'Independent', 'Agent']
      );
    } else if (role === 'renter') {
      await pool.query(
        'INSERT INTO Renter (Renter_id, Budget, Preferred_location) VALUES ($1, $2, $3)',
        [userId, 0, 'Any']
      );
    }

    // Generate token
    const token = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const result = await pool.query(
      'SELECT * FROM User_Information WHERE Email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Determine role
    const agentCheck = await pool.query(
      'SELECT * FROM Agent WHERE Agent_id = $1',
      [user.user_id]
    );
    const renterCheck = await pool.query(
      'SELECT * FROM Renter WHERE Renter_id = $1',
      [user.user_id]
    );

    let role = 'user';
    if (agentCheck.rows.length > 0) role = 'agent';
    else if (renterCheck.rows.length > 0) role = 'renter';

    // Generate token
    const token = jwt.sign(
      { userId: user.user_id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;