// Mobile menu toggle
document.querySelector("button.menu").addEventListener("click", function () {
    document.querySelector("nav ul").classList.toggle("active");
});

// Close menu when clicking a link
document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", function () {
        document.querySelector("nav ul").classList.remove("active");
    });
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Active nav link
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

// Function to check if logo text needs to be hidden
function checkLogoTextDisplay() {
    const logoContainers = document.querySelectorAll("a.logo, .footer-logo");

    logoContainers.forEach((container) => {
        const logoText = container.querySelector(".logo-text");
        if (!logoText) return;

        // Reset display to measure properly
        logoText.style.display = "";

        // Check if container width is less than the sum of icon and text
        const logoIcon = container.querySelector(".logo-icon");
        const containerWidth = container.offsetWidth;
        const iconWidth = logoIcon ? logoIcon.offsetWidth : 0;
        const textWidth = logoText.offsetWidth;

        // For footer logo, check parent container width too
        const isFooterLogo = container.classList.contains("footer-logo");
        const footerWidth = isFooterLogo
            ? container.closest(".footer-content").offsetWidth
            : Infinity;

        // If text would wrap or overflow, hide it
        if (
            containerWidth < iconWidth + textWidth + 10 ||
            (isFooterLogo && footerWidth < textWidth + 20)
        ) {
            // 10-20px buffer
            logoText.style.display = "none";
            container.style.justifyContent = "center";
        } else {
            container.style.justifyContent = "";
        }
    });
}

// Check logo text on load and resize
window.addEventListener("load", checkLogoTextDisplay);
window.addEventListener("resize", checkLogoTextDisplay);

window.addEventListener("scroll", function () {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").substring(1) === current) {
            link.classList.add("active");
        }
    });
});

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const offset = 30; // Reduced offset from 70px to 30px for tighter positioning
            const scrollPosition = targetElement.offsetTop - offset;

            window.scrollTo({
                top: scrollPosition,
                behavior: "smooth",
            });

            // Update URL without refreshing the page
            history.pushState(null, null, `#${targetId}`);
        }
    });
});
