//attractions.js start
const cityNames = {
    Queenstown: "皇后鎮",
    Christchurch: "基督城",
    Dunedin: "但尼丁",
    TeAnau: "蒂阿瑙",
    Akaroa: "阿卡羅阿",
    Auckland: "奧克蘭",
    Wellington: "威靈頓",
    Rotorua: "羅吐魯阿",
    Taupo: "陶波",
    Matamata: "瑪塔瑪塔"
};

const title = document.getElementById("attractionTitle");
const cards = document.querySelectorAll(".attraction-item");

function filterCity(city) {

    // 沒有指定或城市名稱錯誤時，預設皇后鎮
    if (!cityNames[city]) {
        city = "Queenstown";
    }

    // 更新標題文字
    if (title) {
        title.textContent = `探索${cityNames[city]}`;
    }

    // 顯示所選城市的景點
    cards.forEach(card => {
        card.style.display =
            card.dataset.city === city ? "" : "none";
    });
}

// 讀取網址中的城市參數
const params = new URLSearchParams(window.location.search);
const initialCity = params.get("city") || "Queenstown";

// 首次載入頁面
filterCity(initialCity);

// 城市切換連結
document.querySelectorAll(
    'a[href*="attractions.html?city="]'
).forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const url = new URL(this.href);
        const city = url.searchParams.get("city");

        filterCity(city);

        // 更新網址，不重新載入頁面
        history.pushState({}, "", url);
    });
});

// 支援瀏覽器上一頁、下一頁
window.addEventListener("popstate", function() {
    const city = new URLSearchParams(window.location.search)
        .get("city") || "Queenstown";

    filterCity(city);
});

//attractions.js end