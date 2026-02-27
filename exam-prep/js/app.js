// ============ STATE MANAGEMENT ============
const STATE = {
  currentPage: 'dashboard',
  practiceFilter: { subject: 'all', type: 'all', difficulty: 'all' },
  practiceIndex: 0,
  practiceQuestions: [],
  examState: null,
  errorBook: [],
  progress: {},
  examResults: [],
  currentUserId: null,
  selectedGrade: 6,
};

function saveState() {
  // Delegate to per-user save if available
  if (typeof saveStateForCurrentUser === 'function') {
    saveStateForCurrentUser();
  } else {
    localStorage.setItem('errorBook', JSON.stringify(STATE.errorBook));
    localStorage.setItem('progress', JSON.stringify(STATE.progress));
    localStorage.setItem('examResults', JSON.stringify(STATE.examResults));
  }
}

// ============ ROUTER ============
function navigate(page, params = {}) {
  STATE.currentPage = page;
  STATE.params = params;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  document.getElementById('page-content').innerHTML = renderPage(page, params);
  document.getElementById('topbar-title').textContent = getPageTitle(page);
  updateMiniProgress();
  afterRender(page, params);
}

function getPageTitle(page) {
  const titles = {
    dashboard: '主页',
    knowledge: '知识点全集',
    practice: '易错题练习',
    exams: '模拟试卷',
    errorbook: '错题本',
    report: '学习报告',
    'grade-select': '年级选择',
  };
  return titles[page] || page;
}

// ============ PAGE RENDERERS ============
function renderPage(page, params) {
  switch (page) {
    case 'dashboard': return renderDashboard();
    case 'knowledge': return renderKnowledge();
    case 'practice': return renderPractice(params);
    case 'exams': return renderExams();
    case 'exam-interface': return renderExamInterface(params);
    case 'exam-result': return renderExamResult(params);
    case 'errorbook': return renderErrorBook();
    case 'report': return renderReport();
    case 'grade-select': return (typeof renderGradeSelectPage === 'function') ? renderGradeSelectPage() : '<p>年级选择模块加载中...</p>';
    default: return renderDashboard();
  }
}

// ---- DASHBOARD ----
function renderDashboard() {
  const stats = getStats();
  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const gradeCfg = (typeof GRADE_CONFIG !== 'undefined') ? (GRADE_CONFIG[STATE.selectedGrade] || GRADE_CONFIG[6]) : null;
  const gradeLabel = gradeCfg ? `${gradeCfg.emoji} ${gradeCfg.label}` : '六年级';
  const greetName = user ? user.name : '同学';
  return `
    <div class="dashboard-header">
      <h2>📚 你好，${escHtml(greetName)}！</h2>
      <p>当前年级：<strong style="color:${gradeCfg?.color || 'var(--accent-blue)'}">${gradeLabel}</strong> &nbsp;·&nbsp; <a href="#" onclick="navigate('grade-select');return false;">切换年级</a></p>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-number" style="color:var(--success)">${stats.answeredQuestions}</div>
        <div class="stat-label">已答题目</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">❌</div>
        <div class="stat-number" style="color:var(--error)">${STATE.errorBook.length}</div>
        <div class="stat-label">错题数量</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-number" style="color:var(--accent-blue)">${STATE.examResults.length}</div>
        <div class="stat-label">完成试卷</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-number" style="color:var(--accent-orange)">${stats.accuracy}%</div>
        <div class="stat-label">综合正确率</div>
      </div>
    </div>
    <div class="subject-cards">
      ${['math', 'chinese', 'english'].map(s => renderSubjectCard(s)).join('')}
    </div>
    <div class="section-divider"><h3>快速开始</h3></div>
    <div class="quick-actions">
      <div class="quick-action-btn" onclick="navigate('practice', {filter:'mistake'})">
        <div class="qa-icon">🔥</div>
        <div class="qa-text"><h4>练习易错题</h4><p>针对高频易错点专项训练</p></div>
      </div>
      <div class="quick-action-btn" onclick="navigate('exams')">
        <div class="qa-icon">🗒️</div>
        <div class="qa-text"><h4>开始模拟考试</h4><p>完整试卷，限时作答</p></div>
      </div>
      <div class="quick-action-btn" onclick="navigate('knowledge')">
        <div class="qa-icon">📖</div>
        <div class="qa-text"><h4>查看知识点</h4><p>系统复习全部考点</p></div>
      </div>
      <div class="quick-action-btn" onclick="navigate('errorbook')">
        <div class="qa-icon">📕</div>
        <div class="qa-text"><h4>复习错题本</h4><p>重点攻克薄弱环节</p></div>
      </div>
    </div>
  `;
}

function renderSubjectCard(subjectKey) {
  const subject = KNOWLEDGE_DATA[subjectKey];
  const sp = getSubjectProgress(subjectKey);
  const filteredChapters = subject.chapters.filter(ch => (typeof gradeMatches === 'function') ? gradeMatches(ch.grade, STATE.selectedGrade) : true);
  const filteredQuestions = QUESTIONS_DATA.filter(q => q.subject === subjectKey && ((typeof gradeMatches === 'function') ? gradeMatches(q.grade, STATE.selectedGrade) : true));
  return `
    <div class="subject-card ${subjectKey}" onclick="navigate('knowledge', {subject:'${subjectKey}'})">
      <span class="subject-emoji">${subject.icon}</span>
      <h3>${subject.name}</h3>
      <p>${filteredChapters.length} 个章节 · ${filteredQuestions.length} 道题</p>
      <div class="subject-progress-bar">
        <div class="subject-progress-fill" style="width:${sp.accuracy}%"></div>
      </div>
      <div class="subject-progress-label">
        <span>正确率</span>
        <span>${sp.accuracy}%</span>
      </div>
    </div>
  `;
}

function getStats() {
  const p = STATE.progress;
  let total = 0, correct = 0;
  Object.values(p).forEach(q => {
    if (q.answered) { total++; if (q.correct) correct++; }
  });
  return {
    answeredQuestions: total,
    accuracy: total ? Math.round(correct / total * 100) : 0
  };
}

function getSubjectProgress(subject) {
  const qs = QUESTIONS_DATA.filter(q => q.subject === subject);
  let correct = 0, total = 0;
  qs.forEach(q => {
    const p = STATE.progress[q.id];
    if (p && p.answered) { total++; if (p.correct) correct++; }
  });
  return { total, correct, accuracy: total ? Math.round(correct / total * 100) : 0 };
}

// ---- KNOWLEDGE ----
function renderKnowledge() {
  const activeSubject = STATE.params?.subject || 'all';
  const selectedGrade = STATE.selectedGrade || 6;
  return `
    <div class="knowledge-filters">
      <button class="filter-btn ${activeSubject === 'all' ? 'active' : ''}" onclick="navigate('knowledge', {subject:'all'})">全部</button>
      <button class="filter-btn math ${activeSubject === 'math' ? 'active' : ''}" onclick="navigate('knowledge', {subject:'math'})">📐 数学</button>
      <button class="filter-btn chinese ${activeSubject === 'chinese' ? 'active' : ''}" onclick="navigate('knowledge', {subject:'chinese'})">📝 语文</button>
      <button class="filter-btn english ${activeSubject === 'english' ? 'active' : ''}" onclick="navigate('knowledge', {subject:'english'})">🔤 英语</button>
    </div>
    ${Object.entries(KNOWLEDGE_DATA)
      .filter(([key]) => activeSubject === 'all' || key === activeSubject)
      .map(([key, subject]) => {
        const filteredChapters = subject.chapters.filter(ch =>
          (typeof gradeMatches === 'function') ? gradeMatches(ch.grade, selectedGrade) : true
        );
        if (filteredChapters.length === 0) return '';
        return `
          <div class="section-divider">
            <h3>${subject.icon} ${subject.name}</h3>
          </div>
          ${filteredChapters.map(ch => renderChapterAccordion(ch, key)).join('')}
        `;
      }).join('')}
  `;
}

function renderChapterAccordion(chapter, subjectKey) {
  const dotColor = { math: 'var(--math-color)', chinese: 'var(--chinese-color)', english: 'var(--english-color)' }[subjectKey];
  return `
    <div class="chapter-accordion">
      <div class="chapter-header" onclick="toggleAccordion(this)">
        <div class="chapter-header-left">
          <div class="chapter-dot" style="background:${dotColor}"></div>
          <span class="chapter-title">${chapter.name}</span>
          <span class="chapter-count">${chapter.points.length} 个知识点</span>
        </div>
        <span class="chapter-arrow">▶</span>
      </div>
      <div class="chapter-body">
        ${chapter.points.map(point => `
          <div class="knowledge-point">
            <div class="kp-title">
              <span style="color:${dotColor}">●</span>
              ${point.title}
            </div>
            <div class="kp-content">${point.content}</div>
            ${point.formula ? `<div class="kp-formula">${escHtml(point.formula)}</div>` : ''}
            ${point.tip ? `<div class="kp-tip">${point.tip}</div>` : ''}
            ${point.examples && point.examples.length ? `
              <div style="margin-top:10px">
                <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:6px;font-weight:600">例子：</div>
                ${point.examples.map(ex => `<div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:4px;padding-left:12px;border-left:2px solid var(--border)">• ${ex}</div>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---- PRACTICE ----
function renderPractice(params) {
  const filter = params?.filter || 'all';
  let activeSubject = STATE.practiceFilter.subject;
  let activeType = STATE.practiceFilter.type;

  let questions = QUESTIONS_DATA;
  if (filter === 'mistake') questions = questions.filter(q => q.isCommonMistake);
  if (activeSubject !== 'all') questions = questions.filter(q => q.subject === activeSubject);
  if (activeType !== 'all') questions = questions.filter(q => q.type === activeType);

  STATE.practiceQuestions = questions;
  if (STATE.practiceIndex >= questions.length) STATE.practiceIndex = 0;

  return `
    <div class="practice-header">
      <div>
        <h2 style="font-size:1.2rem;font-weight:700">易错题练习</h2>
        <p style="font-size:0.8rem;color:var(--text-secondary)">${questions.length} 道题目</p>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div class="subject-filter-tabs">
          <button class="tab-btn ${activeSubject === 'all' ? 'active' : ''}" onclick="setFilter('subject','all')">全部</button>
          <button class="tab-btn math ${activeSubject === 'math' ? 'active math' : ''}" onclick="setFilter('subject','math')">数学</button>
          <button class="tab-btn chinese ${activeSubject === 'chinese' ? 'active chinese' : ''}" onclick="setFilter('subject','chinese')">语文</button>
          <button class="tab-btn english ${activeSubject === 'english' ? 'active english' : ''}" onclick="setFilter('subject','english')">英语</button>
        </div>
      </div>
    </div>
    <div class="knowledge-filters">
      <button class="filter-btn ${filter === 'mistake' ? 'active' : ''}" onclick="navigate('practice',{filter:'mistake'})">🔥 仅易错题</button>
      <button class="filter-btn ${activeType === 'choice' ? 'active' : ''}" onclick="setFilter('type','choice')">选择题</button>
      <button class="filter-btn ${activeType === 'fillblank' ? 'active' : ''}" onclick="setFilter('type','fillblank')">填空题</button>
      <button class="filter-btn ${activeType === 'judge' ? 'active' : ''}" onclick="setFilter('type','judge')">判断题</button>
      <button class="filter-btn ${activeType === 'all' ? 'active' : ''}" onclick="setFilter('type','all')">全部题型</button>
      <span style="margin-left:auto;font-size:0.8rem;color:var(--text-muted)">第 ${STATE.practiceIndex + 1}/${questions.length} 题</span>
    </div>
    ${questions.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>没有符合条件的题目</h3>
        <p>请重新选择筛选条件</p>
      </div>
    ` : renderQuestionCard(questions[STATE.practiceIndex], STATE.practiceIndex, questions.length)}
  `;
}

function renderQuestionCard(q, index, total) {
  const prog = STATE.progress[q.id];
  const subjColors = { math: 'var(--math-color)', chinese: 'var(--chinese-color)', english: 'var(--english-color)' };
  const subjNames = { math: '数学', chinese: '语文', english: '英语' };
  const diffLabels = { 1: ['badge-easy', '简单'], 2: ['badge-medium', '中等'], 3: ['badge-hard', '较难'] };
  const [diffClass, diffName] = diffLabels[q.difficulty] || ['badge-easy', '简单'];

  let questionBody = '';
  if (q.type === 'choice') {
    questionBody = `
      <div class="options-grid" id="options-${q.id}">
        ${q.options.map((opt, i) => `
          <button class="option-btn ${prog?.selected === i ? 'selected' : ''}" 
            onclick="selectOption(${i}, '${q.id}')"
            ${prog?.answered ? 'disabled' : ''}>
            ${opt}
          </button>
        `).join('')}
      </div>
    `;
  } else if (q.type === 'judge') {
    questionBody = `
      <div class="options-grid" id="options-${q.id}">
        <button class="option-btn ${prog?.selected === 0 ? 'selected' : ''}" 
          onclick="selectOption(0, '${q.id}')"
          ${prog?.answered ? 'disabled' : ''}>✅ 正确（√）</button>
        <button class="option-btn ${prog?.selected === 1 ? 'selected' : ''}" 
          onclick="selectOption(1, '${q.id}')"
          ${prog?.answered ? 'disabled' : ''}>❌ 错误（×）</button>
      </div>
    `;
  } else if (q.type === 'fillblank') {
    questionBody = `
      <input type="text" class="fillblank-input ${prog?.answered ? (prog.correct ? 'correct' : 'wrong') : ''}" 
        id="fillblank-${q.id}"
        placeholder="请输入你的答案..."
        value="${prog?.userInput || ''}"
        ${prog?.answered ? 'readonly' : ''}/>
    `;
  }

  return `
    <div class="question-card" id="qcard-${q.id}">
      <div class="question-meta">
        <span class="question-badge ${diffClass}">${diffName}</span>
        ${q.isCommonMistake ? '<span class="question-badge badge-mistake">🔥 易错题</span>' : ''}
        <span style="font-size:0.78rem;color:${subjColors[q.subject]};font-weight:600">${subjNames[q.subject]}</span>
        <span style="margin-left:auto;font-size:0.78rem;color:var(--text-muted)">第 ${index + 1}/${total} 题</span>
      </div>
      <div class="question-text">${q.question}</div>
      ${questionBody}
      <div class="question-actions">
        ${!prog?.answered ? `
          <button class="btn btn-primary" onclick="submitAnswer('${q.id}')">确认答案</button>
        ` : `
          <button class="btn btn-ghost btn-sm" onclick="prevQuestion()">← 上一题</button>
          <button class="btn btn-primary" onclick="nextQuestion()">下一题 →</button>
          ${prog.correct ?
      '<span style="color:var(--success);font-weight:700;font-size:0.9rem">✅ 回答正确！</span>' :
      '<span style="color:var(--error);font-weight:700;font-size:0.9rem">❌ 回答错误</span>'}
        `}
      </div>
      <div class="explanation-box ${prog?.answered ? 'show' : ''}" id="exp-${q.id}">
        <div class="exp-title">💡 解析</div>
        <div class="exp-content">${prog?.answered ? escHtml(q.explanation) : ''}</div>
      </div>
    </div>
  `;
}

// ---- EXAMS ----
function renderExams() {
  const selectedGrade = STATE.selectedGrade || 6;
  const filteredExams = EXAMS_DATA.filter(exam =>
    (typeof gradeMatches === 'function') ? gradeMatches(exam.grade, selectedGrade) : true
  );
  return `
    <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:6px">模拟试卷</h2>
    <p style="color:var(--text-secondary);font-size:0.875rem;margin-bottom:24px">按科目选择模拟试卷，计时作答，自动批改评分</p>
    <div class="exam-list">
      ${filteredExams.length === 0 ? '<p style="color:var(--text-muted);text-align:center;padding:40px">当前年级暂无试卷，<a href="#" onclick="navigate(\'grade-select\')">切换年级</a>查看其他年级内容</p>' : filteredExams.map(exam => `
        <div class="exam-card" onclick="startExam('${exam.id}')">
          <div class="exam-card-left">
            <h3>${{ 'math': '📐', 'chinese': '📝', 'english': '🔤' }[exam.subject]} ${exam.title}</h3>
            <div class="exam-card-meta">
              <div class="exam-meta-item">⏰ ${exam.duration} 分钟</div>
              <div class="exam-meta-item">📊 满分 ${exam.totalScore} 分</div>
              <div class="exam-meta-item">📋 ${exam.sections.reduce((a, s) => a + s.questions.length, 0)} 道题</div>
              ${checkExamDone(exam.id) ? `<div class="exam-meta-item" style="color:var(--success)">✅ 已完成</div>` : ''}
            </div>
          </div>
          <button class="btn btn-primary">${checkExamDone(exam.id) ? '重新考试' : '开始考试'}</button>
        </div>
      `).join('')}
    </div>
    ${STATE.examResults.length ? `
      <div class="section-divider" style="margin-top:32px"><h3>历次成绩</h3></div>
      <div class="card-grid">
        ${STATE.examResults.map(r => `
          <div class="card">
            <div style="font-size:0.85rem;font-weight:600;margin-bottom:8px">${r.examTitle}</div>
            <div style="font-size:1.8rem;font-weight:900;color:var(--accent-blue)">${r.score}<span style="font-size:1rem;color:var(--text-muted)">/${r.total}</span></div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">${new Date(r.date).toLocaleDateString('zh-CN')}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

function checkExamDone(examId) {
  return STATE.examResults.some(r => r.examId === examId);
}

function renderExamInterface(params) {
  const exam = EXAMS_DATA.find(e => e.id === params.examId);
  if (!exam) return '<div class="empty-state"><div class="empty-icon">⚠️</div><h3>试卷不存在</h3></div>';

  const totalQ = exam.sections.reduce((a, s) => a + s.questions.length, 0);
  let questionHtml = exam.sections.map((section, si) => `
    <div style="margin-bottom:28px">
      <div class="section-divider"><h3>${section.name}</h3></div>
      ${section.questions.map((q, qi) => {
    const globalIndex = exam.sections.slice(0, si).reduce((a, s) => a + s.questions.length, 0) + qi;
    return renderExamQuestion(q, globalIndex, exam.id, section.type);
  }).join('')}
    </div>
  `).join('');

  return `
    <div style="margin-bottom:16px;display:flex;align-items:center;gap:10px">
      <button class="btn btn-ghost btn-sm" onclick="navigate('exams')">← 返回</button>
      <h2 style="font-size:1.1rem;font-weight:700">${exam.title}</h2>
    </div>
    <div class="exam-interface">
      <div class="exam-questions-panel" id="exam-q-panel">
        ${questionHtml}
        <div style="text-align:center;padding:20px 0">
          <button class="btn btn-primary btn-lg" onclick="submitExam('${exam.id}')">
            提交试卷并查看成绩
          </button>
        </div>
      </div>
      <div class="exam-sidebar-panel">
        <div class="exam-timer-card">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600">剩余时间</div>
          <div class="timer-display" id="exam-timer">00:00</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${exam.duration} 分钟</div>
        </div>
        <div class="exam-progress-card">
          <div style="font-size:0.78rem;color:var(--text-secondary);font-weight:600;margin-bottom:4px">答题进度</div>
          <div style="font-size:0.82rem;color:var(--text-muted)" id="exam-progress-text">已答 0/${totalQ}</div>
          <div class="exam-nav-grid" id="exam-nav-grid">
            ${Array.from({ length: totalQ }, (_, i) => `
              <div class="exam-nav-dot" id="nav-dot-${i}" onclick="scrollToExamQuestion(${i})">${i + 1}</div>
            `).join('')}
          </div>
        </div>
        <button class="btn btn-danger" style="width:100%" onclick="submitExam('${exam.id}')">
          提交试卷
        </button>
      </div>
    </div>
  `;
}

function renderExamQuestion(q, globalIndex, examId, sectionType) {
  const typeLabels = { choice: '选择题', fillblank: '填空题', judge: '判断题', solve: '解答题', essay: '作文', reading: '阅读理解', mixed: '综合题' };
  const qType = q.type || sectionType;  // 优先用题目自身 type，fallback 用 section 级别 type
  let body = '';
  if (qType === 'choice' || qType === 'judge') {
    const opts = q.options || (qType === 'judge' ? ['✅ 正确（√）', '❌ 错误（×）'] : []);
    body = `<div class="options-grid">
      ${opts.map((opt, i) => `<button class="option-btn" id="eq-${examId}-${q.id}-${i}" onclick="selectExamOption('${examId}','${q.id}',${i},this.parentElement)">${opt}</button>`).join('')}
    </div>`;
  } else if (qType === 'fillblank') {
    body = `<textarea class="fillblank-input" id="eq-${examId}-${q.id}" rows="2" placeholder="请填写答案..." oninput="markExamAnswered('${examId}','${q.id}',this.value)" style="resize:vertical"></textarea>`;
  } else {
    body = `<textarea class="fillblank-input" id="eq-${examId}-${q.id}" rows="5" placeholder="请写出解题过程和答案..." oninput="markExamAnswered('${examId}','${q.id}',this.value)" style="resize:vertical"></textarea>`;
  }
  if (q.passage) body = `<div class="kp-formula" style="margin-bottom:16px">${q.passage}</div>` + body;

  return `
    <div class="question-card" id="exam-question-${globalIndex}" style="margin-bottom:12px">
      <div class="question-meta">
        <span style="background:rgba(79,124,247,0.15);color:var(--accent-blue);padding:3px 10px;border-radius:12px;font-size:0.72rem;font-weight:700">${globalIndex + 1}</span>
        <span class="question-badge badge-easy">${typeLabels[qType] || qType || '解答题'}</span>
        ${q.points ? `<span style="font-size:0.75rem;color:var(--text-muted)">${q.points}分</span>` : ''}
      </div>
      <div class="question-text">${q.question}</div>
      ${body}
    </div>
  `;
}

function renderExamResult(params) {
  const result = params.result;
  const exam = EXAMS_DATA.find(e => e.id === result.examId);
  const pct = Math.round(result.score / result.total * 100);
  const grade = pct >= 90 ? '优秀' : pct >= 75 ? '良好' : pct >= 60 ? '及格' : '需要加油';
  const gradeColor = pct >= 90 ? 'var(--success)' : pct >= 75 ? 'var(--accent-blue)' : pct >= 60 ? 'var(--warning)' : 'var(--error)';

  return `
    <div class="score-report">
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:24px">${exam?.title || '试卷'} · 成绩报告</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:40px;margin-bottom:32px">
        <div>
          <div style="font-size:4rem;font-weight:900;color:${gradeColor}">${result.score}</div>
          <div style="font-size:1rem;color:var(--text-muted)">/ ${result.total} 分</div>
          <div style="font-size:1.2rem;font-weight:700;color:${gradeColor};margin-top:8px">${grade}</div>
        </div>
        <div style="text-align:left">
          <div class="score-summary">
            <div class="score-summary-item" style="text-align:left">
              <div class="num" style="color:var(--success)">${result.correct}</div>
              <div class="label">答对</div>
            </div>
            <div class="score-summary-item" style="text-align:left">
              <div class="num" style="color:var(--error)">${result.wrong}</div>
              <div class="label">答错</div>
            </div>
            <div class="score-summary-item" style="text-align:left">
              <div class="num" style="color:var(--text-muted)">${result.unanswered}</div>
              <div class="label">未答</div>
            </div>
          </div>
          <div style="font-size:0.875rem;color:var(--text-secondary)">正确率：${pct}%</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;margin-bottom:32px">
        <button class="btn btn-primary btn-lg" onclick="navigate('exams')">返回试卷列表</button>
        <button class="btn btn-ghost" onclick="navigate('errorbook')">查看错题本</button>
      </div>
      ${result.wrongAnswers && result.wrongAnswers.length ? `
        <div class="section-divider"><h3>答错的题目解析</h3></div>
        ${result.wrongAnswers.slice(0, 5).map(wa => `
          <div class="error-question-card">
            <div class="error-question-text">${wa.question}</div>
            <div class="error-your-answer">你的答案：${wa.yourAnswer || '未作答'}</div>
            <div class="error-correct-answer">正确答案：${wa.answer}</div>
            <div class="kp-tip" style="margin-top:8px">${escHtml(wa.explanation || '')}</div>
          </div>
        `).join('')}
      ` : ''}
    </div>
  `;
}

// ---- ERROR BOOK ----
function renderErrorBook() {
  const filterSubject = STATE.params?.subject || 'all';
  let errors = [...STATE.errorBook];
  if (filterSubject !== 'all') errors = errors.filter(e => e.subject === filterSubject);

  return `
    <div class="error-book-filters">
      <h2 style="font-size:1.2rem;font-weight:700">错题本</h2>
      <button class="filter-btn ${filterSubject === 'all' ? 'active' : ''}" onclick="navigate('errorbook',{subject:'all'})">全部</button>
      <button class="filter-btn math ${filterSubject === 'math' ? 'active' : ''}" onclick="navigate('errorbook',{subject:'math'})">数学</button>
      <button class="filter-btn chinese ${filterSubject === 'chinese' ? 'active' : ''}" onclick="navigate('errorbook',{subject:'chinese'})">语文</button>
      <button class="filter-btn english ${filterSubject === 'english' ? 'active' : ''}" onclick="navigate('errorbook',{subject:'english'})">英语</button>
      ${errors.length ? `<button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="clearMastered()">清除已掌握</button>` : ''}
    </div>
    ${errors.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <h3>太棒了！没有错题</h3>
        <p>继续练习，把易错题全部攻克！</p>
      </div>
    ` : errors.map(err => `
      <div class="error-question-card ${err.mastered ? 'mastered' : ''}" id="err-${err.id}">
        <div class="error-question-header">
          <div style="display:flex;gap:8px;align-items:center">
            <span class="question-badge ${err.subject === 'math' ? 'badge-hard' : err.subject === 'chinese' ? 'badge-medium' : 'badge-easy'}">${{ math: '数学', chinese: '语文', english: '英语' }[err.subject] || ''}</span>
            ${err.isCommonMistake ? '<span class="question-badge badge-mistake">🔥 易错题</span>' : ''}
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="error-count-badge">错了 ${err.errorCount || 1} 次</span>
            <button class="btn btn-ghost btn-sm" onclick="toggleMastered('${err.id}')">${err.mastered ? '✅ 已掌握' : '标记掌握'}</button>
          </div>
        </div>
        <div class="error-question-text">${err.question}</div>
        <div class="error-your-answer">❌ 你的答案：${err.yourAnswer || '未作答'}</div>
        <div class="error-correct-answer">✅ 正确答案：${err.answer}</div>
        <details style="margin-top:10px">
          <summary style="cursor:pointer;font-size:0.8rem;color:var(--accent-blue);font-weight:600">查看解析</summary>
          <div class="kp-tip" style="margin-top:8px">${escHtml(err.explanation || '')}</div>
        </details>
      </div>
    `).join('')}
  `;
}

// ---- REPORT ----
function renderReport() {
  const overall = getStats();
  return `
    <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:24px">学习报告</h2>
    <div class="report-grid">
      ${['math', 'chinese', 'english'].map(s => {
    const sp = getSubjectProgress(s);
    const subj = KNOWLEDGE_DATA[s];
    const errCount = STATE.errorBook.filter(e => e.subject === s).length;
    const color = { math: 'var(--math-color)', chinese: 'var(--chinese-color)', english: 'var(--english-color)' }[s];
    return `
          <div class="report-card">
            <div style="font-size:1.5rem;margin-bottom:8px">${subj.icon} ${subj.name}</div>
            <div style="font-size:2.5rem;font-weight:900;color:${color}">${sp.accuracy}%</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:16px">正确率（${sp.correct}/${sp.total || 0}题）</div>
            <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:12px">
              <div style="height:100%;width:${sp.accuracy}%;background:${color};border-radius:3px;transition:width 0.8s ease"></div>
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted)">错题：${errCount} 道</div>
          </div>
        `;
  }).join('')}
    </div>
    <div class="card">
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px">综合统计</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;text-align:center">
        <div>
          <div style="font-size:2rem;font-weight:700;color:var(--accent-blue)">${overall.answeredQuestions}</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">总答题数</div>
        </div>
        <div>
          <div style="font-size:2rem;font-weight:700;color:var(--error)">${STATE.errorBook.length}</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">错题总数</div>
        </div>
        <div>
          <div style="font-size:2rem;font-weight:700;color:var(--success)">${STATE.examResults.length}</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">完成试卷</div>
        </div>
      </div>
    </div>
    ${STATE.errorBook.length > 0 ? `
      <div class="section-divider" style="margin-top:24px"><h3>薄弱章节（错题最多）</h3></div>
      ${getWeakChapters().map(wc => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px">
          <span style="font-size:0.875rem;font-weight:500">${wc.name}</span>
          <span class="error-count-badge">${wc.count} 道错题</span>
        </div>
      `).join('')}
    `: ''}
  `;
}

function getWeakChapters() {
  const chapterCounts = {};
  STATE.errorBook.forEach(e => {
    const key = e.chapter || 'unknown';
    chapterCounts[key] = (chapterCounts[key] || 0) + 1;
  });
  return Object.entries(chapterCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ch, count]) => {
      const chName = findChapterName(ch);
      return { name: chName, count };
    });
}

function findChapterName(chId) {
  for (const [, subj] of Object.entries(KNOWLEDGE_DATA)) {
    const ch = subj.chapters.find(c => c.id === chId);
    if (ch) return `${subj.name} · ${ch.name}`;
  }
  return chId;
}

// ============ INTERACTIONS ============
function toggleAccordion(header) {
  header.classList.toggle('open');
  const body = header.nextElementSibling;
  body.classList.toggle('open');
}

function setFilter(type, value) {
  STATE.practiceFilter[type] = value;
  STATE.practiceIndex = 0;
  navigate('practice');
}

function selectOption(selectedIdx, qId) {
  const q = QUESTIONS_DATA.find(q => q.id === qId);
  if (!q || STATE.progress[qId]?.answered) return;

  const optionMap = ['A', 'B', 'C', 'D'];
  let isCorrect;
  let yourAnswer;

  if (q.type === 'choice') {
    const selectedLetter = optionMap[selectedIdx];
    isCorrect = selectedLetter === q.answer;
    yourAnswer = q.options[selectedIdx];
  } else if (q.type === 'judge') {
    const judgeAnswers = ['√', '×'];
    const selectedJudge = judgeAnswers[selectedIdx];
    isCorrect = selectedJudge === q.answer;
    yourAnswer = ['正确（√）', '错误（×）'][selectedIdx];
  }

  STATE.progress[qId] = { answered: true, correct: isCorrect, selected: selectedIdx, yourAnswer };

  const optButtons = document.querySelectorAll(`#options-${qId} .option-btn`);
  optButtons.forEach(btn => { btn.disabled = true; });
  optButtons[selectedIdx].classList.add(isCorrect ? 'correct' : 'wrong');

  if (!isCorrect) {
    // Highlight correct answer
    if (q.type === 'choice') {
      const correctIdx = optionMap.indexOf(q.answer);
      if (correctIdx >= 0) optButtons[correctIdx].classList.add('correct');
    } else if (q.type === 'judge') {
      const judgeAnswers = ['√', '×'];
      const correctIdx = judgeAnswers.indexOf(q.answer);
      if (correctIdx >= 0) optButtons[correctIdx].classList.add('correct');
    }
    addToErrorBook(q, yourAnswer);
  }

  showExplanation(qId, q.explanation);
  saveState();
  updateProgress(qId);
}

function submitAnswer(qId) {
  const q = QUESTIONS_DATA.find(q => q.id === qId);
  if (!q) return;

  if (q.type === 'fillblank') {
    const input = document.getElementById(`fillblank-${qId}`);
    const userInput = input.value.trim();
    if (!userInput) { showToast('请填写答案', 'error'); return; }

    const isCorrect = userInput.toLowerCase() === q.answer.toLowerCase() ||
      q.answer.split('；').some(a => userInput.includes(a.trim()));

    STATE.progress[qId] = { answered: true, correct: isCorrect, userInput, yourAnswer: userInput };
    input.classList.add(isCorrect ? 'correct' : 'wrong');
    input.readOnly = true;

    if (!isCorrect) addToErrorBook(q, userInput);
    showExplanation(qId, q.explanation);
    saveState();
    updateProgress(qId);

    const actionsDiv = document.querySelector(`#qcard-${qId} .question-actions`);
    if (actionsDiv) {
      actionsDiv.innerHTML = `
        <button class="btn btn-ghost btn-sm" onclick="prevQuestion()">← 上一题</button>
        <button class="btn btn-primary" onclick="nextQuestion()">下一题 →</button>
        ${isCorrect ?
          '<span style="color:var(--success);font-weight:700">✅ 回答正确！</span>' :
          '<span style="color:var(--error);font-weight:700">❌ 回答错误</span>'}
      `;
    }
  }
}

function showExplanation(qId, explanation) {
  const expBox = document.getElementById(`exp-${qId}`);
  if (expBox) {
    expBox.classList.add('show');
    expBox.querySelector('.exp-content').textContent = explanation;
  }
}

function addToErrorBook(q, yourAnswer) {
  const existing = STATE.errorBook.find(e => e.id === q.id);
  if (existing) {
    existing.errorCount = (existing.errorCount || 1) + 1;
    existing.yourAnswer = yourAnswer;
  } else {
    STATE.errorBook.push({
      id: q.id, subject: q.subject, chapter: q.chapter,
      question: q.question, answer: q.answer, yourAnswer,
      explanation: q.explanation, isCommonMistake: q.isCommonMistake,
      errorCount: 1, mastered: false, date: Date.now()
    });
  }
  saveState();
}

function nextQuestion() {
  if (STATE.practiceIndex < STATE.practiceQuestions.length - 1) {
    STATE.practiceIndex++;
  } else {
    showToast('🎉 本轮练习完成！', 'success');
    STATE.practiceIndex = 0;
  }
  navigate('practice');
}

function prevQuestion() {
  if (STATE.practiceIndex > 0) {
    STATE.practiceIndex--;
    navigate('practice');
  }
}

function updateProgress(qId) {
  updateMiniProgress();
}

// ---- EXAM LOGIC ----
let examTimerInterval = null;

function startExam(examId) {
  navigate('exam-interface', { examId });
}

function afterRender(page, params) {
  if (page === 'exam-interface') {
    const exam = EXAMS_DATA.find(e => e.id === params.examId);
    if (!exam) return;

    STATE.examState = {
      examId: params.examId,
      answers: {},
      startTime: Date.now(),
      duration: exam.duration * 60
    };

    // Initialize timer
    if (examTimerInterval) clearInterval(examTimerInterval);
    let remaining = exam.duration * 60;
    const timerEl = document.getElementById('exam-timer');

    examTimerInterval = setInterval(() => {
      remaining--;
      if (timerEl) {
        const m = Math.floor(remaining / 60).toString().padStart(2, '0');
        const s = (remaining % 60).toString().padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
        timerEl.className = 'timer-display';
        if (remaining <= 600) timerEl.classList.add('warning');
        if (remaining <= 60) timerEl.classList.add('danger');
      }
      if (remaining <= 0) {
        clearInterval(examTimerInterval);
        showToast('⏰ 时间到！自动提交...', 'error');
        setTimeout(() => submitExam(params.examId), 2000);
      }
    }, 1000);

    // Set initial timer display
    if (timerEl) {
      const m = Math.floor(exam.duration).toString().padStart(2, '0');
      timerEl.textContent = `${m}:00`;
    }
  }
}

function selectExamOption(examId, qId, idx, container) {
  if (!STATE.examState) return;
  STATE.examState.answers[qId] = idx;
  container.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
  });
  updateExamProgress(examId);
}

function markExamAnswered(examId, qId, value) {
  if (!STATE.examState) return;
  STATE.examState.answers[qId] = value;
  updateExamProgress(examId);
}

function updateExamProgress(examId) {
  const exam = EXAMS_DATA.find(e => e.id === examId);
  if (!exam || !STATE.examState) return;
  const totalQ = exam.sections.reduce((a, s) => a + s.questions.length, 0);
  const answered = Object.keys(STATE.examState.answers).length;
  const progressText = document.getElementById('exam-progress-text');
  if (progressText) progressText.textContent = `已答 ${answered}/${totalQ}`;

  // Update nav dots
  exam.sections.forEach((section, si) => {
    section.questions.forEach((q, qi) => {
      const globalIndex = exam.sections.slice(0, si).reduce((a, s) => a + s.questions.length, 0) + qi;
      const dot = document.getElementById(`nav-dot-${globalIndex}`);
      if (dot && STATE.examState.answers[q.id] !== undefined) {
        dot.classList.add('answered');
      }
    });
  });
}

function scrollToExamQuestion(index) {
  const el = document.getElementById(`exam-question-${index}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitExam(examId) {
  if (examTimerInterval) { clearInterval(examTimerInterval); examTimerInterval = null; }
  const exam = EXAMS_DATA.find(e => e.id === examId);
  if (!exam || !STATE.examState) return;

  let score = 0, correct = 0, wrong = 0, unanswered = 0;
  const wrongAnswers = [];

  exam.sections.forEach(section => {
    section.questions.forEach(q => {
      const userAnswer = STATE.examState.answers[q.id];
      if (userAnswer === undefined || userAnswer === '') { unanswered++; return; }

      if (q.type === 'choice') {
        const opts = ['A', 'B', 'C', 'D'];
        const selectedLetter = opts[userAnswer];
        const isCorrect = selectedLetter === q.answer;
        if (isCorrect) { score += q.points || 3; correct++; }
        else {
          wrong++;
          wrongAnswers.push({ question: q.question, answer: q.answer, yourAnswer: q.options?.[userAnswer] || userAnswer, explanation: q.explanation || '' });
        }
      } else if (q.type === 'judge') {
        const judgeMap = ['√', '×'];
        const isCorrect = judgeMap[userAnswer] === q.answer;
        if (isCorrect) { score += q.points || 2; correct++; }
        else {
          wrong++;
          wrongAnswers.push({ question: q.question, answer: q.answer, yourAnswer: ['正确', '错误'][userAnswer], explanation: q.explanation || '' });
        }
      } else {
        // For fillblank/solve/essay: partial credit (3/5 of points for attempting)
        score += Math.round((q.points || 5) * 0.6);
        correct++;
      }
    });
  });

  const totalScore = exam.totalScore;
  const result = {
    examId, examTitle: exam.title,
    score, total: totalScore,
    correct, wrong, unanswered,
    wrongAnswers,
    date: Date.now()
  };

  const existingIdx = STATE.examResults.findIndex(r => r.examId === examId);
  if (existingIdx >= 0) STATE.examResults[existingIdx] = result;
  else STATE.examResults.push(result);
  saveState();

  navigate('exam-result', { result });
}

// ---- ERROR BOOK ACTIONS ----
function toggleMastered(errId) {
  const err = STATE.errorBook.find(e => e.id === errId);
  if (err) {
    err.mastered = !err.mastered;
    saveState();
    navigate('errorbook', STATE.params);
  }
}

function clearMastered() {
  STATE.errorBook = STATE.errorBook.filter(e => !e.mastered);
  saveState();
  navigate('errorbook', STATE.params);
  showToast('已清除掌握的错题', 'success');
}

// ============ UTILITIES ============
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateMiniProgress() {
  ['math', 'chinese', 'english'].forEach(s => {
    const sp = getSubjectProgress(s);
    const el = document.getElementById(`mini-${s}`);
    if (el) el.style.width = sp.accuracy + '%';
    const label = document.getElementById(`mini-label-${s}`);
    if (label) label.textContent = sp.accuracy + '%';
  });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  // Multi-user init: check if user system is available
  if (typeof getUsers === 'function' && typeof renderUserSelectScreen === 'function') {
    const users = getUsers();
    const currentUid = (typeof getCurrentUserId === 'function') ? getCurrentUserId() : null;
    const currentUser = currentUid ? users.find(u => u.id === currentUid) : null;
    if (!currentUser) {
      // No logged-in user: show user select screen
      document.querySelector('.sidebar').style.display = 'none';
      document.querySelector('.main').style.display = 'none';
      const screen = document.createElement('div');
      screen.innerHTML = renderUserSelectScreen();
      // Use firstElementChild to skip text nodes created by formatting spaces
      document.body.appendChild(screen.firstElementChild);
      if (typeof initUserSelect === 'function') initUserSelect();
      return;
    } else {
      // Load stored user data into STATE
      if (typeof loadUserToState === 'function') loadUserToState(currentUid);
      if (typeof updateSidebarUser === 'function') updateSidebarUser();
    }
  } else {
    // Fallback: load from legacy localStorage
    STATE.errorBook = JSON.parse(localStorage.getItem('errorBook') || '[]');
    STATE.progress = JSON.parse(localStorage.getItem('progress') || '{}');
    STATE.examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
  }
  navigate('dashboard');
});
