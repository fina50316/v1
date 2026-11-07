
// main.js
// 全網站共用功能

document.addEventListener("DOMContentLoaded", () => {

    // 導覽列捲動時固定在頂端
    const navbar = document.querySelector(".navbar");

    function updateNavbar() {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("sticky-top");
        } else {
            navbar.classList.remove("sticky-top");
        }
    }

    window.addEventListener("scroll", updateNavbar);
    updateNavbar();


    // 回到頂端按鈕
    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {

        function updateBackToTop() {
            backToTop.style.display =
                window.scrollY > 100 ? "block" : "none";
        }

        window.addEventListener("scroll", updateBackToTop);
        updateBackToTop();

        backToTop.addEventListener("click", event => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

    }

});
