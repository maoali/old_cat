const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'innovation.db');
let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('employee','reviewer','expert','admin')),
      department_id INTEGER REFERENCES departments(id),
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      department_id INTEGER NOT NULL REFERENCES departments(id),
      submitter_id INTEGER NOT NULL REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'pending_review'
        CHECK(status IN ('pending_review','approved','rejected','evidence_submitted','evaluated','evaluation_rejected','project_pending','project_established')),
      needs_project INTEGER DEFAULT 0,
      tags TEXT,
      expected_benefit TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idea_id INTEGER NOT NULL REFERENCES ideas(id),
      reviewer_id INTEGER NOT NULL REFERENCES users(id),
      decision TEXT NOT NULL CHECK(decision IN ('approve','reject')),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS evidences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idea_id INTEGER NOT NULL REFERENCES ideas(id),
      uploader_id INTEGER NOT NULL REFERENCES users(id),
      description TEXT,
      file_path TEXT,
      file_name TEXT,
      file_size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idea_id INTEGER NOT NULL REFERENCES ideas(id),
      expert_id INTEGER NOT NULL REFERENCES users(id),
      score INTEGER CHECK(score BETWEEN 1 AND 10),
      comment TEXT,
      recommend_project INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idea_id INTEGER NOT NULL UNIQUE REFERENCES ideas(id),
      project_name TEXT NOT NULL,
      project_code TEXT UNIQUE,
      manager TEXT,
      budget REAL,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'planning' CHECK(status IN ('planning','in_progress','completed','suspended')),
      description TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedData(db);
}

function seedData(db) {
  // Seed departments
  const deptCount = db.prepare('SELECT COUNT(*) as c FROM departments').get().c;
  if (deptCount === 0) {
    const depts = [
      { name: '研发部', description: '负责产品研发与技术创新' },
      { name: '市场部', description: '负责市场推广与商务拓展' },
      { name: '运营部', description: '负责日常运营与流程管理' },
      { name: '人力资源部', description: '负责人才招募与企业文化' },
      { name: '财务部', description: '负责财务管理与成本控制' },
      { name: '客服部', description: '负责客户服务与体验优化' },
    ];
    const insertDept = db.prepare('INSERT INTO departments (name, description) VALUES (?, ?)');
    depts.forEach(d => insertDept.run(d.name, d.description));
  }

  // Seed demo users
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (userCount === 0) {
    const hash = bcrypt.hashSync('demo123', 10);
    const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, role, department_id) VALUES (?, ?, ?, ?, ?)');
    insertUser.run('张伟（员工）', 'employee@demo.com', hash, 'employee', 1);
    insertUser.run('李娜（员工2）', 'employee2@demo.com', hash, 'employee', 2);
    insertUser.run('王芳（审核员）', 'reviewer@demo.com', hash, 'reviewer', 3);
    insertUser.run('刘洋（专家）', 'expert@demo.com', hash, 'expert', 1);
    insertUser.run('陈静（专家2）', 'expert2@demo.com', hash, 'expert', 2);
    insertUser.run('赵强（管理员）', 'admin@demo.com', hash, 'admin', 1);

    // Seed some demo ideas
    const insertIdea = db.prepare(`
      INSERT INTO ideas (title, description, category, department_id, submitter_id, status, expected_benefit, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const ideas = [
      ['AI 辅助代码审查工具', '利用大模型技术自动分析代码质量，减少人工审查时间 60%', '技术创新', 1, 1, 'project_established', '节省工程师时间，提升代码质量', 'AI,自动化,研发效率'],
      ['客户反馈自动分类系统', '通过 NLP 技术对客户反馈进行自动分类和情感分析', '技术创新', 6, 2, 'evaluated', '提升客服效率，快速响应客户需求', 'NLP,客服,自动化'],
      ['跨部门协作流程优化', '重新设计跨部门项目协作流程，引入敏捷看板管理', '流程优化', 3, 1, 'evidence_submitted', '缩短项目周期 30%，减少沟通成本', '流程,协作,敏捷'],
      ['员工技能共享平台', '内部知识共享平台，员工可发布和学习技能课程', '管理创新', 4, 2, 'approved', '提升员工技能储备，降低外培成本', '知识管理,培训,共享'],
      ['新市场拓展方案', '针对东南亚市场的本地化产品策略和推广计划', '市场开拓', 2, 2, 'pending_review', '拓展新市场，预计增收 20%', '市场,国际化,增长'],
      ['财务报销智能审批', '利用 OCR 和规则引擎实现报销单据自动审批', '流程优化', 5, 1, 'rejected', '减少财务审批时间，提升员工体验', '财务,自动化,OCR'],
      ['绿色办公节能方案', '通过智能设备管理减少办公室能耗', '其他', 3, 2, 'pending_review', '降低能耗 20%，响应企业社会责任', '节能,绿色,ESG'],
    ];

    ideas.forEach(i => insertIdea.run(...i));

    // Add review for first idea
    db.prepare('INSERT INTO reviews (idea_id, reviewer_id, decision, comment) VALUES (?, ?, ?, ?)')
      .run(1, 3, 'approve', '该创新想法具有高度可行性，AI辅助代码审查已有成熟技术方案，建议优先立项。');
    db.prepare('INSERT INTO reviews (idea_id, reviewer_id, decision, comment) VALUES (?, ?, ?, ?)')
      .run(6, 3, 'reject', '当前财务系统与自动审批系统集成难度较高，建议待系统升级后再行评估。');
    db.prepare('INSERT INTO reviews (idea_id, reviewer_id, decision, comment) VALUES (?, ?, ?, ?)')
      .run(2, 3, 'approve', '方案清晰，技术路线可行，支持推进。');
    db.prepare('INSERT INTO reviews (idea_id, reviewer_id, decision, comment) VALUES (?, ?, ?, ?)')
      .run(3, 3, 'approve', '流程优化方向正确，期待看到具体实施成果。');
    db.prepare('INSERT INTO reviews (idea_id, reviewer_id, decision, comment) VALUES (?, ?, ?, ?)')
      .run(4, 3, 'approve', '员工技能共享是好方向，已有平台可参考，审核通过。');

    // Add evaluations
    db.prepare('INSERT INTO evaluations (idea_id, expert_id, score, comment, recommend_project) VALUES (?, ?, ?, ?, ?)')
      .run(1, 4, 9, '技术方案成熟，预期收益显著，强烈建议立项推进，可以申请专项资金支持。', 1);
    db.prepare('INSERT INTO evaluations (idea_id, expert_id, score, comment, recommend_project) VALUES (?, ?, ?, ?, ?)')
      .run(1, 5, 8, '创新性强，市场上已有同类工具但内部定制化版本更符合公司需求，建议立项。', 1);
    db.prepare('INSERT INTO evaluations (idea_id, expert_id, score, comment, recommend_project) VALUES (?, ?, ?, ?, ?)')
      .run(2, 4, 7, '方案可行，建议先做小范围试点验证效果后再全面推广。', 0);

    // Set idea 1 needs_project and update status
    db.prepare("UPDATE ideas SET needs_project = 1, status = 'project_established' WHERE id = 1").run();
    db.prepare("UPDATE ideas SET needs_project = 1, status = 'evaluated' WHERE id = 2").run();

    // Add project for idea 1
    db.prepare(`INSERT INTO projects (idea_id, project_name, project_code, manager, budget, start_date, end_date, status, description, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(1, 'AI代码审查平台建设', 'PRJ-2024-001', '张伟', 500000, '2024-02-01', '2024-08-31', 'in_progress',
        '基于大型语言模型构建内部代码审查平台，第一期覆盖Python和Java代码库', 6);

    // Add evidence for idea 3
    db.prepare('INSERT INTO evidences (idea_id, uploader_id, description, file_name) VALUES (?, ?, ?, ?)')
      .run(3, 1, '跨部门协作流程优化第一阶段成果报告——已完成流程梳理与看板工具部署，参与部门满意度达92%', '流程优化成果报告_Q1.pdf');
  }
}

module.exports = { getDb, initDb };
