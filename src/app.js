require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const employeeRoutes = require('./routes/employee.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// SECURITY MITIGATION: Set security HTTP headers (XSS Protection, etc.)
app.use(helmet());

// SECURITY MITIGATION: Parse Cookie header and populate req.cookies
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SECURITY MITIGATION: Global Rate Limiting & Auth Route Limiting
// Limit overall requests to 100 per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: 'draft-7', 
  legacyHeaders: false, 
});
app.use(globalLimiter);

// Specific Auth Limiter (Brute-force login mitigation)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  limit: 5, // Limit each IP to 5 requests per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Routes API
// Apply stricter rate limit specifically to auth endpoints
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Non-existent route handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
});

// Global Error Handler Middleware
app.use(errorMiddleware);

module.exports = app;
