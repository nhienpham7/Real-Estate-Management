import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name, u.email
      FROM renter r
      JOIN user_information u ON r.renter_id = u.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;