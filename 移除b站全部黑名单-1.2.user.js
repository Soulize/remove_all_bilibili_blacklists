// ==UserScript==
// @name         移除b站全部黑名单
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  点击批量移除按钮以移除陈睿的野爹
// @author       Soulize
// @match        https://account.bilibili.com/account/blacklist
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let clickCount = 0;

    function clickRemoveButtonsSequentially(buttons, index) {
        if (index >= buttons.length) {
            // 所有移除按钮已被点击，点击下一页按钮
            clickNextPageButton();
            return;
        }

        buttons[index].click();
        clickCount++;

        if (clickCount % 100 === 0) {
            // 每点击100次，等待600秒
            setTimeout(function() {
                clickCount = 0; // 重置点击计数
                clickRemoveButtonsSequentially(buttons, index + 1);
            }, 600000); // 600秒 = 600,000毫秒
        } else {
            setTimeout(function() {
                clickRemoveButtonsSequentially(buttons, index + 1);
            }, 200); // 200ms interval
        }
    }

    function startClicking() {
        // 获取所有 <span> 元素
        var spans = document.getElementsByTagName('span');

        // 过滤出符合条件的元素
        var removeButtons = [];
        for (var i = 0; i < spans.length; i++) {
            if (spans[i].classList.contains('black-btn') && spans[i].textContent.trim() === '移除') {
                removeButtons.push(spans[i]);
            }
        }

        // 依次点击这些按钮
        if (removeButtons.length > 0) {
            clickRemoveButtonsSequentially(removeButtons, 0);
        }
    }

    function clickNextPageButton() {
        var nextPageButton = document.querySelector('i.el-icon.el-icon-arrow-right');
        if (nextPageButton) {
            nextPageButton.click();
            // 等待页面加载后重新查找移除按钮
            setTimeout(startClicking, 200); // 等待0.2秒以确保页面完全加载
        }
    }

    function addButton() {
        // 创建一个新的按钮元素
        var button = document.createElement('button');
        button.innerHTML = '批量移除';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';

        // 添加按钮点击事件
        button.addEventListener('click', startClicking);

        // 将按钮添加到页面上
        document.body.appendChild(button);
    }

    // 等待页面加载完成后添加按钮
    window.addEventListener('load', addButton);
})();
