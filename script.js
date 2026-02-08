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