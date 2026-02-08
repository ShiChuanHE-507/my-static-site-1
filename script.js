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