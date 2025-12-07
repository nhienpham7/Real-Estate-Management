const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT User_id, Email, Name FROM User_Information WHERE User_id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get addresses
    const addressesResult = await pool.query(
      'SELECT * FROM Address WHERE User_id = $1',
      [req.userId]
    );

    // Get credit cards
    const cardsResult = await pool.query(
      'SELECT Credit_card_id, Card_number, Address_id FROM Credit_card WHERE Renter_id = $1',
      [req.userId]
    );

    // Get role-specific info
    let roleInfo = {};
    if (req.userRole === 'agent') {
      const agentResult = await pool.query(
        'SELECT Agency, Job_title FROM Agent WHERE Agent_id = $1',
        [req.userId]
      );
      roleInfo = agentResult.rows[0] || {};
    } else if (req.userRole === 'renter') {
      const renterResult = await pool.query(
        'SELECT Budget, Desired_move_in_date, Preferred_location, Point FROM Renter WHERE Renter_id = $1',
        [req.userId]
      );
      roleInfo = renterResult.rows[0] || {};
    }

    res.json({
      ...user,
      role: req.userRole,
      roleInfo,
      addresses: addressesResult.rows,
      cards: cardsResult.rows
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add address
router.post('/addresses', auth, async (req, res) => {
  try {
    const { street, city, state, postal_code } = req.body;

    const result = await pool.query(
      'INSERT INTO Address (Street, City, State, Postal_code, User_id) VALUES ($1, $2, $3, $4, $5) RETURNING Address_id',
      [street, city, state, postal_code, req.userId]
    );

    res.status(201).json({ 
      message: 'Address added successfully',
      addressId: result.rows[0].address_id 
    });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update address
router.put('/addresses/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, postal_code } = req.body;

    const checkOwner = await pool.query(
      'SELECT * FROM Address WHERE Address_id = $1 AND User_id = $2',
      [id, req.userId]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pool.query(
      'UPDATE Address SET Street = $1, City = $2, State = $3, Postal_code = $4 WHERE Address_id = $5',
      [street, city, state, postal_code, id]
    );

    res.json({ message: 'Address updated successfully' });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete address
router.delete('/addresses/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const checkOwner = await pool.query(
      'SELECT * FROM Address WHERE Address_id = $1 AND User_id = $2',
      [id, req.userId]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pool.query('DELETE FROM Address WHERE Address_id = $1', [id]);

    res.json({ message: 'Address deleted successfully' });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add credit card
router.post('/cards', auth, async (req, res) => {
  try {
    const { card_number, address_id } = req.body;

    const result = await pool.query(
      'INSERT INTO Credit_card (Card_number, Address_id, Renter_id) VALUES ($1, $2, $3) RETURNING Credit_card_id',
      [card_number, address_id, req.userId]
    );

    res.status(201).json({ 
      message: 'Card added successfully',
      cardId: result.rows[0].credit_card_id 
    });

  } catch (error) {
    console.error('Add card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete credit card
router.delete('/cards/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const checkOwner = await pool.query(
      'SELECT * FROM Credit_card WHERE Credit_card_id = $1 AND Renter_id = $2',
      [id, req.userId]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pool.query('DELETE FROM Credit_card WHERE Credit_card_id = $1', [id]);

    res.json({ message: 'Card deleted successfully' });

  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;