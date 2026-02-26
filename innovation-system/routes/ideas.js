const express = require('express');
const { getDb } = require('../database');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

const IDEA_SELECT = `
  SELECT i.*, 
    u.name as submitter_name, u.email as submitter_email,
    d.name as department_name,
    (SELECT COUNT(*) FROM evaluations e WHERE e.idea_id = i.id) as eval_count,
    (SELECT AVG(score) FROM evaluations e WHERE e.idea_id = i.id) as avg_score
  FROM ideas i
  JOIN users u ON i.submitter_id = u.id
  JOIN departments d ON i.department_id = d.id
`;

// GET /api/ideas - list ideas (with filters)
router.get('/', requireAuth, (req, res) => {
    const db = getDb();
    const { status, category, department_id, my } = req.query;
    let where = [];
    let params = [];

    if (my === '1') { where.push('i.submitter_id = ?'); params.push(req.session.user.id); }
    if (status) { where.push('i.status = ?'); params.push(status); }
    if (category) { where.push('i.category = ?'); params.push(category); }
    if (department_id) { where.push('i.department_id = ?'); params.push(department_id); }

    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const ideas = db.prepare(`${IDEA_SELECT} ${whereStr} ORDER BY i.created_at DESC`).all(...params);
    res.json({ ideas });
});

// GET /api/ideas/:id - single idea with full details
router.get('/:id', requireAuth, (req, res) => {
    const db = getDb();
    const idea = db.prepare(`${IDEA_SELECT} WHERE i.id = ?`).get(req.params.id);
    if (!idea) return res.status(404).json({ error: '创新想法不存在' });

    const review = db.prepare(`
    SELECT r.*, u.name as reviewer_name FROM reviews r
    JOIN users u ON r.reviewer_id = u.id WHERE r.idea_id = ? ORDER BY r.created_at DESC LIMIT 1
  `).get(idea.id);

    const evidences = db.prepare(`
    SELECT e.*, u.name as uploader_name FROM evidences e
    JOIN users u ON e.uploader_id = u.id WHERE e.idea_id = ? ORDER BY e.created_at
  `).all(idea.id);

    const evaluations = db.prepare(`
    SELECT ev.*, u.name as expert_name FROM evaluations ev
    JOIN users u ON ev.expert_id = u.id WHERE ev.idea_id = ? ORDER BY ev.created_at
  `).all(idea.id);

    const project = db.prepare(`
    SELECT p.*, u.name as created_by_name FROM projects p
    LEFT JOIN users u ON p.created_by = u.id WHERE p.idea_id = ?
  `).get(idea.id);

    res.json({ idea, review, evidences, evaluations, project });
});

// POST /api/ideas - create idea
router.post('/', requireAuth, (req, res) => {
    const { title, description, category, department_id, tags, expected_benefit } = req.body;
    if (!title || !description || !category || !department_id) {
        return res.status(400).json({ error: '请填写所有必填字段' });
    }
    const db = getDb();
    const result = db.prepare(`
    INSERT INTO ideas (title, description, category, department_id, submitter_id, tags, expected_benefit)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, description, category, department_id, req.session.user.id, tags || '', expected_benefit || '');

    const idea = db.prepare(`${IDEA_SELECT} WHERE i.id = ?`).get(result.lastInsertRowid);
    res.status(201).json({ idea });
});

// PATCH /api/ideas/:id - update idea (submitter can edit pending ideas)
router.patch('/:id', requireAuth, (req, res) => {
    const db = getDb();
    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.id);
    if (!idea) return res.status(404).json({ error: '不存在' });

    const user = req.session.user;
    if (idea.submitter_id !== user.id && user.role !== 'admin') {
        return res.status(403).json({ error: '无权限修改' });
    }
    if (idea.status !== 'pending_review' && user.role !== 'admin') {
        return res.status(400).json({ error: '只有待审核状态的创新想法可以修改' });
    }

    const { title, description, category, department_id, tags, expected_benefit } = req.body;
    db.prepare(`
    UPDATE ideas SET title=?, description=?, category=?, department_id=?, tags=?, expected_benefit=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(title || idea.title, description || idea.description, category || idea.category,
        department_id || idea.department_id, tags ?? idea.tags, expected_benefit ?? idea.expected_benefit, idea.id);

    res.json({ success: true });
});

module.exports = router;
