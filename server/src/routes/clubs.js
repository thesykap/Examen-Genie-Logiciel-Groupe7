const express = require('express');
const router = express.Router();
const {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  getClubStats
} = require('../controllers/clubController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.use(auth);

router.get('/stats', getClubStats);
router.get('/', getAllClubs);
router.get('/:id', getClubById);
router.post('/', checkRole('super_admin', 'admin_sportif'), createClub);
router.put('/:id', checkRole('super_admin', 'admin_sportif'), updateClub);
router.delete('/:id', checkRole('super_admin', 'admin_sportif'), deleteClub);

module.exports = router;