// ============ GRADE SELECTION PAGE ============
function renderGradeSelectPage() {
    const currentGrade = STATE.selectedGrade || 6;
    return `
    <div class="grade-select-page">
      <div class="grade-select-header">
        <h2>选择学习年级</h2>
        <p>每个年级有独立的知识点、练习题和模拟试卷</p>
      </div>
      <div class="grade-select-grid">
        ${Object.entries(GRADE_CONFIG).map(([g, cfg]) => {
        const gNum = parseInt(g);
        const isActive = gNum === currentGrade;
        return `
            <div class="grade-select-card ${isActive ? 'active' : ''}" 
                 onclick="applyGrade(${g})"
                 style="--grade-color:${cfg.color}">
              <div class="grade-card-emoji">${cfg.emoji}</div>
              <div class="grade-card-label">${cfg.label}</div>
              <div class="grade-card-tag">${cfg.tag}</div>
              ${isActive ? '<div class="grade-card-current">当前</div>' : ''}
              <div class="grade-card-stats">${getGradeStats(gNum)}</div>
            </div>
          `;
    }).join('')}
      </div>
    </div>
  `;
}

function getGradeStats(grade) {
    const kCount = countKnowledgeForGrade(grade);
    const qCount = (typeof QUESTIONS_DATA !== 'undefined')
        ? QUESTIONS_DATA.filter(q => gradeMatches(q.grade, grade)).length
        : 0;
    const eCount = (typeof EXAMS_DATA !== 'undefined')
        ? EXAMS_DATA.filter(e => gradeMatches(e.grade, grade)).length
        : 0;
    return `${kCount}个知识点 · ${qCount}道练习题 · ${eCount}套试卷`;
}

function countKnowledgeForGrade(grade) {
    if (typeof KNOWLEDGE_DATA === 'undefined') return 0;
    let count = 0;
    Object.values(KNOWLEDGE_DATA).forEach(subj => {
        subj.chapters.forEach(ch => {
            if (gradeMatches(ch.grade, grade)) {
                count += ch.points.length;
            }
        });
    });
    return count;
}

// Grade matching: grade 7 = 小升初, shows all grade-6 + grade-7 content
// grade 6 shows grade-6 content
// lower grades show their own content only
function gradeMatches(contentGrade, selectedGrade) {
    if (!contentGrade) return selectedGrade === 6; // legacy content defaults to grade 6
    if (selectedGrade === 7) return contentGrade === 6 || contentGrade === 7;
    return contentGrade === selectedGrade;
}

function applyGrade(grade) {
    STATE.selectedGrade = parseInt(grade);
    saveStateForCurrentUser();
    const uid = STATE.currentUserId;
    if (uid) updateUser(uid, { grade: STATE.selectedGrade });
    updateSidebarUser();
    showToast(`已切换到${GRADE_CONFIG[grade]?.label}`, 'success');
    navigate('dashboard');
}
