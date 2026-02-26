// Shared API helper and utilities

const API = {
    async request(method, path, body, isFormData = false) {
        const opts = {
            method,
            credentials: 'same-origin',
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
        };
        const res = await fetch('/api' + path, opts);
        if (res.status === 401) {
            window.location.href = '/index.html';
            return null;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '操作失败');
        return data;
    },
    get: (path) => API.request('GET', path),
    post: (path, body) => API.request('POST', path, body),
    patch: (path, body) => API.request('PATCH', path, body),
    delete: (path) => API.request('DELETE', path),
    postForm: (path, formData) => API.request('POST', path, formData, true)
};

// Toast notifications
function toast(msg, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    t.innerHTML = `<span>${icons[type] || '•'}</span><span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; t.style.transition = '0.2s'; setTimeout(() => t.remove(), 200); }, 3000);
}

// Status labels & badge classes
const STATUS_MAP = {
    pending_review: { label: '待审核', cls: 'badge-pending', icon: '⏳' },
    approved: { label: '已批准', cls: 'badge-approved', icon: '✅' },
    rejected: { label: '已驳回', cls: 'badge-rejected', icon: '❌' },
    evidence_submitted: { label: '已提交举证', cls: 'badge-evidence', icon: '📎' },
    evaluated: { label: '已评估', cls: 'badge-evaluated', icon: '🏆' },
    evaluation_rejected: { label: '评估未过', cls: 'badge-eval_rejected', icon: '⛔' },
    project_pending: { label: '待立项', cls: 'badge-project_pending', icon: '🔖' },
    project_established: { label: '已立项', cls: 'badge-project_established', icon: '🚀' },
};

const CATEGORY_LIST = ['技术创新', '流程优化', '产品创新', '管理创新', '市场开拓', '其他'];
const ROLE_MAP = { employee: '员工', reviewer: '审核员', expert: '专家', admin: '管理员' };

function getBadge(status) {
    const s = STATUS_MAP[status] || { label: status, cls: '', icon: '•' };
    return `<span class="badge ${s.cls}">${s.icon} ${s.label}</span>`;
}

function getCatTag(cat) {
    const cls = cat.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '');
    return `<span class="cat-tag cat-${cls}">${cat}</span>`;
}

function fmtDate(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function fmtDateOnly(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleDateString('zh-CN');
}

// Sidebar current user render
async function renderSidebar(activePage) {
    try {
        const data = await API.get('/auth/me');
        if (!data) return;
        const user = data.user;
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role-label').textContent = ROLE_MAP[user.role] || user.role;
        document.getElementById('user-avatar').textContent = user.name.charAt(0);
        // Store globally
        window.currentUser = user;

        // Show/hide role-specific nav items
        document.querySelectorAll('[data-role]').forEach(el => {
            const roles = el.dataset.role.split(',');
            if (!roles.includes(user.role)) el.style.display = 'none';
        });

        // Active nav
        document.querySelectorAll('.nav-item').forEach(el => {
            if (el.dataset.page === activePage) el.classList.add('active');
        });
    } catch (e) {
        window.location.href = '/index.html';
    }
}

// Logout
async function logout() {
    await API.post('/auth/logout');
    window.location.href = '/index.html';
}

// Modal helpers
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
