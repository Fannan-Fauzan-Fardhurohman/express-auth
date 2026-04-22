const employeeService = require('../services/employee.service');

class EmployeeController {
  async create(req, res, next) {
    try {
      const { name, email, position, salary } = req.body;
      if (!name || !email || !position || !salary) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const employee = await employeeService.createEmployee(req.body);
      res.status(201).json({
        message: 'Employee created successfully',
        data: employee
      });
    } catch (error) {
      if (error.code === 'P2002') { // Prisma unique constraint error
        return res.status(409).json({ message: 'Email already exists' });
      }
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.status(200).json({
        message: 'Employees retrieved successfully',
        data: employees
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({
        message: 'Employee retrieved successfully',
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const employee = await employeeService.updateEmployee(req.params.id, req.body);
      res.status(200).json({
        message: 'Employee updated successfully',
        data: employee
      });
    } catch (error) {
      if (error.code === 'P2025') { // Prisma not found error
        return res.status(404).json({ message: 'Employee not found' });
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await employeeService.deleteEmployee(req.params.id);
      res.status(200).json({
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Employee not found' });
      }
      next(error);
    }
  }
}

module.exports = new EmployeeController();
