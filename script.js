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

document.querySelectorAll(".page-title-animated").forEach((title) => {
    const titleText = title.textContent;
    let letterIndex = 0;

    title.setAttribute("aria-label", titleText);
    title.textContent = "";

    titleText.split(/(\s+)/).forEach((part) => {
        if (/\s+/.test(part)) {
            title.append(part);
            return;
        }

        const word = document.createElement("span");
        word.className = "title-word";
        word.setAttribute("aria-hidden", "true");

        Array.from(part).forEach((character) => {
            const letter = document.createElement("span");
            letter.className = "title-letter";
            letter.textContent = character;
            letter.style.animationDelay = `${letterIndex * 0.05}s`;
            word.append(letter);
            letterIndex += 1;
        });

        title.append(word);
    });
});

const homeSections = document.querySelectorAll(".home-section");

if (homeSections.length) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });

    homeSections.forEach((section) => sectionObserver.observe(section));
}

const boardDetails = document.querySelector("#board-details");
const boardDetailsTitle = document.querySelector("#board-details-title");
const boardDetailsBrand = document.querySelector("#board-details-brand");
const boardDetailsDescription = document.querySelector("#board-details-description");
const boardDetailsImage = document.querySelector("#board-details-image");
const boardDetailsClose = document.querySelector(".board-details-close");
const boardDetailsBackdrop = document.querySelector(".board-details-backdrop");
let selectedBoard = null;

const closeBoardDetails = () => {
    if (!boardDetails) {
        return;
    }

    boardDetails.classList.remove("is-open");
    boardDetails.setAttribute("aria-hidden", "true");
    selectedBoard?.setAttribute("aria-expanded", "false");
    selectedBoard?.focus();
    selectedBoard = null;
};

const openBoardDetails = (card) => {
    if (!boardDetails) {
        return;
    }

    selectedBoard?.setAttribute("aria-expanded", "false");
    selectedBoard = card;
    const cardImage = card.querySelector(".board-card-image");
    boardDetailsImage.src = cardImage.src;
    boardDetailsImage.alt = cardImage.alt;
    boardDetailsTitle.textContent = card.querySelector("h3").textContent;
    boardDetailsBrand.textContent = card.querySelector(".board-card-info p").textContent;
    boardDetailsDescription.textContent = card.dataset.description;
    card.setAttribute("aria-expanded", "true");
    boardDetails.classList.add("is-open");
    boardDetails.setAttribute("aria-hidden", "false");
    boardDetailsClose.focus();
};

document.querySelectorAll(".board-card").forEach((card) => {
    card.addEventListener("click", () => openBoardDetails(card));
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openBoardDetails(card);
        }
    });
});

boardDetailsClose?.addEventListener("click", closeBoardDetails);
boardDetailsBackdrop?.addEventListener("click", closeBoardDetails);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && boardDetails?.classList.contains("is-open")) {
        closeBoardDetails();
    }
});