
// attractions.js
// 景點頁面城市篩選

(() => {

    const cityNames = {
        Queenstown: "皇后鎮",
        Christchurch: "基督城",
        Dunedin: "但尼丁",
        TeAnau: "蒂阿瑙",
        "Te-Anau": "蒂阿瑙",
        Akaroa: "阿卡羅阿",
        Auckland: "奧克蘭",
        Wellington: "威靈頓",
        Rotorua: "羅吐魯阿",
        Taupo: "陶波",
        Matamata: "瑪塔瑪塔"
    };

    const title = document.getElementById("attractionTitle");

    const cards = document.querySelectorAll(
        ".attraction-item[data-city]"
    );


    // 城市篩選
    function filterCity(city) {

        // 統一蒂阿瑙名稱
        if (city === "Te-Anau") {
            city = "TeAnau";
        }

        // 無效城市預設皇后鎮
        if (!cityNames[city]) {
            city = "Queenstown";
        }

        // 更新標題
        if (title) {
            title.textContent = `探索${cityNames[city]}`;
        }

        // 顯示符合城市的景點
        cards.forEach(card => {
            card.style.display =
                card.dataset.city === city ? "" : "none";
        });

    }


    // 取得網址中的城市參數
    function getCityFromUrl() {
        return new URLSearchParams(window.location.search)
            .get("city") || "Queenstown";
    }


    // 頁面第一次載入
    filterCity(getCityFromUrl());


    // 點擊城市連結
    document.querySelectorAll(
        'a[href*="attractions.html?city="]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const url = new URL(link.href);

            // 只處理目前網站的城市連結
            if (url.origin !== window.location.origin) return;

            event.preventDefault();

            filterCity(url.searchParams.get("city"));

            history.pushState({}, "", url.pathname + url.search);

        });

    });


    // 瀏覽器上一頁、下一頁
    window.addEventListener("popstate", () => {
        filterCity(getCityFromUrl());
    });

})();
