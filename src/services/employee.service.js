const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EmployeeService {
  async createEmployee(data) {
    return await prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        position: data.position,
        salary: parseFloat(data.salary)
      }
    });
  }

  async getAllEmployees() {
    return await prisma.employee.findMany();
  }

  async getEmployeeById(id) {
    return await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async updateEmployee(id, data) {
    return await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        salary: data.salary ? parseFloat(data.salary) : undefined
      }
    });
  }

  async deleteEmployee(id) {
    return await prisma.employee.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new EmployeeService();
