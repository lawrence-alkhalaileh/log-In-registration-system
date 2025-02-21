import { Router } from "express";
import pool from "../db.js";
import { authorization } from "../middleware/authorization.js";

const dashboard = Router();

dashboard.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

export default dashboard;
