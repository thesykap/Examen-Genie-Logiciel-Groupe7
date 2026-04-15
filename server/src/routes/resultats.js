const express = require('express');
const router = express.Router();
const {
  getAllResultats,
  getResultatById,
  getResultatByMatch,
  createResultat,
  updateResultat,
  validateResultat,
  deleteResultat,
  getHistoriqueResultats
} = require('../controllers/resultatController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.use(auth);

router.get('/historique', getHistoriqueResultats);
router.get('/match/:matchId', getResultatByMatch);
router.get('/', getAllResultats);
router.get('/:id', getResultatById);
router.post('/', checkRole('super_admin', 'admin_sportif'), createResultat);
router.put('/:id', checkRole('super_admin', 'admin_sportif'), updateResultat);
router.patch('/:id/validate', checkRole('super_admin', 'admin_sportif', 'arbitre'), validateResultat);
router.delete('/:id', checkRole('super_admin', 'admin_sportif'), deleteResultat);

module.exports = router;