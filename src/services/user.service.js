const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class UserService {
  async createUser(username, email, password, role = 'user') {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role
      }
    });
    
    // Don't return password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validatePassword(providedPassword, storedPassword) {
    return await bcrypt.compare(providedPassword, storedPassword);
  }
}

module.exports = new UserService();
