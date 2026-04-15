const pool = require('../config/database');

const getAllParticipations = async (req, res) => {
  try {
    const { page = 1, limit = 10, competition_id = '', club_id = '', statut_validation = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.nom_club as club_nom, comp.nom_competition as competition_nom
      FROM participations p
      LEFT JOIN clubs c ON p.club_id = c.id
      LEFT JOIN competitions comp ON p.competition_id = comp.id
      WHERE 1=1
    `;
    const params = [];

    if (competition_id) {
      query += ' AND p.competition_id = ?';
      params.push(competition_id);
    }

    if (club_id) {
      query += ' AND p.club_id = ?';
      params.push(club_id);
    }

    if (statut_validation) {
      query += ' AND p.statut_validation = ?';
      params.push(statut_validation);
    }

    const countQuery = query.replace('SELECT p.*, c.nom_club as club_nom, comp.nom_competition as competition_nom', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = parseInt(countResult.total);

    query += ' ORDER BY p.date_inscription DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [result] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        participations: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting participations:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getParticipationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `SELECT p.*, c.nom_club as club_nom, comp.nom_competition as competition_nom
       FROM participations p
       LEFT JOIN clubs c ON p.club_id = c.id
       LEFT JOIN competitions comp ON p.competition_id = comp.id
       WHERE p.id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Participation non trouvée' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error getting participation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const createParticipation = async (req, res) => {
  try {
    const { club_id, competition_id, date_inscription, statut_validation } = req.body;

    if (!club_id || !competition_id) {
      return res.status(400).json({ success: false, message: 'Club et compétition requis' });
    }

    const [checkExisting] = await pool.query(
      'SELECT id FROM participations WHERE club_id = ? AND competition_id = ?',
      [club_id, competition_id]
    );

    if (checkExisting.length > 0) {
      return res.status(400).json({ success: false, message: 'Ce club est déjà inscrit à cette compétition' });
    }

    await pool.query(
      'INSERT INTO participations (club_id, competition_id, date_inscription, statut_validation) VALUES (?, ?, ?, ?)',
[club_id, competition_id, new Date().toISOString().slice(0, 19).replace('T', ' '), 'en_attente']
    );

    const [newParticipation] = await pool.query('SELECT * FROM participations WHERE club_id = ? AND competition_id = ?',
      [club_id, competition_id]);

    res.status(201).json({ success: true, data: newParticipation[0] });
  } catch (error) {
    console.error('Error creating participation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const validateParticipation = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM participations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Participation non trouvée' });
    }

    await pool.query('UPDATE participations SET statut_validation = ? WHERE id = ?', ['valide', id]);

    const [result] = await pool.query('SELECT * FROM participations WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error validating participation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const rejectParticipation = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM participations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Participation non trouvée' });
    }

    await pool.query('UPDATE participations SET statut_validation = ? WHERE id = ?', ['rejete', id]);

    const [result] = await pool.query('SELECT * FROM participations WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error rejecting participation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const deleteParticipation = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM participations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Participation non trouvée' });
    }

    await pool.query('DELETE FROM participations WHERE id = ?', [id]);

    res.json({ success: true, message: 'Participation supprimée' });
  } catch (error) {
    console.error('Error deleting participation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getClubsByCompetition = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const [result] = await pool.query(
      `SELECT p.*, c.nom_club, c.sigle, c.ville
       FROM participations p
       JOIN clubs c ON p.club_id = c.id
       WHERE p.competition_id = ? AND p.statut_validation = ?
       ORDER BY c.nom_club ASC`,
      [competitionId, 'valide']
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting clubs by competition:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllParticipations,
  getParticipationById,
  createParticipation,
  validateParticipation,
  rejectParticipation,
  deleteParticipation,
  getClubsByCompetition
};