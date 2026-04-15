const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');


// Register (existant)
const register = async (req, res) => {
  try {
    const { username, email, password, nom, prenom, telephone, role = 'visiteur' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email et mot de passe requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mot de passe minimum 6 caractères' });
    }

    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Email ou username déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, email, password_hash, role, nom, prenom, telephone, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [username, email, hashedPassword, role, nom || '', prenom || '', telephone || '']
    );

    res.status(201).json({ success: true, message: 'Inscription réussie. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? 'provided' : 'missing' });

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE (email = ? OR username = ?) AND is_active = 1', [email, email]);
    const user = users[0];
    console.log('User found:', user ? user.username : 'none');

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      console.log('Password comparison result:', user ? false : 'no user');
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'football_manager_dev_secret_2024',
      { expiresIn: '24h' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    let clubInfo = null;
    if (user.club_id && user.role === 'responsable_club') {
      const [clubs] = await pool.query('SELECT id, nom_club, sigle, ville, stade FROM clubs WHERE id = ?', [user.club_id]);
      if (clubs.length > 0) {
        clubInfo = clubs[0];
      }
    }

    res.json({
      success: true,
      token,
      user: userWithoutPassword,
      club: clubInfo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Get Me (profile)
const getMe = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, role, nom, prenom, telephone, is_active, created_at FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Ancien et nouveau mot de passe requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Nouveau mot de passe minimum 6 caractères' });
    }

    const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
      return res.status(400).json({ success: false, message: 'Ancien mot de passe incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNewPassword, req.user.id]);

    res.json({ success: true, message: 'Mot de passe changé avec succès' });
  } catch (error) {
    console.error('ChangePassword error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { login, getMe, changePassword, register };

