const pool = require('../config/database');

const getAllMatchs = async (req, res) => {
  try {
    const { page = 1, limit = 10, competition_id = '', club_id = '', statut = '', date_debut = '', date_fin = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT m.*, 
             cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom,
             comp.nom_competition, a.nom as arbitre_nom, a.prenom as arbitre_prenom
      FROM matchs m
      LEFT JOIN clubs cd ON m.club_domicile_id = cd.id
      LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id
      LEFT JOIN competitions comp ON m.competition_id = comp.id
      LEFT JOIN arbitres a ON m.arbitre_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (competition_id) {
      query += ' AND m.competition_id = ?';
      params.push(competition_id);
    }

    if (club_id) {
      query += ' AND (m.club_domicile_id = ? OR m.club_exterieur_id = ?)';
      params.push(club_id, club_id);
    }

    if (statut) {
      query += ' AND m.statut = ?';
      params.push(statut);
    }

    if (date_debut) {
      query += ' AND m.date_match >= ?';
      params.push(date_debut);
    }

    if (date_fin) {
      query += ' AND m.date_match <= ?';
      params.push(date_fin);
    }

    const countQuery = query.replace(/SELECT m\.\*,.*?comp\.nom_competition/g, 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = parseInt(countResult.total);

    query += ' ORDER BY m.date_match ASC, m.heure_match ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [result] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        matchs: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting matchs:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `SELECT m.*, 
              cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom,
              comp.nom_competition, a.nom as arbitre_nom, a.prenom as arbitre_prenom
       FROM matchs m
       LEFT JOIN clubs cd ON m.club_domicile_id = cd.id
       LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id
       LEFT JOIN competitions comp ON m.competition_id = comp.id
       LEFT JOIN arbitres a ON m.arbitre_id = a.id
       WHERE m.id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Match non trouvé' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error getting match:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const createMatch = async (req, res) => {
  try {
    const { competition_id, club_domicile_id, club_exterieur_id, journee, date_match, heure_match, stade, arbitre_id, statut } = req.body;

    if (!competition_id || !club_domicile_id || !club_exterieur_id || !date_match) {
      return res.status(400).json({ success: false, message: 'Compétition, clubs et date requis' });
    }

    if (club_domicile_id === club_exterieur_id) {
      return res.status(400).json({ success: false, message: 'Les clubs doivent être différents' });
    }

    await pool.query(
'INSERT INTO matchs (competition_id, club_domicile_id, club_exterieur_id, journee, date_match, heure_match, stade, arbitre_id, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [competition_id, club_domicile_id, club_exterieur_id, journee, date_match, heure_match, stade, arbitre_id, statut || 'programme']
    );

    const [newMatch] = await pool.query('SELECT * FROM matchs WHERE competition_id = ? AND club_domicile_id = ? AND club_exterieur_id = ? AND date_match = ?',
      [competition_id, club_domicile_id, club_exterieur_id, date_match]);

    res.status(201).json({ success: true, data: newMatch[0] });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { competition_id, club_domicile_id, club_exterieur_id, journee, date_match, heure_match, stade, arbitre_id, statut } = req.body;

    const [existingMatch] = await pool.query('SELECT * FROM matchs WHERE id = ?', [id]);
    if (existingMatch.length === 0) {
      return res.status(404).json({ success: false, message: 'Match non trouvé' });
    }

    let updateFields = [];
    let updateValues = [];

    if (competition_id !== undefined) { updateFields.push('competition_id = ?'); updateValues.push(competition_id); }
    if (club_domicile_id !== undefined) { updateFields.push('club_domicile_id = ?'); updateValues.push(club_domicile_id); }
    if (club_exterieur_id !== undefined) { updateFields.push('club_exterieur_id = ?'); updateValues.push(club_exterieur_id); }
    if (journee !== undefined) { updateFields.push('journee = ?'); updateValues.push(journee); }
    if (date_match) { updateFields.push('date_match = ?'); updateValues.push(date_match); }
    if (heure_match) { updateFields.push('heure_match = ?'); updateValues.push(heure_match); }
    if (stade) { updateFields.push('stade = ?'); updateValues.push(stade); }
    if (arbitre_id !== undefined) { updateFields.push('arbitre_id = ?'); updateValues.push(arbitre_id); }
    if (statut) { updateFields.push('statut = ?'); updateValues.push(statut); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' });
    }

    updateValues.push(id);
    await pool.query(`UPDATE matchs SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const [result] = await pool.query('SELECT * FROM matchs WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingMatch] = await pool.query('SELECT id FROM matchs WHERE id = ?', [id]);
    if (existingMatch.length === 0) {
      return res.status(404).json({ success: false, message: 'Match non trouvé' });
    }

    await pool.query('DELETE FROM matchs WHERE id = ?', [id]);

    res.json({ success: true, message: 'Match supprimé' });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const postponeMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_match, heure_match } = req.body;

    const [existingMatch] = await pool.query('SELECT * FROM matchs WHERE id = ?', [id]);
    if (existingMatch.length === 0) {
      return res.status(404).json({ success: false, message: 'Match non trouvé' });
    }

    let updateFields = [];
    let updateValues = [];
    if (date_match) { updateFields.push('date_match = ?'); updateValues.push(date_match); }
    if (heure_match) { updateFields.push('heure_match = ?'); updateValues.push(heure_match); }
    updateFields.push('statut = ?');
    updateValues.push('reporte');
    updateValues.push(id);

    await pool.query(`UPDATE matchs SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const [result] = await pool.query('SELECT * FROM matchs WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error postponing match:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const cancelMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingMatch] = await pool.query('SELECT * FROM matchs WHERE id = ?', [id]);
    if (existingMatch.length === 0) {
      return res.status(404).json({ success: false, message: 'Match non trouvé' });
    }

    await pool.query('UPDATE matchs SET statut = ? WHERE id = ?', ['annule', id]);

    const [result] = await pool.query('SELECT * FROM matchs WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error cancelling match:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getMatchsByArbitre = async (req, res) => {
  try {
    const { arbitreId } = req.params;
    const [result] = await pool.query(
      `SELECT m.*, cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom, comp.nom_competition
       FROM matchs m
       LEFT JOIN clubs cd ON m.club_domicile_id = cd.id
       LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id
       LEFT JOIN competitions comp ON m.competition_id = comp.id
       WHERE m.arbitre_id = ? AND m.statut != ?
       ORDER BY m.date_match ASC`,
      [arbitreId, 'annule']
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting matchs by arbitre:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getCalendar = async (req, res) => {
  try {
    const { competition_id, club_id, date_debut, date_fin } = req.query;
    
    let query = `
      SELECT m.*, cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom, comp.nom_competition
      FROM matchs m
      LEFT JOIN clubs cd ON m.club_domicile_id = cd.id
      LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id
      LEFT JOIN competitions comp ON m.competition_id = comp.id
      WHERE m.statut != 'annule'
    `;
    const params = [];

    if (competition_id) {
      query += ' AND m.competition_id = ?';
      params.push(competition_id);
    }

    if (club_id) {
      query += ' AND (m.club_domicile_id = ? OR m.club_exterieur_id = ?)';
      params.push(club_id, club_id);
    }

    if (date_debut) {
      query += ' AND m.date_match >= ?';
      params.push(date_debut);
    }

    if (date_fin) {
      query += ' AND m.date_match <= ?';
      params.push(date_fin);
    }

    query += ' ORDER BY m.date_match ASC, m.heure_match ASC';

    const [result] = await pool.query(query, params);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting calendar:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllMatchs,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  postponeMatch,
  cancelMatch,
  getMatchsByArbitre,
  getCalendar
};