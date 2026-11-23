// KIWI TRAILS：PHP/MySQL 會員、留言與展示訂單。
document.addEventListener("DOMContentLoaded", () => {
  const postForm = async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "操作失敗。");
    return result;
  };

  const messageForm = document.getElementById("messageForm");
  if (messageForm) messageForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!messageForm.reportValidity()) return;
    const feedback = document.getElementById("messageFeedback");
    const data = Object.fromEntries(new FormData(messageForm).entries());
    try {
      const result = await postForm("php/message_add.php", data);
      feedback.textContent = result.message;
      messageForm.reset();
    } catch (error) { feedback.textContent = error.message; }
  });

  document.querySelectorAll("[data-member-tab]").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll("[data-member-tab]").forEach(x => x.classList.toggle("active", x === tab));
    const register = tab.dataset.memberTab === "register";
    document.getElementById("loginForm").hidden = register;
    document.getElementById("registerForm").hidden = !register;
  }));

  const login = document.getElementById("loginForm");
  if (login) login.addEventListener("submit", async event => {
    event.preventDefault();
    if (!login.reportValidity()) return;
    const feedback = document.getElementById("loginFeedback");
    try {
      const result = await postForm("php/login.php", {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
      });
      feedback.textContent = result.message + "，你好，" + result.member.name + "！";
      login.reset();
    } catch (error) { feedback.textContent = error.message; }
  });

  const register = document.getElementById("registerForm");
  if (register) register.addEventListener("submit", async event => {
    event.preventDefault();
    if (!register.reportValidity()) return;
    const feedback = document.getElementById("registerFeedback");
    try {
      const result = await postForm("php/register.php", {
        name: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value
      });
      feedback.textContent = result.message;
      register.reset();
    } catch (error) { feedback.textContent = error.message; }
  });

  const logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", async () => {
    const feedback = document.getElementById("loginFeedback") || document.getElementById("registerFeedback");
    try {
      const response = await fetch("php/logout.php", { credentials: "same-origin" });
      const result = await response.json();
      if (feedback) feedback.textContent = result.message;
    } catch (error) { if (feedback) feedback.textContent = "登出失敗，請稍後再試。"; }
  });

  const cartList = document.getElementById("cartList");
  if (!cartList) return;
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem("kiwiCart") || "[]"); }
    catch { return []; }
  };
  const safe = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money = n => "NT$ " + Number(n || 0).toLocaleString("zh-TW");
  const render = () => {
    const cart = readCart();
    cartList.innerHTML = cart.length ? cart.map((item,i) =>
      `<article class="cart-row"><img src="${safe(item.image || 'img/about.jpg')}" alt=""><div><h4>${safe(item.name || '旅遊商品')}</h4><p>${safe(item.city || '')} ・ 數量 ${Number(item.quantity || 1)}</p>${item.experienceDate ? `<p>體驗日期：${safe(item.experienceDate)}</p>` : ""}<button type="button" data-remove-cart="${i}">移除此商品</button></div><strong class="cart-price">${money(Number(item.price || 0)*Number(item.quantity || 1))}</strong></article>`
    ).join("") : '<p class="empty-state">購物車目前是空的，先去探索旅遊商品吧！</p>';
    const total = cart.reduce((sum,x) => sum + Number(x.price || 0)*Number(x.quantity || 1), 0);
    document.getElementById("cartSubtotal").textContent = money(total);
    document.getElementById("cartTotal").textContent = money(total);
  };
  cartList.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-cart]");
    if (!button) return;
    const cart = readCart(); cart.splice(Number(button.dataset.removeCart),1);
    localStorage.setItem("kiwiCart",JSON.stringify(cart)); render();
  });
  document.getElementById("clearCartBtn")?.addEventListener("click", () => {
    localStorage.removeItem("kiwiCart"); render();
  });
  document.getElementById("demoCheckoutBtn")?.addEventListener("click", async () => {
    const cart = readCart(), feedback = document.getElementById("cartFeedback");
    if (!cart.length) { feedback.textContent = "購物車目前沒有商品。"; return; }
    try {
      const result = await postForm("php/order_create.php", {items: cart});
      feedback.textContent = result.message + " 訂單編號：" + result.order_no;
      localStorage.removeItem("kiwiCart"); render();
    } catch (error) { feedback.textContent = error.message; }
  });
  render();
});
