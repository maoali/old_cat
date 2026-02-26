const express = require('express');
const { getDb } = require('../database');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

// GET /api/departments
router.get('/', requireAuth, (req, res) => {
    const db = getDb();
    const depts = db.prepare('SELECT * FROM departments ORDER BY id').all();
    res.json({ departments: depts });
});

// POST /api/departments (admin only)
router.post('/', requireRole('admin'), (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: '请填写部门名称' });
    const db = getDb();
    try {
        const r = db.prepare('INSERT INTO departments (name, description) VALUES (?, ?)').run(name, description || '');
        res.json({ id: r.lastInsertRowid, name, description });
    } catch (e) {
        res.status(400).json({ error: '部门名称已存在' });
    }
});

// PATCH /api/departments/:id (admin only)
router.patch('/:id', requireRole('admin'), (req, res) => {
    const { name, description } = req.body;
    const db = getDb();
    db.prepare('UPDATE departments SET name=COALESCE(?,name), description=COALESCE(?,description) WHERE id=?')
        .run(name || null, description || null, req.params.id);
    res.json({ success: true });
});

// DELETE /api/departments/:id (admin only)
router.delete('/:id', requireRole('admin'), (req, res) => {
    const db = getDb();
    const used = db.prepare('SELECT COUNT(*) as c FROM users WHERE department_id = ?').get(req.params.id).c;
    if (used > 0) return res.status(400).json({ error: '该部门下有用户，无法删除' });
    db.prepare('DELETE FROM departments WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

module.exports = router;
