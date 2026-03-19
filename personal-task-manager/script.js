// 个人事务管理应用
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.checkInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTasks();
        this.setupReminders();
        this.setDefaultDateTime();
    }

    // 设置默认日期时间为当前时间
    setDefaultDateTime() {
        const now = new Date();
        const dateInput = document.getElementById('taskDate');
        const timeInput = document.getElementById('taskTime');

        // 设置日期为今天
        dateInput.value = now.toISOString().split('T')[0];

        // 设置时间为当前时间（四舍五入到最近的15分钟）
        const minutes = Math.round(now.getMinutes() / 15) * 15;
        now.setMinutes(minutes);
        timeInput.value = now.toTimeString().slice(0, 5);
    }

    // 设置事件监听器
    setupEventListeners() {
        // 表单提交
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // 筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    // 添加新事务
    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const date = document.getElementById('taskDate').value;
        const time = document.getElementById('taskTime').value;
        const priority = document.getElementById('taskPriority').value;

        if (!title || !date || !time) {
            alert('请填写必填字段！');
            return;
        }

        const task = {
            id: Date.now(),
            title,
            description,
            datetime: `${date}T${time}`,
            priority,
            completed: false,
            notified: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.resetForm();
        this.setDefaultDateTime();

        // 显示成功消息
        this.showNotification('事务添加成功！');
    }

    // 重置表单
    resetForm() {
        document.getElementById('taskForm').reset();
    }

    // 删除事务
    deleteTask(id) {
        if (confirm('确定要删除这个事务吗？')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
        }
    }

    // 标记事务为完成/未完成
    toggleComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    // 设置筛选器
    setFilter(filter) {
        this.currentFilter = filter;

        // 更新按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.renderTasks();
    }

    // 获取筛选后的事务
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    // 渲染事务列表
    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        // 按日期时间排序
        filteredTasks.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
    }

    // 创建事务HTML
    createTaskHTML(task) {
        const datetime = new Date(task.datetime);
        const formattedDate = this.formatDate(datetime);
        const formattedTime = this.formatTime(datetime);
        const priorityText = {
            high: '高',
            medium: '中',
            low: '低'
        };

        return `
            <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHTML(task.title)}</h3>
                    <div class="task-actions">
                        <button class="task-btn btn-complete" onclick="taskManager.toggleComplete(${task.id})">
                            ${task.completed ? '撤销' : '完成'}
                        </button>
                        <button class="task-btn btn-delete" onclick="taskManager.deleteTask(${task.id})">
                            删除
                        </button>
                    </div>
                </div>
                ${task.description ? `<p class="task-description">${this.escapeHTML(task.description)}</p>` : ''}
                <div class="task-meta">
                    <span>📅 ${formattedDate}</span>
                    <span>⏰ ${formattedTime}</span>
                    <span class="priority-badge">${priorityText[task.priority]}优先级</span>
                </div>
            </div>
        `;
    }

    // 格式化日期
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
        return date.toLocaleDateString('zh-CN', options);
    }

    // 格式化时间
    formatTime(date) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    // HTML转义
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // 保存事务到本地存储
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // 从本地存储加载事务
    loadTasks() {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    }

    // 设置提醒系统
    setupReminders() {
        // 请求通知权限
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('通知权限已获取');
                }
            });
        }

        // 每分钟检查一次提醒
        this.checkInterval = setInterval(() => {
            this.checkReminders();
        }, 60000); // 每分钟检查一次

        // 立即检查一次
        this.checkReminders();
    }

    // 检查提醒
    checkReminders() {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 一小时后

        this.tasks.forEach(task => {
            if (task.completed || task.notified) return;

            const taskTime = new Date(task.datetime);

            // 检查是否到了提醒时间（在过去一小时内）
            if (taskTime <= now && taskTime > new Date(now.getTime() - 60 * 60 * 1000)) {
                this.sendReminder(task);
                task.notified = true;
                this.saveTasks();
            }
            // 检查是否在一小时内即将到来
            else if (taskTime <= oneHourLater && taskTime > now) {
                const minutesUntil = Math.round((taskTime - now) / (1000 * 60));
                if (minutesUntil <= 5 && !task.notified) { // 5分钟内提醒
                    this.sendReminder(task, `还有 ${minutesUntil} 分钟`);
                    task.notified = true;
                    this.saveTasks();
                }
            }
        });
    }

    // 发送提醒
    sendReminder(task, prefix = '') {
        const message = prefix ? `${prefix}：${task.title}` : task.title;

        // 浏览器通知
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('📋 事务提醒', {
                body: message,
                icon: '📋',
                requireInteraction: true
            });
        }

        // 应用内弹窗提醒
        this.showModalNotification(message);
    }

    // 显示弹窗通知
    showModalNotification(message) {
        const modal = document.getElementById('notificationModal');
        const notificationText = document.getElementById('notificationText');

        notificationText.textContent = message;
        modal.classList.add('show');

        // 5秒后自动关闭
        setTimeout(() => {
            this.closeModalNotification();
        }, 5000);
    }

    // 关闭弹窗通知
    closeModalNotification() {
        const modal = document.getElementById('notificationModal');
        modal.classList.remove('show');
    }

    // 显示简单通知
    showNotification(message) {
        // 创建临时通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            animation: slideIn 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // 3秒后移除
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 清理过期的事务（可选功能）
    cleanupOldTasks() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        this.tasks = this.tasks.filter(task => {
            const taskDate = new Date(task.datetime);
            return taskDate > oneWeekAgo || !task.completed;
        });

        this.saveTasks();
        this.renderTasks();
    }
}

// 全局函数（用于HTML中的onclick）
function closeNotification() {
    taskManager.closeModalNotification();
}

// 初始化应用
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);