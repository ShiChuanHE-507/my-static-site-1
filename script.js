document.addEventListener('DOMContentLoaded', function() {
    // 1. 文本转换工具逻辑
    const convertBtn = document.getElementById('convertBtn');
    const inputText = document.getElementById('inputText');
    const resultBox = document.getElementById('result');

    convertBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (text === '') {
            resultBox.textContent = '请输入要转换的文本！';
            return;
        }
        resultBox.textContent = text.toUpperCase();
    });

    // 2. 侧边栏菜单高亮逻辑
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 1. 侧边栏菜单高亮逻辑（保留）
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. 平滑滚动（保留，已在CSS中设置html { scroll-behavior: smooth; }，此处作为兼容备份）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
// 页面加载完成后执行

document.addEventListener('DOMContentLoaded', function() {
    // 1. 侧边栏菜单高亮逻辑
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有菜单的active类
            menuItems.forEach(i => i.classList.remove('active'));
            // 给当前点击的菜单添加active类
            this.classList.add('active');
        });
    });

    // 2. 站内搜索核心逻辑（直接跳转，无弹窗）
    // 获取DOM元素
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // 定义需要搜索的内容模块
    function getSearchableContent() {
        const content = {};
        // 遍历所有教学模块卡片
        document.querySelectorAll('.content-card').forEach(card => {
            const cardId = card.id;
            const cardTitle = card.querySelector('h2').textContent;
            const cardText = card.querySelector('.copy-area')?.innerText || '';
            // 只收集有内容的模块
            if (cardText) {
                content[cardId] = {
                    title: cardTitle,
                    text: cardText
                };
            }
        });
        return content;
    }

    // 搜索执行函数（直接跳转）
    function searchAndJump(keyword) {
        // 空关键词校验
        if (!keyword.trim()) {
            alert('请输入搜索关键词（如：SA2、蹲中拳、板边压制）！');
            return;
        }

        // 获取所有可搜索内容
        const content = getSearchableContent();
        let targetId = null;

        // 遍历内容，匹配关键词（不区分大小写）
        for (const [id, data] of Object.entries(content)) {
            const lowerText = data.text.toLowerCase();
            const lowerKeyword = keyword.toLowerCase();
            
            // 匹配到关键词，记录第一个匹配的模块ID
            if (lowerText.includes(lowerKeyword)) {
                targetId = id;
                break; // 只跳转到第一个匹配的模块
            }
        }   

        // 跳转逻辑
        if (targetId) {
            // 1. 跳转到对应模块（平滑滚动）
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // 2. 高亮对应侧边栏菜单
            menuItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${targetId}`) {
                    item.classList.add('active');
                }
            });

            // 3. 可选：给匹配模块添加临时高亮（3秒后取消，提升体验）
            targetElement.style.backgroundColor = '#f0f8ff';
            setTimeout(() => {
                targetElement.style.backgroundColor = '';
            }, 3000);

            // 清空搜索框
            searchInput.value = '';
        } else {
            alert(`未找到包含「${keyword}」的内容，请尝试其他关键词！`);
        }
    }

    // 绑定搜索事件
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', () => {
        searchAndJump(searchInput.value);
    });

    // 回车键触发搜索
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchAndJump(searchInput.value);
        }
    });

    // 3. 页面滚动时，同步侧边栏菜单高亮
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.content-card, header#home');
        let currentSectionId = 'home';
        
        // 找到当前可视区域的模块
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSectionId = section.id;
            }
        });

        // 更新菜单高亮
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });
});