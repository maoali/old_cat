const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../database');
const { requireRole } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/users
router.get('/users', requireRole('admin'), (req, res) => {
    const db = getDb();
    const users = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.created_at, d.name as department_name, u.department_id
    FROM users u LEFT JOIN departments d ON u.department_id = d.id ORDER BY u.id
  `).all();
    res.json({ users });
});

// POST /api/admin/users
router.post('/users', requireRole('admin'), (req, res) => {
    const { name, email, password, role, department_id } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ error: '请填写所有必填字段' });
    const db = getDb();
    try {
        const hash = bcrypt.hashSync(password, 10);
        const r = db.prepare('INSERT INTO users (name, email, password_hash, role, department_id) VALUES (?, ?, ?, ?, ?)')
            .run(name, email, hash, role, department_id || null);
        res.json({ id: r.lastInsertRowid, name, email, role });
    } catch (e) {
        res.status(400).json({ error: '邮箱已存在' });
    }
});

// PATCH /api/admin/users/:id
router.patch('/users/:id', requireRole('admin'), (req, res) => {
    const { name, role, department_id, password } = req.body;
    const db = getDb();
    if (password) {
        const hash = bcrypt.hashSync(password, 10);
        db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hash, req.params.id);
    }
    db.prepare('UPDATE users SET name=COALESCE(?,name), role=COALESCE(?,role), department_id=COALESCE(?,department_id) WHERE id=?')
        .run(name || null, role || null, department_id || null, req.params.id);
    res.json({ success: true });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', requireRole('admin'), (req, res) => {
    const db = getDb();
    if (parseInt(req.params.id) === req.session.user.id) {
        return res.status(400).json({ error: '不能删除当前登录账号' });
    }
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

module.exports = router;
