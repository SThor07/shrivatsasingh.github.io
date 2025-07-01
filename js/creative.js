// Creative effects for the portfolio
document.addEventListener("DOMContentLoaded", function () {
    // Initialize particle effect for hero section
    initParticles();

    // Add typing effect to hero title
    initTypingEffect();

    // Initialize skill tag interactions
    initSkillTags();
});

// Particle effect for hero section
function initParticles() {
    const heroSection = document.getElementById("hero");

    // Create particle container
    const particlesContainer = document.createElement("div");
    particlesContainer.className = "particles";
    heroSection.appendChild(particlesContainer);

    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }

    // Add mouse movement interaction
    heroSection.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Create particles on mouse move occasionally
        if (i % 5 === 0) {
            const particle = document.createElement("div");
            particle.className = "particle";

            // Random size between 3-8px
            const size = Math.random() * 5 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Position around mouse
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 50;
            particle.style.left = `${mouseX + offsetX}px`;
            particle.style.top = `${mouseY + offsetY}px`;

            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.2;

            // Add to container
            particlesContainer.appendChild(particle);

            // Animate and remove
            setTimeout(() => {
                particle.style.transition = "all 1s ease";
                particle.style.transform = `translate(${
                    (Math.random() - 0.5) * 100
                }px, ${(Math.random() - 0.5) * 100}px)`;
                particle.style.opacity = 0;

                setTimeout(() => {
                    particlesContainer.removeChild(particle);
                }, 1000);
            }, 10);
        }
    });
}

function createParticle(container) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random size between 2-6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.1;

    // Add to container
    container.appendChild(particle);

    // Animate floating
    animateParticle(particle);
}

function animateParticle(particle) {
    // Initial position
    const startLeft = parseFloat(particle.style.left);
    const startTop = parseFloat(particle.style.top);

    // Random speed
    const speed = Math.random() * 15000 + 10000; // 10-25 seconds

    // Start animation
    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / speed;

        if (progress < 1) {
            // Sine wave movement
            const newX = startLeft + Math.sin(progress * Math.PI * 2) * 5;
            const newY = startTop + progress * 15; // Slow upward movement

            particle.style.left = `${newX}%`;
            particle.style.top = `${newY}%`;

            requestAnimationFrame(animate);
        } else {
            // Reset position and start again
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            animateParticle(particle);
        }
    }

    requestAnimationFrame(animate);
}

// Typing effect for hero title
function initTypingEffect() {
    const heroTitle = document.querySelector("#hero h1");
    if (!heroTitle) return;

    const text = heroTitle.innerHTML;
    const gradientSpan = heroTitle.querySelector(".gradient-text");
    const gradientText = gradientSpan ? gradientSpan.textContent : "";

    // Clear the current content
    heroTitle.innerHTML = "";

    // Add the non-gradient part
    const plainText = text.replace(
        `<span class="gradient-text">${gradientText}</span>`,
        ""
    );
    const plainPart = document.createTextNode(plainText);
    heroTitle.appendChild(plainPart);

    // Add the gradient part
    const gradientPart = document.createElement("span");
    gradientPart.className = "gradient-text";
    heroTitle.appendChild(gradientPart);

    // Add typing cursor
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    heroTitle.appendChild(cursor);

    // Animate typing for gradient text
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < gradientText.length) {
            gradientPart.textContent += gradientText.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            // Remove cursor after typing is complete
            setTimeout(() => {
                cursor.style.display = "none";
            }, 1500);
        }
    }, 100);
}

// Enhance skill tags with interactive behaviors
function initSkillTags() {
    const skillTags = document.querySelectorAll(".skill-tag");

    skillTags.forEach((tag) => {
        // Random delay for floating animation
        tag.style.animationDelay = `${Math.random() * 2}s`;

        // Add pulse glow effect on hover
        tag.addEventListener("mouseenter", () => {
            tag.classList.add("pulse-glow");
        });

        tag.addEventListener("mouseleave", () => {
            tag.classList.remove("pulse-glow");
        });
    });
}
