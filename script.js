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
    const configs = page.includes("france") ? { center: [45.0, -1.35], zoom: 7, spots: [["Plage de la Courance", 47.2390, -2.2707, "Spot réputé de Saint-Marc-sur-Mer : shorebreak idéal pour le skimboard, avec rochers à surveiller."], ["Biscarrosse", 44.4395, -1.2508, "Grande plage landaise, adaptée au flatland à marée descendante."], ["Hossegor", 43.6716, -1.4435, "Beach-break très puissant et célèbre, réservé aux skimmers confirmés."], ["Lacanau", 45.0007, -1.2015, "Bancs de sable variables : repère une zone dégagée avant de lancer."]] }
        : page.includes("etats-unis") ? { center: [34.1, -115.0], zoom: 5, spots: [["Victoria Beach", 33.5217, -117.7617, "Spot historique de Laguna Beach, apprécié pour ses vagues proches du bord."], ["Aliso Beach", 33.5105, -117.7545, "Spot du championnat The Vic, l’un des rendez-vous majeurs du skimboard."], ["Dewey Beach", 38.6938, -75.0743, "Lieu du championnat amateur du monde de skimboard sur la côte Est."], ["Vilano Beach", 29.9170, -81.2955, "Spot majeur de Floride et étape du Florida Pro/Am."]] }
        : page.includes("hawai") ? { center: [21.38, -157.85], zoom: 9, spots: [["Waimānalo Beach", 21.3346, -157.6951, "Longue plage de sable d’Oahu, intéressante quand la mer reste petite."], ["Sandy Beach", 21.2858, -157.6735, "Shorebreak très puissant et régulier : spot spectaculaire mais dangereux."], ["Makapuʻu Beach", 21.3095, -157.6505, "Plage de bodyboard et shorebreak parfois praticable, à observer avec prudence."], ["Hāpuna Beach", 19.9954, -155.8278, "Grande plage de sable de Big Island où le skimboard est régulièrement pratiqué."]] }
        : { center: [-8.65, 115.2167], zoom: 10, spots: [["Kuta Beach", -8.7193, 115.1686, "Grande plage de la côte sud, idéale pour repérer de petits shorebreaks."], ["Sanur Beach", -8.6895, 115.2630, "Lagon et sable humide propices au flatland au lever du jour."], ["Nusa Dua", -8.8022, 115.2290, "Baies plus abritées pour une session tropicale et progressive."]] };
    const map = L.map("map").setView(configs.center, configs.zoom);

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    const spotAddresses = {
        "Plage de la Courance": "Plage de la Courance, 44600 Saint-Nazaire, France",
        "Biscarrosse": "Plage Centrale, 40600 Biscarrosse, France",
        "Hossegor": "Plage Centrale, 40150 Soorts-Hossegor, France",
        "Lacanau": "Plage Centrale, 33680 Lacanau, France",
        "Bonne Source": "Plage de Bonne Source, 44380 Pornichet, France",
        "Cap-Ferret": "Plage de l'Horizon, 33970 Lège-Cap-Ferret, France",
        "Mimizan": "Plage Sud, 40200 Mimizan, France",
        "Biarritz": "Grande Plage, 64200 Biarritz, France",
        "Île d’Oléron": "Plage des Huttes, 17650 Saint-Denis-d'Oléron, France",
        "Victoria Beach": "Victoria Beach, 2713 Victoria Drive, Laguna Beach, CA, USA",
        "Aliso Beach": "Aliso Beach, 31130 South Pacific Coast Highway, Laguna Beach, CA, USA",
        "Dewey Beach": "Dewey Beach, Delaware, USA",
        "Vilano Beach": "Vilano Beach, Saint Augustine, FL, USA",
        "Tenth Street": "10th Street Beach, Laguna Beach, CA, USA",
        "West Street": "West Street Beach, Laguna Beach, CA, USA",
        "Treasure Island": "Treasure Island Beach, Laguna Beach, CA, USA",
        "Thalia Street": "Thalia Street Beach, Laguna Beach, CA, USA",
        "Vero Beach": "Vero Beach, FL, USA",
        "Crescent Bay": "Crescent Bay Beach, Laguna Beach, CA, USA",
        "Sarasota": "Lido Key Beach, Sarasota, FL, USA",
        "Kuta Beach": "Kuta Beach, Kuta, Badung Regency, Bali, Indonesia",
        "Sanur Beach": "Sanur Beach, Sanur, Denpasar, Bali, Indonesia",
        "Nusa Dua": "Nusa Dua Beach, Benoa, Badung Regency, Bali, Indonesia",
        "Seminyak": "Seminyak Beach, Badung Regency, Bali, Indonesia",
        "Legian": "Legian Beach, Badung Regency, Bali, Indonesia",
        "Jimbaran": "Jimbaran Beach, Badung Regency, Bali, Indonesia",
        "Echo Beach": "Echo Beach, Canggu, Badung Regency, Bali, Indonesia",
        "Sanur Mertasari": "Mertasari Beach, Sanur, Denpasar, Bali, Indonesia",
        "Waimānalo Beach": "Waimanalo Beach Park, 41-741 Kalanianaʻole Highway, Waimanalo, HI, USA",
        "Sandy Beach": "Sandy Beach Park, 8801 Kalanianaʻole Highway, Honolulu, HI, USA",
        "Makapuʻu Beach": "Makapuʻu Beach Park, Waimanalo, HI, USA",
        "Hāpuna Beach": "Hāpuna Beach State Recreation Area, Waimea, HI, USA"
    };

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
        ["Bonne Source", 47.2685, -2.3420, "Plage de Pornichet connue pour ses longues zones de sable humide, surtout à marée basse."],
        ["Cap-Ferret", 44.6500, -1.2520, "La presqu’île offre plusieurs bancs de sable pour le flatland selon la marée."],
        ["Mimizan", 44.2132, -1.2970, "Plage landaise exposée : privilégie les petites conditions et une zone surveillée."],
        ["Biarritz", 43.4872, -1.5581, "Les plages basques peuvent former un shorebreak rapide ; niveau intermédiaire à confirmé."],
        ["Île d’Oléron", 46.0002, -1.3970, "De grandes plages atlantiques où le sable humide permet de pratiquer le flatland."]
    );
    if (page.includes("etats-unis")) configs.spots.push(
        ["Tenth Street", 33.5320, -117.7870, "Un des hot spots historiques de Laguna Beach, sur la côte californienne."],
        ["West Street", 33.5294, -117.7882, "Spot de Laguna apprécié pour ses vagues proches du rivage."],
        ["Treasure Island", 33.5081, -117.7520, "Crique de Laguna où le skimboard est autorisé dans certaines zones."],
        ["Thalia Street", 33.5385, -117.7906, "Plage locale de Laguna avec shorebreak variable selon la houle."],
        ["Vero Beach", 27.6480, -80.3564, "Spot de Floride cité parmi les grands rendez-vous du skimboard de la côte Est."],
        ["Crescent Bay", 33.5497, -117.7988, "Autre plage emblématique de Laguna, adaptée aux skimmers expérimentés."],
        ["Sarasota", 27.3107, -82.5740, "Les plages de la côte ouest de Floride offrent parfois de belles sections de sable."]
    );
    if (page.includes("bali")) configs.spots.push(
        ["Seminyak", -8.6901, 115.1590, "Longue plage de la côte sud, intéressante à marée basse quand le sable est bien lisse."],
        ["Legian", -8.7056, 115.1674, "Dans la continuité de Kuta, avec de larges espaces pour les débutants."],
        ["Jimbaran", -8.7805, 115.1595, "Baie plus abritée pour travailler les bases dans une eau chaude."],
        ["Echo Beach", -8.6512, 115.1297, "Spot de la côte ouest à réserver aux pratiquants capables de lire la houle."],
        ["Sanur Mertasari", -8.7113, 115.2629, "Zone de sable humide et peu profonde, adaptée au flatland."]
    );
    configs.spots.forEach(([name, lat, lng, description]) => {
        L.marker([lat, lng], { title: name, mapsAddress: spotAddresses[name] || name })
            .addTo(map)
            .bindPopup(`<div class="spot-popup"><img src="${spotImages[name] || spotImages.Biscarrosse}" alt="${name}"><strong>${name}</strong><p>${description}</p><small>Vérifie la marée, la météo et les consignes locales avant chaque session.</small></div>`);
    });

    map.on("popupopen", ({ popup }) => {
        const popupContent = popup.getElement()?.querySelector(".spot-popup");

        if (!popupContent || popupContent.querySelector(".spot-popup-map-link")) {
            return;
        }

        const { lat, lng } = popup.getLatLng();
        const mapAddress = popup._source?.options?.mapsAddress || lat + "," + lng;
        const mapLink = document.createElement("a");
        mapLink.className = "spot-popup-map-link";
        mapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapAddress);
        mapLink.target = "_blank";
        mapLink.rel = "noopener noreferrer";
        mapLink.textContent = "Voir l’itinéraire sur Google Maps";
        popupContent.querySelector("p")?.after(mapLink);
    });
}
