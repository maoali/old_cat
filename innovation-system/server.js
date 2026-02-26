const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDb } = require('./database');

// Initialize DB
initDb();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'innovation-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ideas', require('./routes/ideas'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/evidences', require('./routes/evidences'));
app.use('/api/evaluations', require('./routes/evaluations'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin', require('./routes/admin'));

// SPA fallback for HTML pages
app.get('*.html', (req, res) => {
    const file = path.join(__dirname, 'public', req.path);
    res.sendFile(file, err => {
        if (err) res.status(404).send('Page not found');
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 创新想法管理系统已启动`);
    console.log(`   访问地址: http://localhost:${PORT}`);
    console.log(`\n📋 演示账号（密码均为 demo123）:`);
    console.log(`   员工:   employee@demo.com`);
    console.log(`   审核员: reviewer@demo.com`);
    console.log(`   专家:   expert@demo.com`);
    console.log(`   管理员: admin@demo.com\n`);
});
