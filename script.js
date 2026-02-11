// 整合所有功能到一个 DOMContentLoaded 监听（避免冲突）
document.addEventListener('DOMContentLoaded', function() {
    // ===================== 1. 文本转换工具逻辑 =====================
    const convertBtn = document.getElementById('convertBtn');
    const inputText = document.getElementById('inputText');
    const resultBox = document.getElementById('result');

    if (convertBtn && inputText && resultBox) { // 防错：元素不存在时不执行
        convertBtn.addEventListener('click', function() {
            const text = inputText.value.trim();
            if (text === '') {
                resultBox.textContent = '请输入要转换的文本！';
                return;
            }
            resultBox.textContent = text.toUpperCase();
        });
    }

    // ===================== 2. 侧边栏菜单高亮逻辑（统一版） =====================
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems.length > 0) {
        // 点击菜单高亮
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // 滚动时同步菜单高亮
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('.content-card, header#home');
            let currentSectionId = 'home';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSectionId = section.id;
                }
            });

            menuItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ===================== 3. 平滑滚动（兼容版） =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===================== 4. 站内搜索核心逻辑 =====================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput && searchBtn) { // 防错
        // 定义需要搜索的内容模块
        function getSearchableContent() {
            const content = {};
            document.querySelectorAll('.content-card').forEach(card => {
                const cardId = card.id;
                const cardTitle = card.querySelector('h2')?.textContent || '';
                const cardText = card.querySelector('.copy-area')?.innerText || '';
                if (cardText) {
                    content[cardId] = {
                        title: cardTitle,
                        text: cardText
                    };
                }
            });
            return content;
        }

        // 搜索执行函数
        function searchAndJump(keyword) {
            if (!keyword.trim()) {
                alert('请输入搜索关键词（如：SA2、蹲中拳、板边压制）！');
                return;
            }

            const content = getSearchableContent();
            let targetId = null;

            for (const [id, data] of Object.entries(content)) {
                const lowerText = data.text.toLowerCase();
                const lowerKeyword = keyword.toLowerCase();
                if (lowerText.includes(lowerKeyword)) {
                    targetId = id;
                    break;
                }
            }   

            if (targetId) {
                const targetElement = document.getElementById(targetId);
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                targetElement.style.backgroundColor = '#f0f8ff';
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                }, 3000);
                searchInput.value = '';

                // 同步菜单高亮
                menuItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${targetId}`) {
                        item.classList.add('active');
                    }
                });
            } else {
                alert(`未找到包含「${keyword}」的内容，请尝试其他关键词！`);
            }
        }

        // 绑定搜索事件
        searchBtn.addEventListener('click', () => {
            searchAndJump(searchInput.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                searchAndJump(searchInput.value);
            }
        });
    }

    // ===================== 5. 连段Tag筛选核心逻辑（修复版） =====================
    const filterBtn = document.getElementById('filterBtn');
    const resetBtn = document.getElementById('resetBtn');
    const comboList = document.getElementById('comboList');
    const checkboxes = document.querySelectorAll('.tag-checkbox input');
    const comboSections = document.querySelectorAll('.combo-section');

    // 只有元素都存在时才执行筛选逻辑（关键防错）
    if (filterBtn && resetBtn && comboList && checkboxes.length > 0 && comboSections.length > 0) {
        filterBtn.addEventListener('click', function() {
            comboList.innerHTML = '';

            // 获取选中的Tag（去重+去空格）
            const selectedTags = [];
            checkboxes.forEach(checkbox => {
                const tag = checkbox.value.trim();
                if (checkbox.checked && tag && !selectedTags.includes(tag)) {
                    selectedTags.push(tag);
                }
            });

            // 无选中Tag时提示
            if (selectedTags.length === 0) {
                comboList.innerHTML = '<li style="color: #777;">请至少选择一个Tag进行筛选</li>';
                return;
            }

            // 遍历所有连段，计算重合度
            const comboData = [];
            comboSections.forEach(combo => {
                // 防错：确保data-tags存在
                if (!combo.dataset.tags) return;
                
                const comboTags = combo.dataset.tags.split(',').map(tag => tag.trim());
                let matchCount = 0;
                
                // 计算匹配的Tag数量
                selectedTags.forEach(selectedTag => {
                    if (comboTags.includes(selectedTag)) {
                        matchCount++;
                    }
                });

                // 只保留有匹配的连段
                if (matchCount > 0) {
                    // 防错：确保标题元素存在
                    const titleElement = document.getElementById(`${combo.id}-title`);
                    const title = titleElement ? titleElement.innerText : `连段${combo.id}`;
                    
                    comboData.push({
                        id: combo.id,
                        title: title,
                        matchCount: matchCount,
                        matchedTags: comboTags.filter(tag => selectedTags.includes(tag))
                    });
                }
            });

            // 按重合度降序排序
            comboData.sort((a, b) => {
                if (b.matchCount !== a.matchCount) {
                    return b.matchCount - a.matchCount;
                }
                return a.id.localeCompare(b.id); // 稳定排序
            });

            // 生成结果
            if (comboData.length === 0) {
                comboList.innerHTML = `<li style="color: #777;">没有找到包含「${selectedTags.join('、')}」的连段</li>`;
            } else {
                comboData.forEach(combo => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <a href="#${combo.id}">${combo.title}</a>
                        <span class="tag-count">（匹配${combo.matchCount}个Tag：${combo.matchedTags.join('、')}）</span>
                    `;
                    comboList.appendChild(li);
                });
            }
        });

        // 重置筛选
        resetBtn.addEventListener('click', function() {
            checkboxes.forEach(checkbox => checkbox.checked = false);
            comboList.innerHTML = '';
        });

        // 点击结果跳转高亮
        comboList.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                const targetId = e.target.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    target.style.border = '2px solid #3498db';
                    setTimeout(() => target.style.border = '', 3000);
                }
            }
        });
    } else {
        // 调试提示：告诉哪里出问题了
        console.log('Tag筛选功能未初始化，原因：');
        console.log('filterBtn是否存在：', !!filterBtn);
        console.log('resetBtn是否存在：', !!resetBtn);
        console.log('comboList是否存在：', !!comboList);
        console.log('checkbox数量：', checkboxes.length);
        console.log('comboSections数量：', comboSections.length);
    }
});