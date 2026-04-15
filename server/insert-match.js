const mysql = require('mysql2/promise');

async function insertMatch() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'football_management'
  });
  
  try {
    // Insérer arbitre si pas existant
    await pool.query(`
      INSERT IGNORE INTO arbitres (nom, postnom, prenom, licence, categorie, region) 
      VALUES ('Mbuyi', 'Kabongo', 'Jean', 'ARB001', 'National', 'Kinshasa')
    `);
    
    const [arbitreResult] = await pool.query('SELECT id FROM arbitres WHERE nom = ? AND postnom = ? LIMIT 1', ['Mbuyi', 'Kabongo']);
    const arbitreId = arbitreResult[0]?.id;
    
    // Insérer match
    const [result] = await pool.query(`
      INSERT INTO matchs (competition_id, club_domicile_id, club_exterieur_id, journee, date_match, heure_match, stade, arbitre_id, statut) 
      VALUES (1, 1, 2, 1, '2026-04-14', '15:00:00', 'Stade des Martyrs', ?, 'programme')
    `, [arbitreId]);
    
    console.log('Match inséré ID:', result.insertId);
    
    const [match] = await pool.query('SELECT m.*, cd.nom_club as club_domicile_nom, ce.nom_club as club_exterieur_nom FROM matchs m LEFT JOIN clubs cd ON m.club_domicile_id = cd.id LEFT JOIN clubs ce ON m.club_exterieur_id = ce.id WHERE m.id = ?', [result.insertId]);
    console.log('Match créé:', JSON.stringify(match[0], null, 2));
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

insertMatch();
