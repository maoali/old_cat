const { getDb } = require('../database');

function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: '未登录，请先登录' });
    }
    next();
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({ error: '未登录，请先登录' });
        }
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({ error: '权限不足' });
        }
        next();
    };
}

module.exports = { requireAuth, requireRole };
