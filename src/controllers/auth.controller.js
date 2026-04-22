const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const { ROLES } = require('../config/roles');

class AuthController {
  async register(req, res, next) {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      // Validate role if provided, else default to 'user'
      let assignedRole = ROLES.USER;
      if (role && Object.values(ROLES).includes(role)) {
        assignedRole = role;
      }

      const newUser = await userService.createUser(username, email, password, assignedRole);

      res.status(201).json({
        message: 'User registered successfully',
        user: newUser
      });
    } catch (error) {
      if (error.message === 'Email already in use') {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await userService.validatePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );

      // SECURITY MITIGATION: Send token via httpOnly cookie, not JSON body
      res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JS from reading the cookie
        secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 15 * 60 * 1000 // Matches 15m expiration
      });

      res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, username: user.username, role: user.role }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('token');
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
