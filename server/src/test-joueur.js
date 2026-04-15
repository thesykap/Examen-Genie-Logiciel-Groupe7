const pool = require('./config/database');

async function insertTestJoueur() {
  try {
    const params = [2, 'Test BLACKBOXAI', 'Fixed', 'SQL', '2000-01-01', 'RDC', 99, 'Attaquant', 180.5, 75.0, '', '2024-01-01', '2025-01-01', 'actif'];
    
    console.log('Test params:', params);
    
    const [result] = await pool.query(
      'INSERT INTO joueurs (club_id, nom, postnom, prenom, date_naissance, nationalite, numero_maillot, poste, taille, poids, photo, date_signature, fin_contrat, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      params
    );
    
    console.log('SUCCESS! Insert ID:', result.insertId);
    
    const [joueur] = await pool.query('SELECT * FROM joueurs WHERE id = ?', [result.insertId]);
    console.log('Joueur créé:', joueur[0]);
  } catch (error) {
    console.error('Test failed:', error);
    console.error('SQL:', error.sql);
  } finally {
    process.exit(0);
  }
}

insertTestJoueur();
