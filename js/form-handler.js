// Form validation and submission handling
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const emailInput = document.getElementById("email");
    const confirmEmailInput = document.getElementById("confirm-email");
    const messageInput = document.getElementById("message");
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Create form status div but don't append it yet - only append when needed
    const formStatusDiv = document.createElement("div");
    formStatusDiv.className = "form-status";

    // Store original button text for later restoration
    const originalButtonText = submitButton.innerHTML;

    // Function to reset form state completely
    function resetFormState() {
        // Clear form
        contactForm.reset();

        // Reset all validation states
        const inputs = contactForm.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
            // Remove validation classes
            input.classList.remove("is-valid", "is-invalid");

            // Find and clear feedback div
            const feedbackDiv = input
                .closest(".form-group")
                .querySelector(".validation-feedback");
            if (feedbackDiv) {
                feedbackDiv.textContent = "";
                feedbackDiv.classList.remove("error-message");
            }

            // Reset validation icons - make sure they're properly hidden
            const inputWrapper = input.closest(".input-wrapper");
            if (inputWrapper) {
                const validIcon = inputWrapper.querySelector(".valid-icon");
                const invalidIcon = inputWrapper.querySelector(".invalid-icon");

                if (validIcon) {
                    validIcon.style.display = "none";
                    validIcon.style.opacity = "0";
                }
                if (invalidIcon) {
                    invalidIcon.style.display = "none";
                    invalidIcon.style.opacity = "0";
                }
            }
        });

        // Reset submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }

    // Add custom validation styles
    const formGroups = document.querySelectorAll(".form-group");
    formGroups.forEach((group) => {
        const input = group.querySelector("input, textarea");
        if (!input) return;

        // Create wrapper for input to position icons correctly
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "input-wrapper";
        inputWrapper.style.position = "relative";

        // Move input into wrapper
        input.parentNode.insertBefore(inputWrapper, input);
        inputWrapper.appendChild(input);

        // Add validation icons directly after input inside wrapper
        const validIcon = document.createElement("div");
        validIcon.className = "validation-icon valid-icon";
        validIcon.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8"><path fill="#28a745" d="M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z"/></svg>';

        const invalidIcon = document.createElement("div");
        invalidIcon.className = "validation-icon invalid-icon";
        invalidIcon.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#dc3545" viewBox="0 0 12 12"><circle cx="6" cy="6" r="4.5"/><path stroke-linejoin="round" d="M5.8 3.6h.4L6 6.5z"/><circle cx="6" cy="8.2" r=".6" fill="#dc3545" stroke="none"/></svg>';

        // Add icons to wrapper
        inputWrapper.appendChild(validIcon);
        inputWrapper.appendChild(invalidIcon);

        // Add validation feedback below the wrapper
        const feedbackDiv = document.createElement("div");
        feedbackDiv.className = "validation-feedback";
        group.appendChild(feedbackDiv);

        // Add input validation styling
        input.addEventListener("input", function () {
            validateInput(input);

            // Special handling for confirm email field
            if (input.id === "confirm-email" || input.id === "email") {
                validateEmailMatch();
            }
        });

        input.addEventListener("blur", function () {
            validateInput(input, true);

            // Special handling for confirm email field
            if (input.id === "confirm-email" || input.id === "email") {
                validateEmailMatch(true);
            }
        });
    });

    // Email regex pattern - robust validation
    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Validate that confirm email matches email
    function validateEmailMatch(showError = false) {
        if (!emailInput.value.trim() || !confirmEmailInput.value.trim()) {
            return;
        }

        const formGroup = confirmEmailInput.closest(".form-group");
        const feedbackDiv = formGroup.querySelector(".validation-feedback");

        // Clear previous validation
        confirmEmailInput.classList.remove("is-valid", "is-invalid");
        feedbackDiv.textContent = "";

        if (emailInput.value !== confirmEmailInput.value) {
            confirmEmailInput.classList.add("is-invalid");
            if (showError) {
                feedbackDiv.textContent = "Email addresses do not match";
                feedbackDiv.classList.add("error-message");
            }
            return false;
        } else if (emailRegex.test(emailInput.value.trim())) {
            // Only mark as valid if the email format is also valid
            confirmEmailInput.classList.add("is-valid");
            return true;
        }

        return false;
    }

    // Validate specific input
    function validateInput(input, showError = false) {
        const formGroup = input.closest(".form-group");
        const feedbackDiv = formGroup.querySelector(".validation-feedback");
        let isValid = true;
        let message = "";

        // Clear previous validation
        input.classList.remove("is-valid", "is-invalid");
        feedbackDiv.textContent = "";

        // Skip message validation if email is invalid
        if (
            input.id === "message" &&
            emailInput.value.trim() &&
            !emailRegex.test(emailInput.value.trim())
        ) {
            return true; // Don't validate message yet
        }

        // Special handling for confirm email
        if (input.id === "confirm-email") {
            if (!input.value.trim()) {
                isValid = false;
                message = "Please confirm your email address";
            } else if (input.value !== emailInput.value) {
                isValid = false;
                message = "Email addresses do not match";
            }
        }
        // Regular validation for other fields
        else if (input.hasAttribute("required") && !input.value.trim()) {
            isValid = false;
            message = `${
                input.closest(".form-group").querySelector("label").textContent
            } is required`;
        } else if (input.type === "email" && input.value.trim()) {
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
                message = "Please enter a valid email address";
            }
        } else if (input.hasAttribute("minlength") && input.value.trim()) {
            const minLength = parseInt(input.getAttribute("minlength"));
            if (input.value.trim().length < minLength) {
                isValid = false;
                message = `${
                    input.closest(".form-group").querySelector("label")
                        .textContent
                } must be at least ${minLength} characters`;
            }
        }

        // Apply appropriate styling
        if (input.value.trim()) {
            if (isValid) {
                input.classList.add("is-valid");
            } else {
                input.classList.add("is-invalid");
                if (showError) {
                    feedbackDiv.textContent = message;
                    feedbackDiv.classList.add("error-message");
                }
            }
        } else if (showError && input.hasAttribute("required")) {
            // Show error for empty required fields when explicitly validating (e.g. on submit)
            input.classList.add("is-invalid");
            feedbackDiv.textContent = message;
            feedbackDiv.classList.add("error-message");
        }

        return isValid;
    }

    // Form submission handler
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Always prevent default first to handle validation

        // First validate the form
        if (!validateForm()) {
            // Reset button state if validation fails
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;

            // We could show a form-level error message here if needed
            // if (!contactForm.contains(formStatusDiv)) {
            //     contactForm.appendChild(formStatusDiv);
            // }
            // formStatusDiv.textContent = "Please correct the errors above.";
            // formStatusDiv.className = "form-status error-message";

            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Store submission time to prevent double submissions
        localStorage.setItem("lastFormSubmission", Date.now());

        const formData = new FormData(contactForm);

        formData.delete("confirmEmail");
        formData.delete("subject");

        // Use Fetch API to submit the form to Formspree
        fetch(contactForm.action + "?_format=json", {
            method: contactForm.method,
            body: formData,
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok");
            })
            .then((data) => {
                // Append the status div to the form
                if (!contactForm.contains(formStatusDiv)) {
                    contactForm.appendChild(formStatusDiv);
                }

                // Show success message
                formStatusDiv.textContent =
                    "Thank you! Your message has been sent successfully.";
                formStatusDiv.className = "form-status success-message";

                // Reset form completely
                resetFormState();

                // Scroll to form
                document.getElementById("contact").scrollIntoView();
            })
            .catch((error) => {
                console.error("Error:", error);

                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;

                // Show error message
                if (!contactForm.contains(formStatusDiv)) {
                    contactForm.appendChild(formStatusDiv);
                }
                formStatusDiv.textContent =
                    "There was a problem sending your message. Please try again.";
                formStatusDiv.className = "form-status error-message";
            });
    });

    // Handle direct form submission response (for browsers that don't support fetch)
    window.addEventListener("load", function () {
        // Check if redirected back from Formspree
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("submitted")) {
            // Append the status div to the form now that we have a message to display
            if (!contactForm.contains(formStatusDiv)) {
                contactForm.appendChild(formStatusDiv);
            }

            // Show success message
            formStatusDiv.textContent =
                "Thank you! Your message has been sent successfully.";
            formStatusDiv.className = "form-status success-message";

            // Reset form completely
            resetFormState();

            // Scroll to form
            document.getElementById("contact").scrollIntoView();

            // Remove query parameter from URL
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        }
    });

    // Validate entire form
    function validateForm() {
        let isFormValid = true;

        // First validate name and email
        const nameInput = document.getElementById("name");

        if (!validateInput(nameInput, true)) {
            isFormValid = false;
        }

        if (!validateInput(emailInput, true)) {
            isFormValid = false;
            // If email is invalid, don't validate message yet
            return isFormValid;
        }

        // Validate confirm email
        if (!validateEmailMatch(true)) {
            isFormValid = false;
            return isFormValid;
        }

        // Only validate subject (optional) and message if email is valid
        const subjectInput = document.getElementById("subject");
        if (subjectInput) {
            validateInput(subjectInput, true);
        }

        if (!validateInput(messageInput, true)) {
            isFormValid = false;
        }

        return isFormValid;
    }
});
