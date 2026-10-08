const express = require('express');
const {
  getAllUsers,
  updateUser,
  createUser,
  getUserById,
  deleteUser,
} = require('./users.controller');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();

// Sample route for users
router.get('/',  getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
