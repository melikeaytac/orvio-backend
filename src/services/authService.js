const prisma = require('../config/database');
const { comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');
const { USER_ROLE } = require('../config/constants');

async function loginAdmin(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user || !user.active) {
    throw new Error('Invalid credentials');
  }
  
  if (!user.password_hash) {
    throw new Error('Invalid credentials');
  }
  
  const isValid = await comparePassword(password, user.password_hash);
  
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  // Check if user is admin
  if (user.role_id !== USER_ROLE.ADMIN && user.role_id !== USER_ROLE.SYSTEM_ADMIN) {
    throw new Error('Access denied');
  }
  
  const token = generateToken({
    userId: user.user_id,
    email: user.email,
    role: user.role_id,
  });
  
  return {
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role_id,
    },
  };
}

module.exports = {
  loginAdmin,
};

