const express = require('express');
const router = express.Router();
const {
  getAllParticipations,
  getParticipationById,
  createParticipation,
  validateParticipation,
  rejectParticipation,
  deleteParticipation,
  getClubsByCompetition
} = require('../controllers/participationController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const belongsToClub = require('../middlewares/belongsToClub');

router.use(auth);

router.get('/competition/:competitionId', getClubsByCompetition);
router.get('/', getAllParticipations);
router.get('/:id', getParticipationById);
router.post('/', [checkRole('super_admin', 'admin_sportif', 'responsable_club'), belongsToClub], createParticipation);
router.patch('/:id/validate', checkRole('super_admin', 'admin_sportif'), validateParticipation);
router.patch('/:id/reject', checkRole('super_admin', 'admin_sportif'), rejectParticipation);
router.delete('/:id', checkRole('super_admin', 'admin_sportif'), deleteParticipation);

module.exports = router;