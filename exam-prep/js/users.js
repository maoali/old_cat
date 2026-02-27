// ============ MULTI-USER MANAGEMENT MODULE ============
// Storage keys
const STORAGE_KEYS = {
  USERS: 'exam-prep-users',
  CURRENT_USER: 'exam-prep-current-user',
  USER_DATA: (uid) => `exam-prep-data-${uid}`,
};

// Default avatars (emoji)
const AVATARS = ['🐼', '🦁', '🐯', '🦊', '🐻', '🐸', '🦋', '🐬', '🦄', '🐉', '🌟', '🚀'];

const GRADE_CONFIG = {
  1: { label: '一年级', tag: '小学一年级', emoji: '🌱', color: '#f59e0b' },
  2: { label: '二年级', tag: '小学二年级', emoji: '🌿', color: '#10b981' },
  3: { label: '三年级', tag: '小学三年级', emoji: '🍀', color: '#3b82f6' },
  4: { label: '四年级', tag: '小学四年级', emoji: '🌸', color: '#8b5cf6' },
  5: { label: '五年级', tag: '小学五年级', emoji: '🌺', color: '#ec4899' },
  6: { label: '六年级', tag: '小学六年级', emoji: '🌟', color: '#f97316' },
  7: { label: '小升初强化', tag: '小升初冲刺', emoji: '🏆', color: '#ef4444' },
};

// ---- User CRUD ----
function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUserId() {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
}

function setCurrentUserId(uid) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, uid);
}

function getCurrentUser() {
  const uid = getCurrentUserId();
  if (!uid) return null;
  return getUsers().find(u => u.id === uid) || null;
}

function createUser(name, avatar, grade) {
  const users = getUsers();
  const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const user = { id: uid, name, avatar, grade: parseInt(grade), createdAt: Date.now() };
  users.push(user);
  saveUsers(users);
  return user;
}

function deleteUser(uid) {
  let users = getUsers();
  users = users.filter(u => u.id !== uid);
  saveUsers(users);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA(uid));
  if (getCurrentUserId() === uid) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

function updateUser(uid, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === uid);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    return users[idx];
  }
  return null;
}

// ---- Per-User Data ----
function getUserData(uid) {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA(uid));
  if (!raw) return { errorBook: [], progress: {}, examResults: [], selectedGrade: null };
  return JSON.parse(raw);
}

function saveUserData(uid, data) {
  localStorage.setItem(STORAGE_KEYS.USER_DATA(uid), JSON.stringify(data));
}

// ---- User Selection Screen ----
function renderUserSelectScreen() {
  const users = getUsers();
  return `
    <div class="user-select-screen" id="user-select-screen">
      <div class="user-select-inner">
        <div class="user-select-logo">
          <div class="user-select-logo-icon">📚</div>
          <h1>小学备考系统</h1>
          <p>请选择你的学习档案，或创建新档案</p>
        </div>
        <div class="user-card-grid">
          ${users.map(u => `
            <div class="user-card" onclick="selectUser('${u.id}')">
              <div class="user-avatar">${u.avatar}</div>
              <div class="user-card-name">${escHtml(u.name)}</div>
              <div class="user-card-grade">${GRADE_CONFIG[u.grade]?.emoji || '📖'} ${GRADE_CONFIG[u.grade]?.label || ''}</div>
              <button class="user-card-delete" onclick="event.stopPropagation(); confirmDeleteUser('${u.id}', '${escHtml(u.name)}')" title="删除档案">🗑️</button>
            </div>
          `).join('')}
          <div class="user-card user-card-new" onclick="showCreateUserModal()">
            <div class="user-avatar user-avatar-new">➕</div>
            <div class="user-card-name">新建档案</div>
            <div class="user-card-grade">开始学习之旅</div>
          </div>
        </div>
      </div>
      <!-- Create User Modal -->
      <div class="modal-overlay" id="create-user-modal" style="display:none">
        <div class="modal-box">
          <div class="modal-title">创建学习档案</div>
          <div class="form-group">
            <label>你的名字</label>
            <input type="text" id="new-user-name" class="fillblank-input" placeholder="请输入姓名..." maxlength="10" />
          </div>
          <div class="form-group">
            <label>选择头像</label>
            <div class="avatar-picker" id="avatar-picker">
              ${AVATARS.map((a, i) => `
                <div class="avatar-option ${i === 0 ? 'selected' : ''}" onclick="selectAvatar(this, '${a}')">${a}</div>
              `).join('')}
            </div>
          </div>
          <div class="form-group">
            <label>选择年级</label>
            <div class="grade-picker" id="grade-picker">
              ${Object.entries(GRADE_CONFIG).map(([g, cfg]) => `
                <div class="grade-option ${g == 6 ? 'selected' : ''}" onclick="selectGrade(this, ${g})" style="--grade-color:${cfg.color}">
                  <span>${cfg.emoji}</span><span>${cfg.label}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div style="display:flex;gap:12px;margin-top:20px">
            <button class="btn btn-ghost" onclick="hideCreateUserModal()">取消</button>
            <button class="btn btn-primary" style="flex:1" onclick="submitCreateUser()">创建档案</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- Interactions for User Select ----
let _selectedAvatar = AVATARS[0];
let _selectedGrade = 6;

function selectAvatar(el, avatar) {
  _selectedAvatar = avatar;
  document.querySelectorAll('.avatar-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

function selectGrade(el, grade) {
  _selectedGrade = parseInt(grade);
  document.querySelectorAll('.grade-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

function showCreateUserModal() {
  _selectedAvatar = AVATARS[0];
  _selectedGrade = 6;
  const modal = document.getElementById('create-user-modal');
  if (modal) modal.style.display = 'flex';
  const nameInput = document.getElementById('new-user-name');
  if (nameInput) nameInput.value = '';
  // Reset selections
  document.querySelectorAll('.avatar-option').forEach((e, i) => e.classList.toggle('selected', i === 0));
  document.querySelectorAll('.grade-option').forEach(e => e.classList.toggle('selected', e.dataset.grade == '6'));
}

function hideCreateUserModal() {
  const modal = document.getElementById('create-user-modal');
  if (modal) modal.style.display = 'none';
}

function submitCreateUser() {
  const nameInput = document.getElementById('new-user-name');
  const name = nameInput?.value?.trim();
  if (!name) { showToast('请输入姓名', 'error'); return; }
  const user = createUser(name, _selectedAvatar, _selectedGrade);
  selectUser(user.id);
}

function selectUser(uid) {
  setCurrentUserId(uid);
  loadUserToState(uid);
  // Hide user select screen and show main app
  const screen = document.getElementById('user-select-screen');
  if (screen) screen.remove();
  document.querySelector('.sidebar').style.display = '';
  document.querySelector('.main').style.display = '';
  updateSidebarUser();
  navigate('dashboard');
}

function confirmDeleteUser(uid, name) {
  if (confirm(`确认删除"${name}"的所有学习记录？此操作不可恢复。`)) {
    deleteUser(uid);
    // Re-render the user select screen content
    const screen = document.getElementById('user-select-screen');
    if (screen) screen.outerHTML = renderUserSelectScreen();
    // Re-init after re-render
    initUserSelect();
  }
}

// ---- Load user data into STATE ----
function loadUserToState(uid) {
  const data = getUserData(uid);
  STATE.errorBook = data.errorBook || [];
  STATE.progress = data.progress || {};
  STATE.examResults = data.examResults || [];
  const user = getUsers().find(u => u.id === uid);
  STATE.currentUserId = uid;
  STATE.selectedGrade = data.selectedGrade || (user ? user.grade : 6);
}

function saveStateForCurrentUser() {
  const uid = STATE.currentUserId;
  if (!uid) return;
  saveUserData(uid, {
    errorBook: STATE.errorBook,
    progress: STATE.progress,
    examResults: STATE.examResults,
    selectedGrade: STATE.selectedGrade,
  });
}

// ---- Sidebar user badge ----
function updateSidebarUser() {
  const user = getCurrentUser();
  const el = document.getElementById('sidebar-user-badge');
  if (!el || !user) return;
  const grade = GRADE_CONFIG[STATE.selectedGrade] || GRADE_CONFIG[6];
  el.innerHTML = `
    <div class="sidebar-user-avatar" onclick="switchUser()" title="切换用户">${user.avatar}</div>
    <div class="sidebar-user-info">
      <div class="sidebar-user-name">${escHtml(user.name)}</div>
      <div class="sidebar-user-grade" style="color:${grade.color}">${grade.emoji} ${grade.label}</div>
    </div>
    <button class="btn btn-ghost btn-xs" onclick="switchUser()" title="切换用户">切换</button>
  `;
}

function switchUser() {
  // Save before switching
  saveStateForCurrentUser();
  // Reset state
  STATE.currentUserId = null;
  STATE.errorBook = [];
  STATE.progress = {};
  STATE.examResults = [];
  STATE.selectedGrade = 6;
  // Show user select screen
  document.querySelector('.sidebar').style.display = 'none';
  document.querySelector('.main').style.display = 'none';
  const body = document.querySelector('body');
  const div = document.createElement('div');
  div.innerHTML = renderUserSelectScreen();
  // Use firstElementChild to skip text nodes created by formatting spaces
  body.appendChild(div.firstElementChild);
  initUserSelect();
}

function initUserSelect() {
  // Re-bind grade-option data attributes
  document.querySelectorAll('.grade-option').forEach(el => {
    const g = [...Object.entries(GRADE_CONFIG)].find(([, cfg]) => el.querySelector('span:last-child')?.textContent === cfg.label);
    if (g) el.dataset.grade = g[0];
  });
}

// ---- Grade switch (in app) ----
function setSelectedGrade(grade) {
  STATE.selectedGrade = parseInt(grade);
  saveStateForCurrentUser();
  // Update user's default grade
  const uid = STATE.currentUserId;
  if (uid) updateUser(uid, { grade: STATE.selectedGrade });
  updateSidebarUser();
  navigate('grade-select');
}
