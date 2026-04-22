const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { ROLES } = require('../config/roles');

// All employee routes require authentication AND Admin role
router.use(verifyToken);
router.use(requireRole(ROLES.ADMIN));

router.post('/', employeeController.create);
router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);

module.exports = router;
