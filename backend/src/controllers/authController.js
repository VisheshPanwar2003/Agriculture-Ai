const User =
  require("../models/User");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

exports.signup =
  async (req, res) => {

    try {

      const name = typeof req.body?.name === "string"
        ? req.body.name.trim()
        : "";
      const email = typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
      const password = typeof req.body?.password === "string"
        ? req.body.password
        : "";

      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
        return res.status(400).json({
          detail: "Name, a valid email, and password are required",
        });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          detail: "Authentication is not configured",
        });
      }

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res.status(409).json({
          detail:
            "Email already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
        });

      const token =
        jwt.sign(
          {
            user_id:
              user._id.toString(),
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        token,

        user: {
          id:
            user._id.toString(),
          name:
            user.name,
          email:
            user.email,
        },
      });

    } catch (err) {

      if (err.code === 11000) {
        return res.status(409).json({
          detail: "Email already exists",
        });
      }

      res.status(500).json({ error: "Unable to create account" });
    }
  };

exports.login =
  async (req, res) => {

    try {

      const email = typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
      const password = typeof req.body?.password === "string"
        ? req.body.password
        : "";

      if (!email || !password) {
        return res.status(400).json({
          detail: "Email and password are required",
        });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          detail: "Authentication is not configured",
        });
      }

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(400).json({
          detail:
            "Invalid email or password",
        });
      }

      const valid =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!valid) {
        return res.status(400).json({
          detail:
            "Invalid email or password",
        });
      }

      const token =
        jwt.sign(
          {
            user_id:
              user._id.toString(),
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        token,

        user: {
          id:
            user._id.toString(),
          name:
            user.name,
          email:
            user.email,
        },
      });

    } catch (err) {

      console.error("Login error:", err.message);
      res.status(500).json({ error: "Unable to log in" });
    }
  };
