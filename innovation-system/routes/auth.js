const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../database');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: '请填写邮箱和密码' });

    const db = getDb();
    const user = db.prepare(`
    SELECT u.*, d.name as department_name 
    FROM users u LEFT JOIN departments d ON u.department_id = d.id
    WHERE u.email = ?
  `).get(email);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: '邮箱或密码错误' });
    }

    req.session.user = {
        id: user.id, name: user.name, email: user.email,
        role: user.role, department_id: user.department_id,
        department_name: user.department_name
    };
    res.json({ success: true, user: req.session.user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: '未登录' });
    res.json({ user: req.session.user });
});

module.exports = router;
