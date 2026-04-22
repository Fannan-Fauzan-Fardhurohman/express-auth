const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { ROLES } = require('../config/roles');

// Apply verifyToken middleware to all routes below
router.use(verifyToken);

// Accessible by any authenticated user
router.get('/profile', userController.getProfile);

// Accessible by MANAGER and ADMIN
router.get('/manager-data', requireRole(ROLES.MANAGER, ROLES.ADMIN), userController.getManagerData);

// Accessible by ADMIN only
router.get('/admin-data', requireRole(ROLES.ADMIN), userController.getAdminData);

module.exports = router;
