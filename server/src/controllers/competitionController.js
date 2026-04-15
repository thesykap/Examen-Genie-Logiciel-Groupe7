const pool = require('../config/database');

const getAllCompetitions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', type_competition = '', statut = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM competitions WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (LOWER(nom_competition) LIKE ? OR LOWER(saison) LIKE ?)';
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (type_competition) {
      query += ' AND type_competition = ?';
      params.push(type_competition);
    }

    if (statut) {
      query += ' AND statut = ?';
      params.push(statut);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = parseInt(countResult.total);

    query += ' ORDER BY date_debut DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [result] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        competitions: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting competitions:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getCompetitionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('SELECT * FROM competitions WHERE id = ?', [id]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Compétition non trouvée' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error getting competition:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const createCompetition = async (req, res) => {
  try {
    const { nom_competition, type_competition, saison, date_debut, date_fin, nombre_equipes, format_competition, statut } = req.body;

    if (!nom_competition || !type_competition || !saison) {
      return res.status(400).json({ success: false, message: 'Nom, type et saison requis' });
    }

    await pool.query(
'INSERT INTO competitions (nom_competition, type_competition, saison, date_debut, date_fin, nombre_equipes, format_competition, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nom_competition, type_competition, saison, date_debut, date_fin, nombre_equipes, format_competition, statut || 'active']
    );

    const [newCompetition] = await pool.query('SELECT * FROM competitions WHERE nom_competition = ?', [nom_competition]);

    res.status(201).json({ success: true, data: newCompetition[0] });
  } catch (error) {
    console.error('Error creating competition:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const updateCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_competition, type_competition, saison, date_debut, date_fin, nombre_equipes, format_competition, statut } = req.body;

    const [existingCompetition] = await pool.query('SELECT * FROM competitions WHERE id = ?', [id]);
    if (existingCompetition.length === 0) {
      return res.status(404).json({ success: false, message: 'Compétition non trouvée' });
    }

    let updateFields = [];
    let updateValues = [];

    if (nom_competition) { updateFields.push('nom_competition = ?'); updateValues.push(nom_competition); }
    if (type_competition) { updateFields.push('type_competition = ?'); updateValues.push(type_competition); }
    if (saison) { updateFields.push('saison = ?'); updateValues.push(saison); }
    if (date_debut) { updateFields.push('date_debut = ?'); updateValues.push(date_debut); }
    if (date_fin) { updateFields.push('date_fin = ?'); updateValues.push(date_fin); }
    if (nombre_equipes) { updateFields.push('nombre_equipes = ?'); updateValues.push(nombre_equipes); }
    if (format_competition) { updateFields.push('format_competition = ?'); updateValues.push(format_competition); }
    if (statut) { updateFields.push('statut = ?'); updateValues.push(statut); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' });
    }

    updateValues.push(id);
    await pool.query(`UPDATE competitions SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const [result] = await pool.query('SELECT * FROM competitions WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error updating competition:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const deleteCompetition = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingCompetition] = await pool.query('SELECT id FROM competitions WHERE id = ?', [id]);
    if (existingCompetition.length === 0) {
      return res.status(404).json({ success: false, message: 'Compétition non trouvée' });
    }

    await pool.query('DELETE FROM competitions WHERE id = ?', [id]);

    res.json({ success: true, message: 'Compétition supprimée' });
  } catch (error) {
    console.error('Error deleting competition:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const closeCompetition = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingCompetition] = await pool.query('SELECT * FROM competitions WHERE id = ?', [id]);
    if (existingCompetition.length === 0) {
      return res.status(404).json({ success: false, message: 'Compétition non trouvée' });
    }

    await pool.query('UPDATE competitions SET statut = ? WHERE id = ?', ['cloturee', id]);

    const [result] = await pool.query('SELECT * FROM competitions WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error closing competition:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const activateCompetition = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingCompetition] = await pool.query('SELECT * FROM competitions WHERE id = ?', [id]);
    if (existingCompetition.length === 0) {
      return res.status(404).json({ success: false, message: 'Compétition non trouvée' });
    }

    await pool.query('UPDATE competitions SET statut = ? WHERE id = ?', ['active', id]);

    const [result] = await pool.query('SELECT * FROM competitions WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error activating competition:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllCompetitions,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  closeCompetition,
  activateCompetition
};