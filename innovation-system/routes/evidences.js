const express = require('express');
const multer = require('multer');
const path = require('path');
const { getDb } = require('../database');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => {
        const ts = Date.now();
        const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, `${ts}-${safeName}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// POST /api/evidences - upload evidence (submitter only, idea must be 'approved')
router.post('/', requireAuth, upload.single('file'), (req, res) => {
    const { idea_id, description } = req.body;
    if (!idea_id) return res.status(400).json({ error: '缺少idea_id' });

    const db = getDb();
    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(idea_id);
    if (!idea) return res.status(404).json({ error: '创新想法不存在' });
    if (idea.submitter_id !== req.session.user.id && req.session.user.role !== 'admin') {
        return res.status(403).json({ error: '只有提交人可以上传举证' });
    }
    if (!['approved', 'evidence_submitted'].includes(idea.status)) {
        return res.status(400).json({ error: '当前状态不允许上传举证，需在审核通过后操作' });
    }

    const file = req.file;
    db.prepare('INSERT INTO evidences (idea_id, uploader_id, description, file_path, file_name, file_size) VALUES (?, ?, ?, ?, ?, ?)')
        .run(idea_id, req.session.user.id, description || '', file ? file.filename : null,
            file ? Buffer.from(file.originalname, 'latin1').toString('utf8') : null, file ? file.size : null);

    // Update idea status to evidence_submitted
    db.prepare("UPDATE ideas SET status = 'evidence_submitted', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(idea_id);

    res.json({ success: true });
});

// GET /api/evidences/:idea_id
router.get('/:idea_id', requireAuth, (req, res) => {
    const db = getDb();
    const evidences = db.prepare(`
    SELECT e.*, u.name as uploader_name FROM evidences e
    JOIN users u ON e.uploader_id = u.id WHERE e.idea_id = ? ORDER BY e.created_at
  `).all(req.params.idea_id);
    res.json({ evidences });
});

module.exports = router;
