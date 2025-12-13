import express from "express";
import pool from "../db.js";
const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM user_information`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;