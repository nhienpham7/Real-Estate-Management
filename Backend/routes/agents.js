import express from "express";
import pool from "../db.js";
const router = express.Router();

// GET all agents with their user info
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, u.name, u.email
      FROM agent a
      JOIN user_information u ON a.agent_id = u.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;