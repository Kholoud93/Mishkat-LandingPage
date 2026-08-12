const THEME_KEY = "mishkat-theme";
const root = document.documentElement;

// =================================
// Theme
// =================================

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch (error) {
        return null;
    }
}

function getPreferredTheme() {
    const storedTheme = getStoredTheme();

    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";

    root.setAttribute("data-theme", nextTheme);

    try {
        localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
    }

    document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
        const isDark = nextTheme === "dark";

        if (toggle.matches("[aria-pressed]")) {
            toggle.setAttribute("aria-pressed", String(isDark));
        }

        toggle.setAttribute("data-theme-state", nextTheme);
    });
}

function toggleTheme() {
    const currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
}

function initTheme() {
    applyTheme(getPreferredTheme());

    document.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-theme-toggle]");

        if (!toggle) {
            return;
        }

        event.preventDefault();
        toggleTheme();
    });
}

applyTheme(getPreferredTheme());

// =================================
// Modal
// =================================

function getModal(id) {
    if (!id) {
        return null;
    }

    return document.querySelector(`[data-modal="${id}"], #${CSS.escape(id)}`);
}

function getOpenModals() {
    return Array.from(document.querySelectorAll(".modal.is-open"));
}

function syncModalBodyState() {
    document.body.classList.toggle("has-modal-open", getOpenModals().length > 0);
}

function openModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");

    const dialog = modal.querySelector(".modal-dialog");
    const focusTarget = modal.querySelector("[data-modal-autofocus]") || modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");

    if (dialog && !dialog.hasAttribute("tabindex")) {
        dialog.setAttribute("tabindex", "-1");
    }

    syncModalBodyState();

    window.requestAnimationFrame(() => {
        if (focusTarget) {
            focusTarget.focus();
            return;
        }

        if (dialog) {
            dialog.focus();
        }
    });
}

function closeModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("hidden", "");
    syncModalBodyState();
}

function closeTopModal() {
    const openModals = getOpenModals();
    const lastModal = openModals[openModals.length - 1];

    if (lastModal) {
        closeModal(lastModal);
        return true;
    }

    return false;
}

function initModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
        if (!modal.classList.contains("is-open")) {
            modal.setAttribute("hidden", "");
            modal.setAttribute("aria-hidden", "true");
        }
    });

    document.addEventListener("click", (event) => {
        const openTrigger = event.target.closest("[data-modal-open]");

        if (openTrigger) {
            event.preventDefault();
            openModal(getModal(openTrigger.getAttribute("data-modal-open")));
            return;
        }

        const closeTrigger = event.target.closest("[data-modal-close]");

        if (closeTrigger) {
            const modal = closeTrigger.closest(".modal");

            if (modal) {
                event.preventDefault();
                closeModal(modal);
            }

            return;
        }

        const overlay = event.target.closest(".modal");

        if (overlay && !event.target.closest(".modal-dialog") && overlay.hasAttribute("data-modal-dismissable")) {
            closeModal(overlay);
        }
    });
}

// =================================
// Dropdown
// =================================

function getDropdowns() {
    return Array.from(document.querySelectorAll(".dropdown"));
}

function closeDropdown(dropdown) {
    if (!dropdown) {
        return;
    }

    const toggle = dropdown.querySelector("[data-dropdown-toggle]");
    const menu = dropdown.querySelector(".dropdown-menu");

    dropdown.classList.remove("is-open");

    if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
    }

    if (menu) {
        menu.setAttribute("hidden", "");
    }
}

function closeDropdowns(exceptDropdown) {
    getDropdowns().forEach((dropdown) => {
        if (dropdown !== exceptDropdown) {
            closeDropdown(dropdown);
        }
    });
}

function openDropdown(dropdown) {
    if (!dropdown) {
        return;
    }

    const toggle = dropdown.querySelector("[data-dropdown-toggle]");
    const menu = dropdown.querySelector(".dropdown-menu");

    closeDropdowns(dropdown);
    dropdown.classList.add("is-open");

    if (toggle) {
        toggle.setAttribute("aria-expanded", "true");
    }

    if (menu) {
        menu.removeAttribute("hidden");
    }
}

function toggleDropdown(dropdown) {
    if (!dropdown) {
        return;
    }

    if (dropdown.classList.contains("is-open")) {
        closeDropdown(dropdown);
        return;
    }

    openDropdown(dropdown);
}

function initDropdowns() {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        if (!menu.closest(".dropdown")?.classList.contains("is-open")) {
            menu.setAttribute("hidden", "");
        }
    });

    document.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-dropdown-toggle]");

        if (toggle) {
            event.preventDefault();
            toggleDropdown(toggle.closest(".dropdown"));
            return;
        }

        if (!event.target.closest(".dropdown")) {
            closeDropdowns();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
            return;
        }

        const toggle = document.activeElement?.closest("[data-dropdown-toggle]");

        if (!toggle) {
            return;
        }

        const dropdown = toggle.closest(".dropdown");
        const items = Array.from(dropdown?.querySelectorAll(".dropdown-item") || []);

        if (!items.length) {
            return;
        }

        event.preventDefault();
        openDropdown(dropdown);

        const firstItem = event.key === "ArrowUp" ? items[items.length - 1] : items[0];
        firstItem.focus();
    });
}

// =================================
// Sidebar
// =================================

const SIDEBAR_BREAKPOINT = 767;

function getSidebar() {
    return document.querySelector("[data-sidebar]");
}

function getSidebarBackdrop() {
    let backdrop = document.querySelector("[data-sidebar-backdrop]");

    if (backdrop) {
        return backdrop;
    }

    backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "sidebar-backdrop";
    backdrop.setAttribute("data-sidebar-backdrop", "");
    backdrop.setAttribute("aria-label", "Close sidebar");
    backdrop.hidden = true;
    document.body.append(backdrop);

    return backdrop;
}

function syncSidebarState(isOpen) {
    const sidebar = getSidebar();
    const backdrop = getSidebarBackdrop();
    const shouldOpen = Boolean(isOpen);

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("is-open", shouldOpen);
    sidebar.setAttribute("aria-hidden", String(!shouldOpen && window.innerWidth <= SIDEBAR_BREAKPOINT));

    backdrop.hidden = !shouldOpen;
    backdrop.classList.toggle("is-visible", shouldOpen);
    document.body.classList.toggle("has-sidebar-open", shouldOpen);

    document.querySelectorAll("[data-sidebar-toggle]").forEach((toggle) => {
        toggle.setAttribute("aria-expanded", String(shouldOpen));
    });
}

function closeSidebar() {
    syncSidebarState(false);
}

function openSidebar() {
    syncSidebarState(true);
}

function toggleSidebar() {
    const sidebar = getSidebar();

    if (!sidebar) {
        return;
    }

    syncSidebarState(!sidebar.classList.contains("is-open"));
}

function initSidebar() {
    const sidebar = getSidebar();

    if (!sidebar) {
        return;
    }

    getSidebarBackdrop();
    syncSidebarState(false);

    document.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-sidebar-toggle]");

        if (toggle) {
            event.preventDefault();
            toggleSidebar();
            return;
        }

        if (event.target.closest("[data-sidebar-backdrop]")) {
            closeSidebar();
            return;
        }

        if (event.target.closest("[data-sidebar] .sidebar-link, [data-sidebar] .btn")) {
            closeSidebar();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > SIDEBAR_BREAKPOINT) {
            closeSidebar();
        }
    });
}

// =================================
// Carousel
// =================================

function getCarousels() {
    return Array.from(document.querySelectorAll("[data-carousel]"));
}

function setCarouselSlide(carousel, index) {
    if (!carousel) {
        return;
    }

    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    const indicators = Array.from(carousel.querySelectorAll("[data-carousel-indicator]"));

    if (!slides.length) {
        return;
    }

    const nextIndex = ((index % slides.length) + slides.length) % slides.length;

    carousel.setAttribute("data-carousel-index", String(nextIndex));

    slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === nextIndex;

        slide.classList.toggle("is-active", isActive);
        slide.toggleAttribute("hidden", !isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
    });

    indicators.forEach((indicator, indicatorIndex) => {
        const isActive = indicatorIndex === nextIndex;

        indicator.classList.toggle("is-active", isActive);
        indicator.setAttribute("aria-current", isActive ? "true" : "false");
    });
}

function stepCarousel(carousel, step) {
    const currentIndex = Number(carousel?.getAttribute("data-carousel-index") || 0);
    setCarouselSlide(carousel, currentIndex + step);
}

function initCarousels() {
    getCarousels().forEach((carousel) => {
        const firstIndex = Number(carousel.getAttribute("data-carousel-index") || 0);
        setCarouselSlide(carousel, firstIndex);
    });

    document.addEventListener("click", (event) => {
        const control = event.target.closest("[data-carousel-next], [data-carousel-prev], [data-carousel-indicator]");

        if (!control) {
            return;
        }

        const carousel = control.closest("[data-carousel]");

        if (!carousel) {
            return;
        }

        event.preventDefault();

        if (control.hasAttribute("data-carousel-next")) {
            stepCarousel(carousel, 1);
            return;
        }

        if (control.hasAttribute("data-carousel-prev")) {
            stepCarousel(carousel, -1);
            return;
        }

        const slideIndex = Number(control.getAttribute("data-carousel-indicator"));

        if (!Number.isNaN(slideIndex)) {
            setCarouselSlide(carousel, slideIndex);
        }
    });
}

// =================================
// Accordion
// =================================

function setAccordionItemState(item, isOpen) {
    if (!item) {
        return;
    }

    const button = item.querySelector("[data-accordion-trigger]");
    const panel = item.querySelector("[data-accordion-panel]");

    item.classList.toggle("is-open", isOpen);

    if (button) {
        button.setAttribute("aria-expanded", String(isOpen));
    }

    if (panel) {
        panel.setAttribute("aria-hidden", String(!isOpen));
    }
}

function toggleAccordionItem(item) {
    if (!item) {
        return;
    }

    const accordion = item.closest("[data-accordion]");
    const shouldOpen = !item.classList.contains("is-open");

    accordion?.querySelectorAll("[data-accordion-item]").forEach((accordionItem) => {
        setAccordionItemState(accordionItem, accordionItem === item ? shouldOpen : false);
    });
}

function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach((accordion) => {
        const items = accordion.querySelectorAll("[data-accordion-item]");

        items.forEach((item, index) => {
            setAccordionItemState(item, index === 0);
        });
    });

    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-accordion-trigger]");

        if (!trigger) {
            return;
        }

        event.preventDefault();
        toggleAccordionItem(trigger.closest("[data-accordion-item]"));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") {
            return;
        }

        const trigger = event.target.closest("[data-accordion-trigger]");

        if (!trigger) {
            return;
        }

        const accordion = trigger.closest("[data-accordion]");
        const triggers = Array.from(accordion?.querySelectorAll("[data-accordion-trigger]") || []);
        const currentIndex = triggers.indexOf(trigger);

        if (currentIndex === -1) {
            return;
        }

        event.preventDefault();

        if (event.key === "Home") {
            triggers[0]?.focus();
            return;
        }

        if (event.key === "End") {
            triggers[triggers.length - 1]?.focus();
            return;
        }

        const nextIndex = event.key === "ArrowDown"
            ? (currentIndex + 1) % triggers.length
            : (currentIndex - 1 + triggers.length) % triggers.length;

        triggers[nextIndex]?.focus();
    });
}

// =================================
// Global Initialization
// =================================

function initGlobalEvents() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const closedModal = closeTopModal();

            if (closedModal) {
                return;
            }

            closeDropdowns();
            closeSidebar();
        }
    });

    document.addEventListener("click", (event) => {
        const dismissTrigger = event.target.closest("[data-dismiss]");

        if (!dismissTrigger) {
            return;
        }

        const selector = dismissTrigger.getAttribute("data-dismiss");
        const target = selector ? document.querySelector(selector) : dismissTrigger.closest(".alert, .card, .modal");

        if (target) {
            target.setAttribute("hidden", "");
        }
    });
}

function initApp() {
    initTheme();
    initModals();
    initDropdowns();
    initSidebar();
    initCarousels();
    initAccordions();
    initGlobalEvents();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
    initApp();
}
