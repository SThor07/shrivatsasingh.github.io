// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const systemThemeToggle = document.getElementById("systemThemeToggle");

// Immediately check for stored preferences to avoid flash of wrong theme
(function () {
    const savedTheme = localStorage.getItem("theme");
    const systemThemeEnabled =
        localStorage.getItem("systemTheme") !== "disabled";

    if (systemThemeEnabled) {
        // Use system preference
        applyTheme(prefersDarkScheme.matches ? "dark" : "light");
    } else if (savedTheme) {
        // Use saved theme preference
        applyTheme(savedTheme);
    } else {
        // Default to system preference if no saved theme
        applyTheme(prefersDarkScheme.matches ? "dark" : "light");
    }
})();

// Function to apply theme without saving to localStorage (for initialization)
function applyTheme(theme) {
    if (theme === "light") {
        document.body.classList.add("light-theme");
        document.documentElement.classList.add("light-theme");
        document.documentElement.style.backgroundColor = "var(--light-bg)";
    } else {
        document.body.classList.remove("light-theme");
        document.documentElement.classList.remove("light-theme");
        document.documentElement.style.backgroundColor = "var(--dark)";
    }
}

// Function to set theme and save to localStorage
function setTheme(theme) {
    applyTheme(theme);

    if (localStorage.getItem("systemTheme") === "disabled") {
        localStorage.setItem("theme", theme);
    } else {
        localStorage.removeItem("theme");
    }
}

// Toggle theme when button is clicked
themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("light-theme")) {
        setTheme("dark");
    } else {
        setTheme("light");
    }
});

// Function to handle system theme changes
function handleSystemThemeChange(e) {
    const systemThemeEnabled =
        localStorage.getItem("systemTheme") !== "disabled";

    if (systemThemeEnabled) {
        // Only apply system theme if the system theme toggle is enabled
        setTheme(e.matches ? "dark" : "light");
    }
}

// Listen for system theme changes
prefersDarkScheme.addEventListener("change", handleSystemThemeChange);

// Function to initialize theme based on settings
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    const systemThemeEnabled =
        localStorage.getItem("systemTheme") !== "disabled";

    // Set the system theme toggle state
    systemThemeToggle.checked = systemThemeEnabled;

    // Show/hide the manual theme toggle based on system theme setting
    if (systemThemeEnabled) {
        themeToggle.classList.add("hidden");
        themeToggle.classList.remove("active");
    } else {
        themeToggle.classList.remove("hidden");
        themeToggle.classList.add("active");
    }

    if (systemThemeEnabled) {
        // Use system preference
        setTheme(prefersDarkScheme.matches ? "dark" : "light");
    } else if (savedTheme) {
        // Use saved theme preference
        setTheme(savedTheme);
    } else {
        // Default to system preference if no saved theme
        setTheme(prefersDarkScheme.matches ? "dark" : "light");
        // Save this initial theme
        localStorage.setItem(
            "theme",
            prefersDarkScheme.matches ? "dark" : "light"
        );
    }
}

// System theme toggle functionality
systemThemeToggle.addEventListener("change", function () {
    if (this.checked) {
        // Enable system theme
        localStorage.setItem("systemTheme", "enabled");
        themeToggle.classList.add("hidden");
        themeToggle.classList.remove("active");

        // Use system preference immediately
        setTheme(prefersDarkScheme.matches ? "dark" : "light");
    } else {
        // Disable system theme
        localStorage.setItem("systemTheme", "disabled");
        themeToggle.classList.remove("hidden");
        themeToggle.classList.add("active");

        // Keep current theme as starting point
        const currentTheme = document.body.classList.contains("light-theme")
            ? "light"
            : "dark";
        localStorage.setItem("theme", currentTheme);
    }
});

// Initialize complete theme controls once DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    initializeTheme();

    // Re-apply the system theme check whenever the page is focused
    // This helps ensure consistency when the system theme changes while the page is open
    window.addEventListener("focus", function () {
        if (localStorage.getItem("systemTheme") !== "disabled") {
            setTheme(prefersDarkScheme.matches ? "dark" : "light");
        }
    });
});
