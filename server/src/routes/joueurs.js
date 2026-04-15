const express = require('express');
const router = express.Router();
const {
  getAllJoueurs,
  getJoueurById,
  createJoueur,
  updateJoueur,
  deleteJoueur,
  getJoueursByClub
} = require('../controllers/joueurController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.use(auth);

router.get('/club/:clubId', getJoueursByClub);
router.get('/', getAllJoueurs);
router.get('/:id', getJoueurById);
router.post('/', checkRole('super_admin', 'admin_sportif', 'responsable_club'), createJoueur);
router.put('/:id', checkRole('super_admin', 'admin_sportif', 'responsable_club'), updateJoueur);
router.delete('/:id', checkRole('super_admin', 'admin_sportif', 'responsable_club'), deleteJoueur);

module.exports = router;