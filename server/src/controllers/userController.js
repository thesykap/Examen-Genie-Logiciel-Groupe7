const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, username, email, role, is_active, avatar, nom, prenom, telephone, club_id, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (LOWER(nom) LIKE ? OR LOWER(prenom) LIKE ? OR LOWER(email) LIKE ? OR LOWER(username) LIKE ?)';
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    const countQuery = query.replace('SELECT id, username, email, role, is_active, avatar, nom, prenom, telephone, club_id, created_at', 'SELECT COUNT(*) as count');
    const [countResult] = await pool.query(countQuery, params);
    const total = parseInt(countResult.count);

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [result] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        users: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'SELECT id, username, email, role, is_active, avatar, nom, prenom, telephone, club_id, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, role = 'visiteur', nom, prenom, telephone, club_id } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email and password are required' 
      });
    }

    if (role === 'responsable_club' && !club_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Un club doit être sélectionné pour un responsable de club' 
      });
    }

    if (role === 'responsable_club' && club_id) {
      const [existingClub] = await pool.query('SELECT id FROM clubs WHERE id = ?', [club_id]);
      if (existingClub.length === 0) {
        return res.status(400).json({ success: false, message: 'Club introuvable' });
      }
      const [existingResp] = await pool.query('SELECT id FROM users WHERE club_id = ? AND role = ?', [club_id, 'responsable_club']);
      if (existingResp.length > 0) {
        return res.status(400).json({ success: false, message: 'Ce club a déjà un responsable' });
      }
    }

    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, email, password_hash, role, nom, prenom, telephone, club_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, nom || null, prenom || null, telephone || null, club_id || null, true]
    );

    const [newUser] = await pool.query(
      'SELECT id, username, email, role, is_active, nom, prenom, telephone FROM users WHERE email = ?',
      [email]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, nom, prenom, telephone, club_id } = req.body;

    const [existingUser] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email) {
      const [emailExists] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );
      if (emailExists.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    if (username) {
      const [usernameExists] = await pool.query(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, id]
      );
      if (usernameExists.length > 0) {
        return res.status(400).json({ success: false, message: 'Username already in use' });
      }
    }

    let updateFields = [];
    let updateValues = [];

    if (username) { updateFields.push('username = ?'); updateValues.push(username); }
    if (email) { updateFields.push('email = ?'); updateValues.push(email); }
    if (nom !== undefined) { updateFields.push('nom = ?'); updateValues.push(nom); }
    if (prenom !== undefined) { updateFields.push('prenom = ?'); updateValues.push(prenom); }
    if (telephone !== undefined) { updateFields.push('telephone = ?'); updateValues.push(telephone); }
    if (club_id !== undefined) { updateFields.push('club_id = ?'); updateValues.push(club_id); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updateValues.push(id);
    await pool.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const [result] = await pool.query(
      'SELECT id, username, email, role, is_active, nom, prenom, telephone FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: result[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['super_admin', 'admin_sportif', 'responsable_club', 'arbitre', 'visiteur'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const [existingUser] = await pool.query('SELECT id, role, club_id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user.role !== 'super_admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to change role' });
    }

    if (role === 'responsable_club') {
      if (!req.body.club_id) {
        return res.status(400).json({ success: false, message: 'club_id requis pour responsable_club' });
      }
      const [existingClub] = await pool.query('SELECT id FROM clubs WHERE id = ?', [req.body.club_id]);
      if (existingClub.length === 0) {
        return res.status(400).json({ success: false, message: 'Club introuvable' });
      }
      const [existingResp] = await pool.query('SELECT id FROM users WHERE club_id = ? AND role = ?', [req.body.club_id, 'responsable_club']);
      if (existingResp.length > 0) {
        return res.status(400).json({ success: false, message: 'Ce club a déjà un responsable' });
      }
      await pool.query('UPDATE users SET role = ?, club_id = ? WHERE id = ?', [role, req.body.club_id, id]);
    } else {
      await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }

    const [result] = await pool.query(
      'SELECT id, username, email, role, club_id FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: result[0]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const [existingUser] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ success: false, message: 'Cannot change your own status' });
    }

    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active, id]);

    const [result] = await pool.query(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: is_active ? 'User activated successfully' : 'User deactivated successfully',
      data: result[0]
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const [existingUser] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [activeUsers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    const [usersByRole] = await pool.query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );

    res.json({
      success: true,
      data: {
        total: parseInt(totalUsers.count),
        active: parseInt(activeUsers.count),
        byRole: usersByRole
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getStats
};