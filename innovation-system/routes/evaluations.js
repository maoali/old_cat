const express = require('express');
const { getDb } = require('../database');
const { requireRole, requireAuth } = require('../middleware/auth');
const router = express.Router();

// POST /api/evaluations - expert submits evaluation
router.post('/', requireRole('expert', 'admin'), (req, res) => {
    const { idea_id, score, comment, recommend_project } = req.body;
    if (!idea_id || !score) return res.status(400).json({ error: '请填写评分' });
    if (score < 1 || score > 10) return res.status(400).json({ error: '评分须在1-10之间' });

    const db = getDb();
    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(idea_id);
    if (!idea) return res.status(404).json({ error: '创新想法不存在' });
    if (idea.status !== 'evidence_submitted') {
        return res.status(400).json({ error: '该想法尚未提交举证，暂不可评估' });
    }

    // Check if this expert already evaluated
    const existing = db.prepare('SELECT id FROM evaluations WHERE idea_id = ? AND expert_id = ?')
        .get(idea_id, req.session.user.id);
    if (existing) {
        db.prepare('UPDATE evaluations SET score=?, comment=?, recommend_project=? WHERE idea_id=? AND expert_id=?')
            .run(score, comment || '', recommend_project ? 1 : 0, idea_id, req.session.user.id);
    } else {
        db.prepare('INSERT INTO evaluations (idea_id, expert_id, score, comment, recommend_project) VALUES (?, ?, ?, ?, ?)')
            .run(idea_id, req.session.user.id, score, comment || '', recommend_project ? 1 : 0);
    }

    // Update idea status to evaluated, check if any expert recommends project
    const anyRecommend = db.prepare('SELECT COUNT(*) as c FROM evaluations WHERE idea_id=? AND recommend_project=1').get(idea_id).c;
    db.prepare("UPDATE ideas SET status='evaluated', needs_project=?, updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .run(anyRecommend > 0 ? 1 : 0, idea_id);

    if (anyRecommend > 0) {
        db.prepare("UPDATE ideas SET status='project_pending', updated_at=CURRENT_TIMESTAMP WHERE id=?").run(idea_id);
    }

    res.json({ success: true });
});

// GET /api/evaluations/:idea_id
router.get('/:idea_id', requireAuth, (req, res) => {
    const db = getDb();
    const evaluations = db.prepare(`
    SELECT ev.*, u.name as expert_name FROM evaluations ev
    JOIN users u ON ev.expert_id = u.id WHERE ev.idea_id = ? ORDER BY ev.created_at
  `).all(req.params.idea_id);
    res.json({ evaluations });
});

module.exports = router;
