const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuIcon = menuToggle.querySelector("i");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdown = document.querySelector(".dropdown");
const heroTitle = document.querySelector("#hero-title");
const homeCopy = document.querySelector(".home-copy");

menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("active");
    menuIcon.classList.toggle("fa-bars", !isOpen);
    menuIcon.classList.toggle("fa-xmark", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
});

dropdownToggle.addEventListener("click", (event) => {
    event.preventDefault();
    const isOpen = dropdown.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", isOpen);
});

if (heroTitle && homeCopy) {
    const titleObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            heroTitle.classList.add("hero-title-visible");
            titleObserver.disconnect();
        }
    }, { threshold: [0, 0.25] });

    titleObserver.observe(homeCopy);
}