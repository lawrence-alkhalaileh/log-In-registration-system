import express from "express";
import pool from "../db.js";
import { compare, genSalt, hash } from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";
import validationCheck from "../middleware/validInfo.js";
import { authorization } from "../middleware/authorization.js";

const router = express.Router();

router.post("/register", validationCheck, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json("user already exists");
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    //  jwt auth

    const token = jwtGenerator(newUser.rows[0].user_id);

    return res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

router.post("/login", validationCheck, async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );

    if (!userCheck.rows.length) {
      return res.status(401).json("user not found, try register!");
    }

    const user = userCheck.rows[0];

    const isValidPassword = await compare(password, user.user_password);

    if (!isValidPassword) {
      return res.status(401).json("incorrect password");
    }

    const token = jwtGenerator(user.user_id);
    return res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("server error");
  }
});

export default router;
