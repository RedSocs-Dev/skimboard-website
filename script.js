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
const boardDetailsPrice = document.querySelector("#board-details-price");
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
    boardDetailsPrice.textContent = card.dataset.price || "";
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

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const cards = Array.from(carousel.querySelectorAll(".board-card"));
    const previousButton = carousel.querySelector(".carousel-button-previous");
    const nextButton = carousel.querySelector(".carousel-button-next");
    let activeIndex = 0;

    const showCard = (index) => {
        activeIndex = (index + cards.length) % cards.length;
        cards.forEach((card, cardIndex) => {
            card.classList.toggle("is-carousel-active", cardIndex === activeIndex);
        });
    };

    previousButton?.addEventListener("click", () => showCard(activeIndex - 1));
    nextButton?.addEventListener("click", () => showCard(activeIndex + 1));
    showCard(activeIndex);
});

boardDetailsClose?.addEventListener("click", closeBoardDetails);
boardDetailsBackdrop?.addEventListener("click", closeBoardDetails);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && boardDetails?.classList.contains("is-open")) {
        closeBoardDetails();
    }
});

// ====================
// LEAFLET - SPOT BALI
// ====================

const mapContainer = document.getElementById("map");

if (mapContainer && typeof L !== "undefined") {
    const page = window.location.pathname.toLowerCase();
    const configs = page.includes("france") ? { center: [45.0, -1.35], zoom: 7, spots: [["Plage de la Courance", 47.25, -2.28, "Spot réputé de Saint-Marc-sur-Mer : shorebreak idéal pour le skimboard, avec rochers à surveiller."], ["Biscarrosse", 44.39, -1.17, "Grande plage landaise, adaptée au flatland à marée descendante."], ["Hossegor", 43.66, -1.44, "Beach-break très puissant et célèbre, réservé aux skimmers confirmés."], ["Lacanau", 44.98, -1.20, "Bancs de sable variables : repère une zone dégagée avant de lancer."]] }
        : page.includes("etats-unis") ? { center: [34.1, -115.0], zoom: 5, spots: [["Victoria Beach", 33.51, -117.76, "Spot historique de Laguna Beach, apprécié pour ses vagues proches du bord."], ["Aliso Beach", 33.51, -117.75, "Spot du championnat The Vic, l’un des rendez-vous majeurs du skimboard."], ["Dewey Beach", 38.69, -75.07, "Lieu du championnat amateur du monde de skimboard sur la côte Est."], ["Vilano Beach", 29.92, -81.30, "Spot majeur de Floride et étape du Florida Pro/Am."]] }
        : page.includes("hawai") ? { center: [21.38, -157.85], zoom: 9, spots: [["Waimānalo Beach", 21.34, -157.71, "Longue plage de sable d’Oahu, intéressante quand la mer reste petite."], ["Sandy Beach", 21.28, -157.67, "Shorebreak très puissant et régulier : spot spectaculaire mais dangereux."], ["Makapuʻu Beach", 21.31, -157.65, "Plage de bodyboard et shorebreak parfois praticable, à observer avec prudence."], ["Hāpuna Beach", 19.99, -155.82, "Grande plage de sable de Big Island où le skimboard est régulièrement pratiqué."]] }
        : { center: [-8.65, 115.2167], zoom: 10, spots: [["Kuta Beach", -8.7184, 115.1686, "Grande plage de la côte sud, idéale pour repérer de petits shorebreaks."], ["Sanur Beach", -8.6932, 115.2634, "Lagon et sable humide propices au flatland au lever du jour."], ["Nusa Dua", -8.8112, 115.2311, "Baies plus abritées pour une session tropicale et progressive."]] };
    const map = L.map("map").setView(configs.center, configs.zoom);

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    const spotImages = {
        "Plage de la Courance": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
        "Biscarrosse": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
        "Hossegor": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=700&q=80",
        "Lacanau": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=700&q=80",
        "Victoria Beach": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=700&q=80",
        "Aliso Beach": "https://www.visitlagunabeach.com/wp-content/uploads/2024/03/54705e70-c13a-469a-b28f-e3757e9452b3.jpg",
        "Dewey Beach": "https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/delaware/Dewey_Beach_Skimboarding_Credit_VisitDelaware_com_2__bc806a3c-f4ec-4d3d-bacd-6e7ab04a6e9b.jpg",
        "Vilano Beach": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
        "Waimānalo Beach": "https://u.realgeeks.media/hawaiihomelistings/blog/Waimanalo_Beach.jpg",
        "Sandy Beach": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80",
        "Makapuʻu Beach": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80",
        "Hāpuna Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
        "Kuta Beach": "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/42000/42223-Kuta-Beach.jpg"
    };
    // Compléments issus des listes de spots et des destinations citées dans Wikipédia.
    if (page.includes("france")) configs.spots.push(
        ["Bonne Source", 47.25, -2.34, "Plage de Pornichet connue pour ses longues zones de sable humide, surtout à marée basse."],
        ["Cap-Ferret", 44.65, -1.25, "La presqu’île offre plusieurs bancs de sable pour le flatland selon la marée."],
        ["Mimizan", 44.20, -1.29, "Plage landaise exposée : privilégie les petites conditions et une zone surveillée."],
        ["Biarritz", 43.48, -1.56, "Les plages basques peuvent former un shorebreak rapide ; niveau intermédiaire à confirmé."],
        ["Île d’Oléron", 45.92, -1.31, "De grandes plages atlantiques où le sable humide permet de pratiquer le flatland."]
    );
    if (page.includes("etats-unis")) configs.spots.push(
        ["Tenth Street", 33.51, -117.76, "Un des hot spots historiques de Laguna Beach, sur la côte californienne."],
        ["West Street", 33.51, -117.77, "Spot de Laguna apprécié pour ses vagues proches du rivage."],
        ["Treasure Island", 33.51, -117.75, "Crique de Laguna où le skimboard est autorisé dans certaines zones."],
        ["Thalia Street", 33.54, -117.79, "Plage locale de Laguna avec shorebreak variable selon la houle."],
        ["Vero Beach", 27.64, -80.36, "Spot de Floride cité parmi les grands rendez-vous du skimboard de la côte Est."],
        ["Crescent Bay", 33.54, -117.80, "Autre plage emblématique de Laguna, adaptée aux skimmers expérimentés."],
        ["Sarasota", 27.34, -82.53, "Les plages de la côte ouest de Floride offrent parfois de belles sections de sable."]
    );
    if (page.includes("bali")) configs.spots.push(
        ["Seminyak", -8.69, 115.16, "Longue plage de la côte sud, intéressante à marée basse quand le sable est bien lisse."],
        ["Legian", -8.70, 115.17, "Dans la continuité de Kuta, avec de larges espaces pour les débutants."],
        ["Jimbaran", -8.78, 115.16, "Baie plus abritée pour travailler les bases dans une eau chaude."],
        ["Echo Beach", -8.65, 115.13, "Spot de la côte ouest à réserver aux pratiquants capables de lire la houle."],
        ["Sanur Mertasari", -8.71, 115.26, "Zone de sable humide et peu profonde, adaptée au flatland."]
    );
    configs.spots.forEach(([name, lat, lng, description]) => {
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<div class="spot-popup"><img src="${spotImages[name] || spotImages.Biscarrosse}" alt="${name}"><strong>${name}</strong><p>${description}</p><small>Vérifie la marée, la météo et les consignes locales avant chaque session.</small></div>`);
    });
}
