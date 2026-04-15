const express = require('express');
const router = express.Router();
const {
  getAllCompetitions,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  closeCompetition,
  activateCompetition
} = require('../controllers/competitionController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.use(auth);

router.get('/', getAllCompetitions);
router.get('/:id', getCompetitionById);
router.post('/', checkRole('super_admin', 'admin_sportif'), createCompetition);
router.put('/:id', checkRole('super_admin', 'admin_sportif'), updateCompetition);
router.delete('/:id', checkRole('super_admin', 'admin_sportif'), deleteCompetition);
router.patch('/:id/close', checkRole('super_admin', 'admin_sportif'), closeCompetition);
router.patch('/:id/activate', checkRole('super_admin', 'admin_sportif'), activateCompetition);

module.exports = router;