const express = require('express');
const { getDb } = require('../database');
const { requireRole, requireAuth } = require('../middleware/auth');
const router = express.Router();

// POST /api/projects - establish a project (admin only)
router.post('/', requireRole('admin'), (req, res) => {
    const { idea_id, project_name, project_code, manager, budget, start_date, end_date, description } = req.body;
    if (!idea_id || !project_name) return res.status(400).json({ error: '请填写项目名称' });

    const db = getDb();
    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(idea_id);
    if (!idea) return res.status(404).json({ error: '创新想法不存在' });
    if (!['evaluated', 'project_pending'].includes(idea.status) && idea.status !== 'project_established') {
        return res.status(400).json({ error: '该想法当前状态不支持立项' });
    }

    const existing = db.prepare('SELECT id FROM projects WHERE idea_id = ?').get(idea_id);
    if (existing) {
        db.prepare(`UPDATE projects SET project_name=?, project_code=?, manager=?, budget=?, start_date=?, end_date=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE idea_id=?`)
            .run(project_name, project_code || null, manager || null, budget || null, start_date || null, end_date || null, description || null, idea_id);
    } else {
        db.prepare(`INSERT INTO projects (idea_id, project_name, project_code, manager, budget, start_date, end_date, description, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(idea_id, project_name, project_code || null, manager || null, budget || null, start_date || null, end_date || null, description || null, req.session.user.id);
    }

    db.prepare("UPDATE ideas SET status='project_established', updated_at=CURRENT_TIMESTAMP WHERE id=?").run(idea_id);
    res.json({ success: true });
});

// PATCH /api/projects/:id - update project status
router.patch('/:id', requireRole('admin'), (req, res) => {
    const db = getDb();
    const { status, manager, budget, end_date } = req.body;
    db.prepare("UPDATE projects SET status=COALESCE(?,status), manager=COALESCE(?,manager), budget=COALESCE(?,budget), end_date=COALESCE(?,end_date), updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .run(status || null, manager || null, budget || null, end_date || null, req.params.id);
    res.json({ success: true });
});

// GET /api/projects
router.get('/', requireAuth, (req, res) => {
    const db = getDb();
    const projects = db.prepare(`
    SELECT p.*, i.title as idea_title, u.name as created_by_name
    FROM projects p JOIN ideas i ON p.idea_id = i.id
    LEFT JOIN users u ON p.created_by = u.id ORDER BY p.created_at DESC
  `).all();
    res.json({ projects });
});

// GET /api/projects/:id
router.get('/:id', requireAuth, (req, res) => {
    const db = getDb();
    const project = db.prepare(`
    SELECT p.*, i.title as idea_title, u.name as created_by_name
    FROM projects p JOIN ideas i ON p.idea_id = i.id
    LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?
  `).get(req.params.id);
    if (!project) return res.status(404).json({ error: '项目不存在' });
    res.json({ project });
});

module.exports = router;
