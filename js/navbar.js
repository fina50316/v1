// 全站導覽列：比對目前頁面，並高亮下拉選單所屬主項目。
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".navbar-nav > a.nav-link, .navbar-nav > .dropdown").forEach(item => {
    const link = item.matches("a.nav-link") ? item : item.querySelector(":scope > a.nav-link");
    if (!link) return;
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const targetPage = new URL(href, location.href).pathname.split("/").pop().toLowerCase();
    if (targetPage === currentPage) link.classList.add("active");
  });
});
