// KIWI TRAILS：留言表單、會員展示介面與購物車。
document.addEventListener("DOMContentLoaded", () => {
  const messageForm = document.getElementById("messageForm");
  if (messageForm) messageForm.addEventListener("submit", event => {
    event.preventDefault(); if (!messageForm.reportValidity()) return;
    const data = Object.fromEntries(new FormData(messageForm).entries());
    const saved = JSON.parse(localStorage.getItem("kiwiDemoMessages") || "[]");
    saved.push({...data, createdAt:new Date().toISOString()});
    localStorage.setItem("kiwiDemoMessages", JSON.stringify(saved));
    document.getElementById("messageFeedback").textContent = "留言已暫存在此瀏覽器，尚未傳送到網站資料庫。";
    messageForm.reset();
  });

  document.querySelectorAll("[data-member-tab]").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll("[data-member-tab]").forEach(x => x.classList.toggle("active", x === tab));
    const register = tab.dataset.memberTab === "register";
    document.getElementById("loginForm").hidden = register;
    document.getElementById("registerForm").hidden = !register;
  }));
  const login = document.getElementById("loginForm");
  if (login) login.addEventListener("submit", e => {
    e.preventDefault(); if (login.reportValidity()) document.getElementById("loginFeedback").textContent = "格式正確；展示版尚未連接會員資料庫，因此不會執行真正登入。";
  });
  const register = document.getElementById("registerForm");
  if (register) register.addEventListener("submit", e => {
    e.preventDefault(); if (register.reportValidity()) document.getElementById("registerFeedback").textContent = "格式正確；展示版不會建立帳號或儲存密碼。";
  });

  const cartList = document.getElementById("cartList");
  if (cartList) {
    const readCart = () => { try { return JSON.parse(localStorage.getItem("kiwiCart") || "[]"); } catch { return []; } };
    const safe = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const money = n => "NT$ " + Number(n || 0).toLocaleString("zh-TW");
    const render = () => {
      const cart = readCart();
      cartList.innerHTML = cart.length ? cart.map((item,i) => `<article class="cart-row"><img src="${safe(item.image || 'img/about.jpg')}" alt=""><div><h4>${safe(item.name || '旅遊商品')}</h4><p>${safe(item.city || '')} ・ 數量 ${Number(item.quantity || 1)}</p>${item.experienceDate ? `<p>體驗日期：${safe(item.experienceDate)}</p>` : ""}<button type="button" data-remove-cart="${i}">移除此商品</button></div><strong class="cart-price">${money(Number(item.price || 0)*Number(item.quantity || 1))}</strong></article>`).join("") : '<p class="empty-state">購物車目前是空的，先去探索旅遊商品吧！</p>';
      const total = cart.reduce((sum,x) => sum + Number(x.price || 0)*Number(x.quantity || 1), 0);
      document.getElementById("cartSubtotal").textContent = money(total);
      document.getElementById("cartTotal").textContent = money(total);
    };
    cartList.addEventListener("click", e => {
      const btn = e.target.closest("[data-remove-cart]"); if (!btn) return;
      const cart = readCart(); cart.splice(Number(btn.dataset.removeCart),1);
      localStorage.setItem("kiwiCart",JSON.stringify(cart)); render();
    });
    document.getElementById("clearCartBtn").addEventListener("click", () => { localStorage.removeItem("kiwiCart"); render(); });
    document.getElementById("demoCheckoutBtn").addEventListener("click", () => {
      const cart = readCart(), feedback = document.getElementById("cartFeedback");
      if (!cart.length) { feedback.textContent = "購物車目前沒有商品。"; return; }
      const orders = JSON.parse(localStorage.getItem("kiwiDemoOrders") || "[]");
      orders.push({orderNo:"DEMO-"+Date.now(),items:cart,createdAt:new Date().toISOString()});
      localStorage.setItem("kiwiDemoOrders",JSON.stringify(orders)); localStorage.removeItem("kiwiCart");
      feedback.textContent = "展示訂單已建立並暫存在此瀏覽器，沒有進行付款或實際預約。"; render();
    });
    render();
  }
});
