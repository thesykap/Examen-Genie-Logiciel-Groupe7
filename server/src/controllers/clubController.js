const pool = require('../config/database');

const getAllClubs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM clubs WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (LOWER(nom_club) LIKE ? OR LOWER(sigle) LIKE ? OR LOWER(ville) LIKE ?)';
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (statut) {
      query += ' AND statut = ?';
      params.push(statut);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = parseInt(countResult.total);

    query += ' ORDER BY nom_club ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [result] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        clubs: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting clubs:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getClubById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('SELECT * FROM clubs WHERE id = ?', [id]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Club non trouvé' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error getting club:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const createClub = async (req, res) => {
  try {
    console.log('Create club request:', req.body);
    const { nom_club, sigle, date_creation, ville, province, stade, couleurs, logo, president, telephone, email, division, statut } = req.body;

    if (!nom_club || !sigle || !ville) {
      return res.status(400).json({ success: false, message: 'Nom, sigle et ville requis' });
    }

    const [result] = await pool.query(
      'INSERT INTO clubs (nom_club, sigle, date_creation, ville, province, stade, couleurs, logo, president, telephone, email, division, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nom_club, sigle, date_creation || null, ville, province || null, stade || null, couleurs || null, logo || null, president || null, telephone || null, email || null, division || 1, statut || 'actif']
    );
    console.log('Insert result:', result);

    const [newClub] = await pool.query('SELECT * FROM clubs WHERE id = ?', [result.insertId]);
    console.log('New club:', newClub[0]);

    res.status(201).json({ success: true, data: newClub[0] });
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_club, sigle, date_creation, ville, province, stade, couleurs, logo, president, telephone, email, division, statut } = req.body;

    const [existingClub] = await pool.query('SELECT * FROM clubs WHERE id = ?', [id]);
    if (existingClub.length === 0) {
      return res.status(404).json({ success: false, message: 'Club non trouvé' });
    }

    let updateFields = [];
    let updateValues = [];

    if (nom_club) { updateFields.push('nom_club = ?'); updateValues.push(nom_club); }
    if (sigle) { updateFields.push('sigle = ?'); updateValues.push(sigle); }
    if (date_creation) { updateFields.push('date_creation = ?'); updateValues.push(date_creation); }
    if (ville) { updateFields.push('ville = ?'); updateValues.push(ville); }
    if (province) { updateFields.push('province = ?'); updateValues.push(province); }
    if (stade) { updateFields.push('stade = ?'); updateValues.push(stade); }
    if (couleurs) { updateFields.push('couleurs = ?'); updateValues.push(couleurs); }
    if (logo) { updateFields.push('logo = ?'); updateValues.push(logo); }
    if (president) { updateFields.push('president = ?'); updateValues.push(president); }
    if (telephone) { updateFields.push('telephone = ?'); updateValues.push(telephone); }
    if (email) { updateFields.push('email = ?'); updateValues.push(email); }
    if (division !== undefined) { updateFields.push('division = ?'); updateValues.push(division); }
    if (statut) { updateFields.push('statut = ?'); updateValues.push(statut); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' });
    }

    updateValues.push(id);
    await pool.query(`UPDATE clubs SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const [result] = await pool.query('SELECT * FROM clubs WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const deleteClub = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingClub] = await pool.query('SELECT id FROM clubs WHERE id = ?', [id]);
    if (existingClub.length === 0) {
      return res.status(404).json({ success: false, message: 'Club non trouvé' });
    }

    await pool.query('DELETE FROM clubs WHERE id = ?', [id]);

    res.json({ success: true, message: 'Club supprimé' });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getClubStats = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM clubs) as total_clubs,
        (SELECT COUNT(*) FROM clubs WHERE statut = 'actif') as clubs_actifs,
        (SELECT COUNT(*) FROM clubs WHERE statut = 'inactif') as clubs_inactifs
    `);
    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error getting club stats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  getClubStats
};