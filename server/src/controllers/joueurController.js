const pool = require('../config/database');

    const getAllJoueurs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', club_id = '', poste = '', statut = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT j.*, c.nom_club as club_nom 
      FROM joueurs j 
      LEFT JOIN clubs c ON j.club_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    // Auto-filter for responsable_club
    if (req.user.role === 'responsable_club' && req.user.club_id) {
      query += ' AND j.club_id = ?';
      params.unshift(req.user.club_id);
    }

    if (search) {
      query += ' AND (LOWER(j.nom) LIKE ? OR LOWER(j.postnom) LIKE ? OR LOWER(j.prenom) LIKE ?)';
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (club_id) {
      query += ' AND j.club_id = ?';
      params.push(club_id);
    }

    if (poste) {
      query += ' AND j.poste = ?';
      params.push(poste);
    }

    if (statut) {
      query += ' AND j.statut = ?';
      params.push(statut);
    }

    const countQuery = query.replace('SELECT j.*, c.nom_club as club_nom', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = parseInt(countResult.total);

    query += ' ORDER BY j.nom ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [result] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        joueurs: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting joueurs:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getJoueurById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'SELECT j.*, c.nom_club as club_nom FROM joueurs j LEFT JOIN clubs c ON j.club_id = c.id WHERE j.id = ?',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Joueur non trouvé' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error getting joueur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const createJoueur = async (req, res) => {
  try {
    let { club_id, nom, postnom, prenom, date_naissance, nationalite, numero_maillot, poste, taille, poids, photo, date_signature, fin_contrat, statut } = req.body;

    // Force club_id for responsable_club
    if (req.user.role === 'responsable_club') {
      if (!req.user.club_id) {
        return res.status(400).json({ success: false, message: 'Aucun club assigné à votre compte' });
      }
      club_id = req.user.club_id;
    }

    if (!nom || !club_id) {
      return res.status(400).json({ success: false, message: 'Nom et club requis' });
    }

    await pool.query(
      'INSERT INTO joueurs (club_id, nom, postnom, prenom, date_naissance, nationalite, numero_maillot, poste, taille, poids, photo, date_signature, fin_contrat, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [club_id, nom, postnom, prenom, date_naissance, nationalite || 'RDC', numero_maillot, poste, taille, poids, photo, date_signature, fin_contrat, statut || 'actif']
    );

    const [newJoueur] = await pool.query('SELECT * FROM joueurs WHERE nom = ? AND club_id = ?', [nom, club_id]);

    res.status(201).json({ success: true, data: newJoueur[0] });
  } catch (error) {
    console.error('Error creating joueur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const updateJoueur = async (req, res) => {
  try {
    const { id } = req.params;
    const { club_id, nom, postnom, prenom, date_naissance, nationalite, numero_maillot, poste, taille, poids, photo, date_signature, fin_contrat, statut } = req.body;

    const [existingJoueur] = await pool.query('SELECT * FROM joueurs WHERE id = ?', [id]);
    if (existingJoueur.length === 0) {
      return res.status(404).json({ success: false, message: 'Joueur non trouvé' });
    }

    let updateFields = [];
    let updateValues = [];

    if (club_id !== undefined) { updateFields.push('club_id = ?'); updateValues.push(club_id); }
    if (nom) { updateFields.push('nom = ?'); updateValues.push(nom); }
    if (postnom) { updateFields.push('postnom = ?'); updateValues.push(postnom); }
    if (prenom) { updateFields.push('prenom = ?'); updateValues.push(prenom); }
    if (date_naissance) { updateFields.push('date_naissance = ?'); updateValues.push(date_naissance); }
    if (nationalite) { updateFields.push('nationalite = ?'); updateValues.push(nationalite); }
    if (numero_maillot !== undefined) { updateFields.push('numero_maillot = ?'); updateValues.push(numero_maillot); }
    if (poste) { updateFields.push('poste = ?'); updateValues.push(poste); }
    if (taille) { updateFields.push('taille = ?'); updateValues.push(taille); }
    if (poids) { updateFields.push('poids = ?'); updateValues.push(poids); }
    if (photo) { updateFields.push('photo = ?'); updateValues.push(photo); }
    if (date_signature) { updateFields.push('date_signature = ?'); updateValues.push(date_signature); }
    if (fin_contrat) { updateFields.push('fin_contrat = ?'); updateValues.push(fin_contrat); }
    if (statut) { updateFields.push('statut = ?'); updateValues.push(statut); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' });
    }

    updateValues.push(id);
    await pool.query(`UPDATE joueurs SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const [result] = await pool.query('SELECT * FROM joueurs WHERE id = ?', [id]);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error updating joueur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const deleteJoueur = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingJoueur] = await pool.query('SELECT id FROM joueurs WHERE id = ?', [id]);
    if (existingJoueur.length === 0) {
      return res.status(404).json({ success: false, message: 'Joueur non trouvé' });
    }

    await pool.query('DELETE FROM joueurs WHERE id = ?', [id]);

    res.json({ success: true, message: 'Joueur supprimé' });
  } catch (error) {
    console.error('Error deleting joueur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getJoueursByClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const [result] = await pool.query(
      'SELECT * FROM joueurs WHERE club_id = ? AND statut = ? ORDER BY numero_maillot ASC',
      [clubId, 'actif']
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting joueurs by club:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllJoueurs,
  getJoueurById,
  createJoueur,
  updateJoueur,
  deleteJoueur,
  getJoueursByClub
};