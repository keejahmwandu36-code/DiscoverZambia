
document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("zambiaMap");

    // Only run on the map page.
    if (!mapElement) return;

    const listElement = document.getElementById("destinationList");
    const searchInput = document.getElementById("mapSearch");
    const resultCount = document.getElementById("mapResultCount");
    const filterButtons = document.querySelectorAll(".map-filter");

    if (typeof L === "undefined") {
        listElement.textContent =
            "The map library could not load. Check your internet connection.";
        return;
    }

    // Approximate coordinates for the destinations.
    const destinations = [
        {
            name: "Victoria Falls",
            location: "Livingstone, Southern Province",
            lat: -17.9243,
            lng: 25.8572,
            category: ["nature", "water"],
            description: "Experience the spectacular waterfall on the Zambezi River.",
            link: "attractions.html"
        },
        {
            name: "South Luangwa National Park",
            location: "Eastern Province",
            lat: -13.0000,
            lng: 31.5000,
            category: ["wildlife", "nature"],
            description: "Discover wildlife, guided safaris and remarkable river habitats.",
            link: "attractions.html"
        },
        {
            name: "Lower Zambezi National Park",
            location: "Along the Zambezi River",
            lat: -15.6000,
            lng: 29.3500,
            category: ["wildlife", "nature", "water"],
            description: "Explore river scenery, wildlife and outdoor adventures.",
            link: "attractions.html"
        },
        {
            name: "Kafue National Park",
            location: "Western and Central Zambia",
            lat: -15.5000,
            lng: 25.8000,
            category: ["wildlife", "nature"],
            description: "Explore extensive wilderness, wildlife and varied habitats.",
            link: "attractions.html"
        },
        {
            name: "Lake Kariba",
            location: "Siavonga, Southern Province",
            lat: -16.5333,
            lng: 28.7000,
            category: ["water", "nature"],
            description: "Enjoy lakeside scenery, boating and fishing opportunities.",
            link: "attractions.html"
        },
        {
            name: "Shiwa Ng'andu",
            location: "Muchinga Province",
            lat: -11.2000,
            lng: 31.7500,
            category: ["history", "nature"],
            description: "Discover a historic estate and its distinctive architecture.",
            link: "attractions.html"
        },
        {
            name: "Lusaka National Museum",
            location: "Lusaka Province",
            lat: -15.4167,
            lng: 28.2833,
            category: ["history", "culture"],
            description: "Explore exhibitions relating to Zambia's history and culture.",
            link: "culture.html"
        },
        {
            name: "Kuomboka Cultural Ceremony",
            location: "Western Province",
            lat: -15.0000,
            lng: 22.6667,
            category: ["culture"],
            description: "Learn about the Lozi people's celebrated traditional ceremony.",
            link: "culture.html"
        },
        {
            name: "Nc'wala Cultural Ceremony",
            location: "Eastern Province",
            lat: -13.6500,
            lng: 32.6500,
            category: ["culture"],
            description: "Discover a traditional Ngoni harvest celebration.",
            link: "culture.html"
        }
    ];

    const map = L.map("zambiaMap").setView([-13.5, 28.5], 5.5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    const markerLayer = L.featureGroup().addTo(map);
    const markers = new Map();

    function createPopup(place) {
        const popup = document.createElement("div");
        popup.className = "map-popup";

        const title = document.createElement("h3");
        title.textContent = place.name;

        const location = document.createElement("p");
        location.textContent = place.location;

        const description = document.createElement("p");
        description.textContent = place.description;

        const link = document.createElement("a");
        link.href = place.link;
        link.textContent = "Explore more";
        link.className = "map-popup-link";

        popup.append(title, location, description, link);
        return popup;
    }

    destinations.forEach((place) => {
        const marker = L.marker([place.lat, place.lng])
            .bindPopup(createPopup(place));

        markers.set(place.name, marker);
    });

    let activeCategory = "all";

    function renderDestinations() {
        const query = (searchInput.value || "").trim().toLowerCase();

        const filtered = destinations.filter((place) => {
            const matchesCategory =
                activeCategory === "all" ||
                place.category.includes(activeCategory);

            const searchText =
                `${place.name} ${place.location} ${place.description} ${place.category.join(" ")}`
                    .toLowerCase();

            return matchesCategory && searchText.includes(query);
        });

        markerLayer.clearLayers();
        listElement.replaceChildren();

        filtered.forEach((place) => {
            const marker = markers.get(place.name);
            marker.addTo(markerLayer);

            const item = document.createElement("button");
            item.type = "button";
            item.className = "destination-item";

            const title = document.createElement("strong");
            title.textContent = place.name;

            const location = document.createElement("span");
            location.textContent = place.location;

            const category = document.createElement("small");
            category.textContent = place.category
                .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
                .join(" · ");

            item.append(title, location, category);

            item.addEventListener("click", () => {
                map.flyTo([place.lat, place.lng], 9, {
                    duration: 1
                });

                marker.openPopup();
            });

            listElement.appendChild(item);
        });

        resultCount.textContent =
            `Showing ${filtered.length} of ${destinations.length} destinations`;

        if (filtered.length === 0) {
            const empty = document.createElement("p");
            empty.className = "map-empty";
            empty.textContent = "No destinations found. Try another search.";
            listElement.appendChild(empty);
        }

        if (filtered.length > 0 && query === "" && activeCategory === "all") {
            map.setView([-13.5, 28.5], 5.5);
        } else if (filtered.length > 0) {
            map.fitBounds(markerLayer.getBounds(), {
                padding: [35, 35],
                maxZoom: 7
            });
        }
    }

    searchInput.addEventListener("input", renderDestinations);

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.category || "all";

            filterButtons.forEach((filter) => {
                const isActive = filter === button;

                filter.classList.toggle("active", isActive);
                filter.setAttribute("aria-pressed", String(isActive));
            });

            renderDestinations();
        });
    });

    renderDestinations();

    // Leaflet needs to recalculate its size after the page layout settles.
    setTimeout(() => map.invalidateSize(), 200);
});
