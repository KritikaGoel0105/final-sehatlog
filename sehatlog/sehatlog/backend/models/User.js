const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor({ email, password, role, name }) {
    this.id = uuidv4();
    this.email = email;
    this.password = password;
    this.role = role; // 'admin', 'doctor', 'patient'
    this.name = name;
    this.createdAt = new Date();
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
