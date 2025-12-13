import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, u.name AS renter_name, p.description AS property_description
      FROM look l
      JOIN renter r ON l.renter_id = r.renter_id
      JOIN user_information u ON r.renter_id = u.user_id
      JOIN property p ON l.property_id = p.property_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;