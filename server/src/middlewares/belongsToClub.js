const belongsToClub = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  if (req.user.role !== 'responsable_club') {
    return res.status(403).json({ 
      success: false, 
      message: 'Seuls les responsables de club peuvent s\'inscrire à une compétition pour leur club.' 
    });
  }

  const { club_id } = req.body;
  if (!club_id) {
    return res.status(400).json({ success: false, message: 'club_id requis' });
  }

  if (parseInt(club_id) !== parseInt(req.user.club_id)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Vous ne pouvez vous inscrire qu\'au nom de votre propre club.' 
    });
  }

  // Auto-fill club_id for controller
  req.body.club_id = parseInt(club_id);
  next();
};

module.exports = belongsToClub;

