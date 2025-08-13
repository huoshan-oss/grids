// 移动端交互逻辑将在这里重新编写 

// 检测是否为移动设备
function isMobile() {
    console.log('Window width:', window.innerWidth);
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    // 如果是移动设备，添加mobile-view类
    if (isMobile()) {
        console.log('Is Mobile Device');
        document.documentElement.classList.add('mobile-view');
        document.body.classList.add('mobile-view');
        console.log('Body classes:', document.body.className);
    }
});

// 监听窗口大小变化
window.addEventListener('resize', function() {
    if (isMobile()) {
        document.documentElement.classList.add('mobile-view');
        document.body.classList.add('mobile-view');
    } else {
        document.documentElement.classList.remove('mobile-view');
        document.body.classList.remove('mobile-view');
    }
});

// 只在移动端执行
if (isMobile()) {
    // 定义页面路由映射
    const routes = {
        'recruit': 'recruit/index.html',
        'business': 'business/index.html',
        'partner': 'partner/index.html',
        'history': 'history/index.html',
        'education': 'education/index.html',
        'corporation': 'corporation/index.html',
        'optimize': 'optimize/index.html',
        'ai': 'ai/index.html',
        'salesforce': 'salesforce/index.html',
        'moreinfo': 'moreinfo/index.html',
        '5': '5/index.html',
        'alot': 'alot/index.html'
    };

    // 处理导航点击 - 直接跳转
    function handleNavClick(e) {
        // 阻止默认事件和冒泡
        e.preventDefault();
        e.stopPropagation();
        
        // 切换图片
        this.classList.add('active');
        
        // 获取导航类型
        const navType = this.dataset.nav || this.dataset.page || this.dataset.link;
        
        // 延迟跳转，让图片切换效果可见
        setTimeout(() => {
            // 如果有直接的链接地址，直接跳转
            if (this.dataset.link) {
                window.location.href = this.dataset.link;
                return;
            }
            
            // 使用路由映射跳转
            if (routes[navType]) {
                window.location.href = routes[navType];
            }
        }, 300); // 300ms延迟，与图片过渡时间一致
    }

    // 为所有导航元素添加点击事件
    const navItems = document.querySelectorAll('.grid-item, .nav-box.grid-style');
    navItems.forEach(item => {
        // 移除所有现有的点击事件
        const clone = item.cloneNode(true);
        item.parentNode.replaceChild(clone, item);
        // 添加新的点击事件
        clone.addEventListener('click', handleNavClick);
    });
}

// 添加或移除移动端类名
function updateViewClass() {
    if (isMobile()) {
        document.documentElement.classList.add('mobile-view');
    } else {
        document.documentElement.classList.remove('mobile-view');
    }
}

// 初始检测
updateViewClass();

// 监听窗口大小变化
window.addEventListener('resize', updateViewClass); 