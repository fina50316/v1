// favorites.js

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".favorite-btn").forEach(button => {
        button.addEventListener("click", () => {
            const icon = button.querySelector("i");

            if (!icon) return;

            const isActive = button.classList.toggle("active");

            icon.classList.toggle("far", !isActive);
            icon.classList.toggle("fas", isActive);
        });
    });
});