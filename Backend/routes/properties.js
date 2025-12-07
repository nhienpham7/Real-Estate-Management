const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        u.Name as agent_name,
        h.Number_of_rooms as house_rooms,
        h.Square_footage as house_sqft,
        a.Number_of_rooms as apt_rooms,
        a.Square_footage as apt_sqft,
        a.Building_type,
        c.Number_of_rooms as comm_rooms,
        c.Type_of_business
      FROM Property p
      JOIN Agent ag ON p.Agent_id = ag.Agent_id
      JOIN User_Information u ON ag.Agent_id = u.User_id
      LEFT JOIN House h ON p.Property_id = h.Property_id
      LEFT JOIN Apartment a ON p.Property_id = a.Property_id
      LEFT JOIN Commercial_building c ON p.Property_id = c.Property_id
      WHERE p.Availability = 'Available'
      ORDER BY p.Property_id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        p.*,
        u.Name as agent_name,
        u.Email as agent_email,
        h.Number_of_rooms as house_rooms,
        h.Square_footage as house_sqft,
        a.Number_of_rooms as apt_rooms,
        a.Square_footage as apt_sqft,
        a.Building_type,
        c.Number_of_rooms as comm_rooms,
        c.Type_of_business
      FROM Property p
      JOIN Agent ag ON p.Agent_id = ag.Agent_id
      JOIN User_Information u ON ag.Agent_id = u.User_id
      LEFT JOIN House h ON p.Property_id = h.Property_id
      LEFT JOIN Apartment a ON p.Property_id = a.Property_id
      LEFT JOIN Commercial_building c ON p.Property_id = c.Property_id
      WHERE p.Property_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create property (agent only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.userRole !== 'agent') {
      return res.status(403).json({ message: 'Only agents can create properties' });
    }

    const {
      description, price, availability, crimes_rate, nearby_school,
      property_type, number_of_rooms, square_footage, building_type, type_of_business
    } = req.body;

    // Insert property
    const propertyResult = await pool.query(
      `INSERT INTO Property (Description, Price, Availability, Crimes_rate, Nearby_school, Agent_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING Property_id`,
      [description, price, availability || 'Available', crimes_rate || 0, nearby_school, req.userId]
    );

    const propertyId = propertyResult.rows[0].property_id;

    // Insert into subtype table
    if (property_type === 'house') {
      await pool.query(
        'INSERT INTO House (Property_id, Number_of_rooms, Square_footage) VALUES ($1, $2, $3)',
        [propertyId, number_of_rooms, square_footage]
      );
    } else if (property_type === 'apartment') {
      await pool.query(
        'INSERT INTO Apartment (Property_id, Number_of_rooms, Square_footage, Building_type) VALUES ($1, $2, $3, $4)',
        [propertyId, number_of_rooms, square_footage, building_type]
      );
    } else if (property_type === 'commercial') {
      await pool.query(
        'INSERT INTO Commercial_building (Property_id, Number_of_rooms, Type_of_business) VALUES ($1, $2, $3)',
        [propertyId, number_of_rooms, type_of_business]
      );
    }

    res.status(201).json({ 
      message: 'Property created successfully',
      propertyId 
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property (agent only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.userRole !== 'agent') {
      return res.status(403).json({ message: 'Only agents can update properties' });
    }

    const { id } = req.params;
    const { description, price, availability, crimes_rate, nearby_school } = req.body;

    // Check ownership
    const checkOwner = await pool.query(
      'SELECT * FROM Property WHERE Property_id = $1 AND Agent_id = $2',
      [id, req.userId]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    await pool.query(
      `UPDATE Property SET Description = $1, Price = $2, Availability = $3, 
       Crimes_rate = $4, Nearby_school = $5 WHERE Property_id = $6`,
      [description, price, availability, crimes_rate, nearby_school, id]
    );

    res.json({ message: 'Property updated successfully' });

  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property (agent only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.userRole !== 'agent') {
      return res.status(403).json({ message: 'Only agents can delete properties' });
    }

    const { id } = req.params;

    // Check ownership
    const checkOwner = await pool.query(
      'SELECT * FROM Property WHERE Property_id = $1 AND Agent_id = $2',
      [id, req.userId]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await pool.query('DELETE FROM Property WHERE Property_id = $1', [id]);

    res.json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;