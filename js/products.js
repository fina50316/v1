
// products.js
// 商品頁面篩選功能

(() => {

    // 商品分類名稱
    const categoryNames = {
        "city-tour": "城市觀光與導覽",
        "water-activities": "遊船與水上活動",
        "adventure": "極限運動與冒險",
        "nature": "自然生態與動物",
        "culture": "文化歷史與博物館",
        "day-tour": "一日遊與跨城市行程",
        "transport": "交通票券"
    };

    // 取得 HTML 元素
    const title = document.getElementById("productTitle");
    const products = document.querySelectorAll(".product-item");

    const cityFilter = document.getElementById("cityFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    if (!title || !cityFilter || !categoryFilter) return;


    // 商品篩選
    function filterProducts() {

        const city = cityFilter.value;
        const category = categoryFilter.value;

        products.forEach(product => {

            const matchCity =
                city === "all" ||
                product.dataset.city === city;

            const matchCategory =
                category === "all" ||
                product.dataset.category === category;

            product.style.display =
                matchCity && matchCategory ? "" : "none";

        });

    }


    // 更新分類
    function changeCategory(category) {

        if (category === "all") {

            title.textContent = "全部旅遊商品";

        } else {

            if (!categoryNames[category]) {
                category = "city-tour";
            }

            title.textContent = categoryNames[category];

        }

        categoryFilter.value = category;

        filterProducts();

    }


    // 讀取網址參數
    function getCategoryFromUrl() {

        return new URLSearchParams(window.location.search)
            .get("category") || "city-tour";

    }


    // 頁面第一次載入
    changeCategory(getCategoryFromUrl());


    // 點擊導覽列商品分類
    document.querySelectorAll(
        'a[href*="products.html?category="]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const url = new URL(link.href);

            if (url.origin !== window.location.origin) return;

            event.preventDefault();

            changeCategory(
                url.searchParams.get("category")
            );

            history.pushState(
                {},
                "",
                url.pathname + url.search
            );

        });

    });


    // 城市篩選
    cityFilter.addEventListener("change", filterProducts);


    // 商品分類篩選
    categoryFilter.addEventListener("change", () => {

        const category = categoryFilter.value;

        changeCategory(category);

        const url = new URL(window.location.href);

        if (category === "all") {
            url.searchParams.delete("category");
        } else {
            url.searchParams.set("category", category);
        }

        history.pushState(
            {},
            "",
            url.pathname + url.search
        );

    });


    // 瀏覽器上一頁、下一頁
    window.addEventListener("popstate", () => {
        changeCategory(getCategoryFromUrl());
    });

})();
