
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const yearElement = document.getElementById("year");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });
}

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
