const express = require('express');
const router = express.Router();
const {
  getAllArbitres,
  getArbitreById,
  createArbitre,
  updateArbitre,
  deleteArbitre
} = require('../controllers/arbitreController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.use(auth);

router.get('/', getAllArbitres);
router.get('/:id', getArbitreById);
router.post('/', checkRole('super_admin', 'admin_sportif'), createArbitre);
router.put('/:id', checkRole('super_admin', 'admin_sportif'), updateArbitre);
router.delete('/:id', checkRole('super_admin', 'admin_sportif'), deleteArbitre);

module.exports = router;