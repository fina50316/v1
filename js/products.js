//products.js start
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

// 商品篩選
function filterProducts() {

    const city = cityFilter.value;
    const category = categoryFilter.value;

    products.forEach(product => {

        const matchCity =
            city === "all" || product.dataset.city === city;

        const matchCategory =
            category === "all" ||
            product.dataset.category === category;

        product.style.display =
            matchCity && matchCategory ? "" : "none";
    });
}

// 更新商品分類標題
function changeCategory(category) {

    if (!categoryNames[category]) {
        category = "city-tour";
    }

    title.textContent = categoryNames[category];
    categoryFilter.value = category;

    filterProducts();
}

// 讀取網址分類
const params = new URLSearchParams(window.location.search);

const initialCategory =
    params.get("category") || "city-tour";

changeCategory(initialCategory);

// 點擊導覽列分類
document.querySelectorAll(
    'a[href*="products.html?category="]'
).forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const url = new URL(this.href);
        const category = url.searchParams.get("category");

        changeCategory(category);

        history.pushState({}, "", url);
    });
});

// 城市篩選
cityFilter.addEventListener("change", filterProducts);

// 分類篩選
categoryFilter.addEventListener("change", function() {

    const category = this.value;

    if (category === "all") {
        title.textContent = "全部旅遊商品";
    } else {
        title.textContent = categoryNames[category];
    }

    filterProducts();

    const url = new URL(window.location.href);

    if (category === "all") {
        url.searchParams.delete("category");
    } else {
        url.searchParams.set("category", category);
    }

    history.pushState({}, "", url);
});

// 瀏覽器上一頁、下一頁
window.addEventListener("popstate", function() {

    const category =
        new URLSearchParams(window.location.search)
        .get("category") || "city-tour";

    changeCategory(category);
});

//products.js end