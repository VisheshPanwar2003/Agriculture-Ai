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
            token_version: user.tokenVersion || 0,
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
            token_version: user.tokenVersion || 0,
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

exports.changePassword =
  async (req, res) => {
    try {
      const currentPassword = typeof req.body?.currentPassword === "string"
        ? req.body.currentPassword
        : "";
      const newPassword = typeof req.body?.newPassword === "string"
        ? req.body.newPassword
        : "";

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          detail: "Current password and new password are required",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          detail: "New password must be at least 8 characters",
        });
      }

      const user = await User.findById(req.user.user_id);
      if (!user) {
        return res.status(404).json({ detail: "Account not found" });
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ detail: "Current password is incorrect" });
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ detail: "Choose a password different from your current one" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.tokenVersion = (user.tokenVersion || 0) + 1;
      await user.save();

      const token = jwt.sign(
        {
          user_id: user._id.toString(),
          token_version: user.tokenVersion,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        detail: "Password changed successfully. Other devices have been signed out.",
        token,
      });
    } catch (err) {
      console.error("Change password error:", err.message);
      return res.status(500).json({ error: "Unable to change password" });
    }
  };
