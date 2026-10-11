const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const yearElement = document.getElementById("year");

// Mobile navigation
if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}

// Footer year
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Attractions: search and category filters
const attractionGrid = document.getElementById("attractionGrid");
const attractionSearch = document.getElementById("attractionSearch");
const attractionFilters = document.querySelectorAll(".attraction-filter");
const resultCount = document.getElementById("attractionResultCount");
const noResults = document.getElementById("attractionNoResults");
const resetButton = document.getElementById("resetAttractionFilters");

if (attractionGrid) {
    const cards = Array.from(
        attractionGrid.querySelectorAll(".attraction-card")
    );

    let activeCategory = "all";

    function filterAttractions() {
        const searchTerm = (attractionSearch?.value || "")
            .trim()
            .toLowerCase();

        let visibleCount = 0;

        cards.forEach((card) => {
            const categories = (card.dataset.category || "").split(/\s+/);
            const searchableText =
                `${card.dataset.search || ""} ${card.textContent || ""}`
                    .toLowerCase();

            const matchesCategory =
                activeCategory === "all" ||
                categories.includes(activeCategory);

            const matchesSearch = searchableText.includes(searchTerm);
            const isVisible = matchesCategory && matchesSearch;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        if (resultCount) {
            resultCount.textContent =
                `Showing ${visibleCount} of ${cards.length} destinations`;
        }

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }
    }

    attractionSearch?.addEventListener("input", filterAttractions);

    attractionFilters.forEach((button) => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.filter || "all";

            attractionFilters.forEach((filterButton) => {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            filterAttractions();
        });
    });

    resetButton?.addEventListener("click", () => {
        if (attractionSearch) {
            attractionSearch.value = "";
        }

        activeCategory = "all";

        attractionFilters.forEach((button) => {
            const isActive = button.dataset.filter === "all";

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        filterAttractions();
    });

    filterAttractions();
}

// Expand and collapse destination details
document.querySelectorAll(".attraction-details-btn").forEach((button) => {
    const details = button.nextElementSibling;

    if (!details || !details.classList.contains("attraction-extra")) {
        return;
    }

    button.addEventListener("click", () => {
        const isExpanded =
            button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", String(!isExpanded));
        details.hidden = isExpanded;

        button.innerHTML = isExpanded
            ? 'Discover destination <span aria-hidden="true">+</span>'
            : 'Hide details <span aria-hidden="true">−</span>';
    });
});
