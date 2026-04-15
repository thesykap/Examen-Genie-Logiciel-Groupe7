const pool = require('../config/database');

const getAllResultats = async (req, res) => {
  try {
    const { page = 1, limit = 10, competition_id = '', match_id = '', validation_officielle = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, m.date_match, m.heure_match, m.stade,
             cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom,
             comp.nom_competition
      FROM resultats r
      LEFT JOIN matchs m ON r.match_id = m.id
      LEFT JOIN clubs cd ON m.club_domicile_id = cd.id
      LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id
      LEFT JOIN competitions comp ON m.competition_id = comp.id
      WHERE 1=1
    `;
    const params = [];

    if (competition_id) {
      query += ' AND m.competition_id = ?';
      params.push(competition_id);
    }

    if (match_id) {
      query += ' AND r.match_id = ?';
      params.push(match_id);
    }

    if (validation_officielle !== '') {
      query += ' AND r.validation_officielle = ?';
      params.push(validation_officielle === 'true');
    }

    const countQuery = query.replace(/SELECT r\.\*,.*?comp\.nom_competition/g, 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = parseInt(countResult.total);

    query += ' ORDER BY m.date_match DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [result] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        resultats: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting resultats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getResultatById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `SELECT r.*, m.date_match, m.heure_match, m.stade,
              cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom,
              comp.nom_competition
       FROM resultats r
       LEFT JOIN matchs m ON r.match_id = m.id
       LEFT JOIN clubs cd ON m.club_domicile_id = cd.id
       LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id
       LEFT JOIN competitions comp ON m.competition_id = comp.id
       WHERE r.id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Résultat non trouvé' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error getting resultat:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getResultatByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const [result] = await pool.query(
      `SELECT r.*, m.date_match, m.heure_match, m.stade,
              cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom,
              comp.nom_competition
       FROM resultats r
       LEFT JOIN matchs m ON r.match_id = m.id
       LEFT JOIN clubs cd ON m.club_domicile_id = cd.id
       LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id
       LEFT JOIN competitions comp ON m.competition_id = comp.id
       WHERE r.match_id = ?`,
      [matchId]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun résultat pour ce match' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error getting resultat by match:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const createResultat = async (req, res) => {
  try {
    const { match_id, buts_domicile, buts_exterieur, observations, validation_officielle } = req.body;

    if (!match_id) {
      return res.status(400).json({ success: false, message: 'Match requis' });
    }

    const [checkMatch] = await pool.query('SELECT id FROM matchs WHERE id = ?', [match_id]);
    if (checkMatch.length === 0) {
      return res.status(400).json({ success: false, message: 'Match non trouvé' });
    }

    const [checkExisting] = await pool.query('SELECT id FROM resultats WHERE match_id = ?', [match_id]);
    if (checkExisting.length > 0) {
      return res.status(400).json({ success: false, message: 'Un résultat existe déjà pour ce match' });
    }

    await pool.query(
      'INSERT INTO resultats (match_id, buts_domicile, buts_exterieur, observations, validation_officielle) VALUES (?, ?, ?, ?, ?)',
      [match_id, buts_domicile || 0, buts_exterieur || 0, observations, validation_officielle || false]
    );

    await pool.query('UPDATE matchs SET statut = ? WHERE id = ?', ['termine', match_id]);

    const [newResultat] = await pool.query('SELECT * FROM resultats WHERE match_id = ?', [match_id]);

    res.status(201).json({ success: true, data: newResultat[0] });
  } catch (error) {
    console.error('Error creating resultat:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const updateResultat = async (req, res) => {
  try {
    const { id } = req.params;
    const { buts_domicile, buts_exterieur, observations, validation_officielle } = req.body;

    const [existing] = await pool.query('SELECT * FROM resultats WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Résultat non trouvé' });
    }

    let updateFields = [];
    let updateValues = [];

    if (buts_domicile !== undefined) { updateFields.push('buts_domicile = ?'); updateValues.push(buts_domicile); }
    if (buts_exterieur !== undefined) { updateFields.push('buts_exterieur = ?'); updateValues.push(buts_exterieur); }
    if (observations) { updateFields.push('observations = ?'); updateValues.push(observations); }
    if (validation_officielle !== undefined) { updateFields.push('validation_officielle = ?'); updateValues.push(validation_officielle); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' });
    }

    updateValues.push(id);
    await pool.query(`UPDATE resultats SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const [result] = await pool.query('SELECT * FROM resultats WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error updating resultat:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const validateResultat = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM resultats WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Résultat non trouvé' });
    }

    await pool.query('UPDATE resultats SET validation_officielle = ? WHERE id = ?', [true, id]);

    const [result] = await pool.query('SELECT * FROM resultats WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error validating resultat:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const deleteResultat = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [resultat] = await pool.query('SELECT match_id FROM resultats WHERE id = ?', [id]);
    if (resultat.length === 0) {
      return res.status(404).json({ success: false, message: 'Résultat non trouvé' });
    }

    const matchId = resultat[0].match_id;

    await pool.query('DELETE FROM resultats WHERE id = ?', [id]);

    await pool.query('UPDATE matchs SET statut = ? WHERE id = ?', ['programme', matchId]);

    res.json({ success: true, message: 'Résultat supprimé' });
  } catch (error) {
    console.error('Error deleting resultat:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getHistoriqueResultats = async (req, res) => {
  try {
    const { club_id, competition_id } = req.query;
    
    let query = `
      SELECT r.*, m.date_match, m.heure_match,
             cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom,
             comp.nom_competition
      FROM resultats r
      JOIN matchs m ON r.match_id = m.id
      LEFT JOIN clubs cd ON m.club_domicile_id = cd.id
      LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id
      LEFT JOIN competitions comp ON m.competition_id = comp.id
      WHERE r.validation_officielle = true
    `;
    const params = [];

    if (club_id) {
      query += ' AND (m.club_domicile_id = ? OR m.club_exterieur_id = ?)';
      params.push(club_id, club_id);
    }

    if (competition_id) {
      query += ' AND m.competition_id = ?';
      params.push(competition_id);
    }

    query += ' ORDER BY m.date_match DESC';

    const [result] = await pool.query(query, params);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting historique resultats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllResultats,
  getResultatById,
  getResultatByMatch,
  createResultat,
  updateResultat,
  validateResultat,
  deleteResultat,
  getHistoriqueResultats
};