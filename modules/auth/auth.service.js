const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../users/users.model');
const errorHandler = require('../../middlewares/error');

const registerUser = async (req, res) => {
  console.log('body', req.body);
  const { username, email, password, role = 'admin' } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] }).select('_id').lean();
  if (existingUser) {
    errorHandler(new Error('User already exists'), req, res);
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  return user;
  
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({email}).select('+password');;
  if (!user) {
    errorHandler(new Error('Invalid credentials'), req, res);
    return;
  }
  console.log({user});
  
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  console.log({isPasswordMatch});
  
  if (!isPasswordMatch) {
    res.status(400).json({
      success: false,
      message: 'Invalid credentials',
    });
    return;
  }

  const jwtToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  user.password = undefined;

  return {
    user,
    token: jwtToken,
  }
};

const logoutUser = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
