
// home.js
// 首頁：南島／北島與商品分類切換

// 南島、北島切換
window.switchIsland = function (tabId, button) {
    const attractionSection = document.getElementById("attractions");

    if (!attractionSection) return;

    attractionSection.querySelectorAll(".tab-pane").forEach(tab => {
        tab.classList.remove("show", "active");
    });

    attractionSection.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    const target = document.getElementById(tabId);

    if (target && attractionSection.contains(target)) {
        target.classList.add("show", "active");
        button.classList.add("active");
    }
};


// 首頁商品分類切換
window.switchProduct = function (productId, button) {
    const productSection = document.getElementById("products");

    if (!productSection) return;

    productSection.querySelectorAll(".product-pane").forEach(pane => {
        pane.style.display = "none";
    });

    productSection.querySelectorAll(".product-tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    const target = document.getElementById(productId);

    if (target && productSection.contains(target)) {
        target.style.display = "block";
        button.classList.add("active");
    }
};
