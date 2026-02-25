/* ========================================
   Eric's Blog - JavaScript 主文件
   ======================================== */

// 文章数据
const articlesData = [
    {
        id: 1,
        title: 'Node.js 性能优化实战',
        excerpt: '深入探讨 Node.js 应用的性能优化策略，从代码层面到架构设计，全方位提升应用性能。',
        category: '后端',
        date: '2026年1月20日',
        readTime: '8 分钟阅读',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
        tags: ['Node.js', '性能优化']
    },
    {
        id: 2,
        title: 'ChatGPT API 实战应用',
        excerpt: '学习如何在项目中集成 ChatGPT API，构建智能对话应用和自动化工作流。',
        category: 'AI',
        date: '2026年1月18日',
        readTime: '12 分钟阅读',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        tags: ['AI', 'ChatGPT', 'API']
    },
    {
        id: 3,
        title: 'VS Code 效率提升技巧',
        excerpt: '分享我日常使用 VS Code 的一些效率技巧和必备插件推荐。',
        category: '工具',
        date: '2026年1月15日',
        readTime: '6 分钟阅读',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        tags: ['VS Code', '效率']
    },
    {
        id: 4,
        title: '程序员的自我修养',
        excerpt: '关于技术成长、职业规划和生活平衡的一些思考与感悟。',
        category: '思考',
        date: '2026年1月12日',
        readTime: '5 分钟阅读',
        image: 'https://images.unsplash.com/photo-1522542550221-31fd8575f5f3?w=400',
        tags: ['成长', '职业']
    },
    {
        id: 5,
        title: 'Docker 容器化部署指南',
        excerpt: '从零开始学习 Docker，掌握容器化部署的核心概念和实践技巧。',
        category: 'DevOps',
        date: '2026年1月10日',
        readTime: '10 分钟阅读',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
        tags: ['Docker', '部署']
    },
    {
        id: 6,
        title: 'MongoDB vs PostgreSQL 对比',
        excerpt: '深入对比两种主流数据库的特点、适用场景和选型建议。',
        category: '数据库',
        date: '2026年1月8日',
        readTime: '15 分钟阅读',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        tags: ['MongoDB', 'PostgreSQL']
    }
];

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMobileMenu();
    initSearchModal();
    initBackToTop();
    initGreeting();
    initCounterAnimation();
    initArticlesGrid();
    initLoadMore();
    initSubscribeForm();
});

// 主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// 移动端菜单
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // 点击链接关闭菜单
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// 搜索模态框
function initSearchModal() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (!searchBtn || !searchModal) return;

    searchBtn.addEventListener('click', function () {
        searchModal.classList.add('active');
        searchInput.focus();
    });

    closeSearch.addEventListener('click', function () {
        searchModal.classList.remove('active');
    });

    searchModal.addEventListener('click', function (e) {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
        }
    });

    // ESC 键关闭
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
    });

    // 搜索功能
    searchInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.innerHTML = '<p class="search-hint">输入关键词开始搜索...</p>';
            return;
        }

        const results = articlesData.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query) ||
            article.category.toLowerCase().includes(query) ||
            article.tags.some(tag => tag.toLowerCase().includes(query))
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<p class="search-hint">没有找到相关文章</p>';
            return;
        }

        searchResults.innerHTML = results.map(article => `
            <a href="article.html?id=${article.id}" class="search-result-item">
                <img src="${article.image}" alt="${article.title}">
                <div class="search-result-content">
                    <h4>${article.title}</h4>
                    <span>${article.category} · ${article.date}</span>
                </div>
            </a>
        `).join('');
    });
}

// 回到顶部按钮
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 问候语
function initGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greeting = '你好';

    if (hour >= 5 && hour < 12) {
        greeting = '早上好';
    } else if (hour >= 12 && hour < 18) {
        greeting = '下午好';
    } else {
        greeting = '晚上好';
    }

    greetingEl.textContent = greeting;
}

// 数字动画
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, duration / steps);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// 初始化文章网格
function initArticlesGrid() {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;

    renderArticles(articlesData);
}

function renderArticles(articles) {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;

    articlesGrid.innerHTML = articles.map(article => `
        <article class="article-card">
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}">
                <span class="article-category">${article.category}</span>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-date"><i class="far fa-calendar"></i> ${article.date}</span>
                    <span class="article-read-time"><i class="far fa-clock"></i> ${article.readTime}</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

// 加载更多
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function () {
        const spinner = this.querySelector('i');
        const text = this.querySelector('span');

        if (spinner) spinner.style.display = 'inline-block';
        if (text) text.textContent = '加载中...';

        setTimeout(() => {
            if (spinner) spinner.style.display = 'none';
            if (text) text.textContent = '没有更多文章了';
            this.disabled = true;
            this.style.opacity = '0.5';
        }, 1500);
    });
}

// 订阅表单
function initSubscribeForm() {
    const subscribeForm = document.getElementById('subscribeForm');
    if (!subscribeForm) return;

    subscribeForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = this.querySelector('input[type="email"]').value;
        const button = this.querySelector('button');

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 订阅中...';

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> 订阅成功！';
            button.style.background = '#10b981';

            setTimeout(() => {
                button.innerHTML = '订阅 <i class="fas fa-paper-plane"></i>';
                button.style.background = '';
                this.reset();
            }, 2000);
        }, 1500);
    });
}

// 添加搜索结果样式
const searchResultStyles = `
.search-result-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: background 0.2s;
}

.search-result-item:hover {
    background: var(--bg-tertiary);
}

.search-result-item img {
    width: 60px;
    height: 60px;
    border-radius: 0.5rem;
    object-fit: cover;
}

.search-result-content h4 {
    font-size: 0.9375rem;
    margin-bottom: 0.25rem;
}

.search-result-content span {
    font-size: 0.8125rem;
    color: var(--text-muted);
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = searchResultStyles;
document.head.appendChild(styleSheet);
