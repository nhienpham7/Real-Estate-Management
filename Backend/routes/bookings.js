import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, u.name AS renter_name, a.agency AS agent_name
      FROM booking b
      JOIN renter r ON b.renter_id = r.renter_id
      JOIN user_information u ON r.renter_id = u.user_id
      JOIN agent a ON b.agent_id = a.agent_id
      ORDER BY b.booking_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;