const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getStats
} = require('../controllers/userController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.use(auth);

router.get('/stats', checkRole('super_admin'), getStats);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', checkRole('super_admin'), createUser);
router.put('/:id', updateUser);
router.patch('/:id/role', checkRole('super_admin'), updateUserRole);
router.patch('/:id/status', checkRole('super_admin'), updateUserStatus);
router.delete('/:id', checkRole('super_admin'), deleteUser);

module.exports = router;