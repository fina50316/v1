//navbar.js start

// 取得目前網頁名稱
const currentPage = window.location.pathname
    .split("/")
    .pop();

// 找出導覽列所有項目
const navItems = document.querySelectorAll(
    ".navbar-nav > .nav-link, .navbar-nav > .dropdown"
);

// 先移除所有 active
navItems.forEach(item => {
    item.classList.remove("active");

    const link = item.querySelector(":scope > .nav-link");

    if (link) {
        link.classList.remove("active");
    }
});

// 判斷目前所在頁面
navItems.forEach(item => {

    const link = item.matches(".nav-link")
        ? item
        : item.querySelector(":scope > .nav-link");

    if (!link) return;

    const linkPage = new URL(link.href).pathname
        .split("/")
        .pop();

    if (linkPage === currentPage) {
        link.classList.add("active");
        item.classList.add("active");
    }
});

//navbar.js end