const express = require('express');
const { getDb } = require('../database');
const { requireRole } = require('../middleware/auth');
const router = express.Router();

// POST /api/reviews - submit review decision (reviewer/admin only)
router.post('/', requireRole('reviewer', 'admin'), (req, res) => {
    const { idea_id, decision, comment } = req.body;
    if (!idea_id || !decision) return res.status(400).json({ error: '参数缺失' });
    if (!['approve', 'reject'].includes(decision)) return res.status(400).json({ error: '无效的审核决定' });

    const db = getDb();
    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(idea_id);
    if (!idea) return res.status(404).json({ error: '创新想法不存在' });
    if (idea.status !== 'pending_review') return res.status(400).json({ error: '该想法当前状态不可审核' });

    db.prepare('INSERT INTO reviews (idea_id, reviewer_id, decision, comment) VALUES (?, ?, ?, ?)')
        .run(idea_id, req.session.user.id, decision, comment || '');

    const newStatus = decision === 'approve' ? 'approved' : 'rejected';
    db.prepare("UPDATE ideas SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(newStatus, idea_id);

    res.json({ success: true, status: newStatus });
});

module.exports = router;
