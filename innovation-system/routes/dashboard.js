const express = require('express');
const { getDb } = require('../database');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', requireAuth, (req, res) => {
    const db = getDb();

    const total = db.prepare('SELECT COUNT(*) as c FROM ideas').get().c;
    const byStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM ideas GROUP BY status
  `).all();
    const byCategory = db.prepare(`
    SELECT category, COUNT(*) as count FROM ideas GROUP BY category ORDER BY count DESC
  `).all();
    const byDept = db.prepare(`
    SELECT d.name as department, COUNT(i.id) as count 
    FROM ideas i JOIN departments d ON i.department_id = d.id
    GROUP BY d.id ORDER BY count DESC
  `).all();
    const monthly = db.prepare(`
    SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count 
    FROM ideas GROUP BY month ORDER BY month DESC LIMIT 12
  `).all().reverse();
    const avgScore = db.prepare('SELECT AVG(score) as avg FROM evaluations').get().avg;
    const projectCount = db.prepare("SELECT COUNT(*) as c FROM projects").get().c;
    const approvalRate = db.prepare(`
    SELECT 
      CAST(SUM(CASE WHEN status != 'pending_review' AND status != 'rejected' THEN 1 ELSE 0 END) AS FLOAT) / 
      NULLIF(COUNT(*), 0) * 100 as rate 
    FROM ideas
  `).get().rate;

    // Kanban data: ideas grouped by status with submitter name
    const kanban = db.prepare(`
    SELECT i.id, i.title, i.category, i.status, i.created_at,
      u.name as submitter_name, d.name as department_name,
      (SELECT AVG(score) FROM evaluations e WHERE e.idea_id = i.id) as avg_score
    FROM ideas i
    JOIN users u ON i.submitter_id = u.id
    JOIN departments d ON i.department_id = d.id
    ORDER BY i.updated_at DESC
  `).all();

    res.json({
        total, byStatus, byCategory, byDept, monthly,
        avgScore: avgScore ? Math.round(avgScore * 10) / 10 : null,
        projectCount,
        approvalRate: approvalRate ? Math.round(approvalRate) : 0,
        kanban
    });
});

module.exports = router;
