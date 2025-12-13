import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name AS renter_name, a.street AS billing_address
      FROM credit_card c
      JOIN renter r ON c.renter_id = r.renter_id
      JOIN user_information u ON r.renter_id = u.user_id
      JOIN address a ON c.address_id = a.address_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;