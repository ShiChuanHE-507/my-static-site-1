// 等待页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取按钮和输入/输出元素
    const convertBtn = document.getElementById('convertBtn');
    const inputText = document.getElementById('inputText');
    const resultBox = document.getElementById('result');

    // 给按钮添加点击事件
    convertBtn.addEventListener('click', function() {
        // 获取输入的文本
        const text = inputText.value.trim();
        // 判断是否为空
        if (text === '') {
            resultBox.textContent = '请输入要转换的文本！';
            return;
        }
        // 转为大写并展示结果
        resultBox.textContent = text.toUpperCase();
    });
});

// 动态目录高亮逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有目录链接和对应的锚点元素
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('main h2');

    // 监听页面滚动事件
    window.addEventListener('scroll', function() {
        let current = '';
        // 遍历所有章节，判断当前视口在哪个章节
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // 当页面滚动到章节顶部下方100px时，标记为当前章节
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        // 给当前章节的目录链接添加高亮样式
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});