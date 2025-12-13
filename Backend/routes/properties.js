import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name AS agent_name
      FROM property p
      JOIN agent a ON p.agent_id = a.agent_id
      JOIN user_information u ON a.agent_id = u.user_id
      ORDER BY p.property_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET property with subtype info
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM property WHERE property_id = $1`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;