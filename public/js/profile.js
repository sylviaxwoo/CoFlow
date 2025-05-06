document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const profileForm = document.getElementById('profile-form');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const addEducationBtn = document.getElementById('add-education-btn');
    const educationContainer = document.getElementById('education-container');
    let educationCount = document.querySelectorAll('.education-item').length;
    const maxEducation = 5;

    // Initial form state
    let originalFormData = null;

    // Function to create a new education item
    function createEducationItem(index) {
        return `
            <div class="education-item" data-index="${index}">
                <h3>Education ${index + 1}</h3>
                <div class="nested-form-group">
                    <label for="school-${index}">School Name:</label>
                    <input type="text" id="school-${index}" name="education[${index}][schoolName]">
                </div>
                <div class="nested-form-group">
                    <label for="educationLevel-${index}">Education Level:</label>
                    <input type="text" id="educationLevel-${index}" name="education[${index}][educationLevel]">
                </div>
                <div class="nested-form-group">
                    <label for="major-${index}">Major:</label>
                    <input type="text" id="major-${index}" name="education[${index}][major]">
                </div>
                <div class="nested-form-group">
                    <label for="startDate-${index}">Start Date:</label>
                    <input type="date" id="startDate-${index}" name="education[${index}][startDate]">
                </div>
                <div class="nested-form-group">
                    <label for="endDate-${index}">End Date:</label>
                    <input type="date" id="endDate-${index}" name="education[${index}][endDate]">
                </div>
                <button type="button" class="remove-education-btn" data-index="${index}">- Remove</button>
            </div>
        `;
    }

    // Function to enable edit mode
    function enableEditMode() {
        // Save original form data for cancel functionality
        originalFormData = new FormData(profileForm);

        // Show/hide buttons
        editProfileBtn.style.display = 'none';
        saveProfileBtn.style.display = 'inline-block';
        cancelEditBtn.style.display = 'inline-block';
        addEducationBtn.style.display = 'inline-block';

        // Make all inputs editable
        const inputs = profileForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
        });

        // Show remove buttons for education items
        const removeButtons = document.querySelectorAll('.remove-education-btn');
        removeButtons.forEach(button => {
            button.style.display = 'inline-block';
        });

        // Attach event listeners for education buttons
        attachRemoveEducationListeners();
    }

    // Function to disable edit mode
    function disableEditMode() {
        // Show/hide buttons
        editProfileBtn.style.display = 'inline-block';
        saveProfileBtn.style.display = 'none';
        cancelEditBtn.style.display = 'none';
        addEducationBtn.style.display = 'none';

        // Make all inputs read-only
        const inputs = profileForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
            if (input.type === 'radio' || input.type === 'select-one') {
                input.setAttribute('disabled', true);
            }
        });

        // Hide remove buttons for education items
        const removeButtons = document.querySelectorAll('.remove-education-btn');
        removeButtons.forEach(button => {
            button.style.display = 'none';
        });
    }

    // Function to restore original form data
    function restoreFormData() {
        if (originalFormData) {
            for (const [key, value] of originalFormData.entries()) {
                const field = profileForm.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'radio') {
                        const radio = profileForm.querySelector(`[name="${key}"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    } else {
                        field.value = value;
                    }
                }
            }
        }

        // Restore education items by reloading the page
        location.reload();
    }

    // Function to attach event listeners to remove education buttons
    function attachRemoveEducationListeners() {
        const removeButtons = document.querySelectorAll('.remove-education-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const itemToRemove = event.target.closest('.education-item');
                if (itemToRemove) {
                    itemToRemove.remove();
                    // Re-index remaining education items for correct form submission
                    reIndexEducationItems();
                    educationCount--;
                }
            });
        });
    }

    // Function to re-index education items after removal
    function reIndexEducationItems() {
        const educationItems = document.querySelectorAll('#education-container .education-item');
        educationItems.forEach((item, index) => {
            item.dataset.index = index;
            item.querySelector('h3').textContent = `Education ${index + 1}`;

            // Update all input fields inside this education item
            const inputs = item.querySelectorAll('input');
            inputs.forEach(input => {
                const fieldName = input.name.split('[')[2].replace(']', '');
                input.name = `education[${index}][${fieldName}`;

                // Also update IDs if needed
                if (input.id.includes('-')) {
                    const idBase = input.id.split('-')[0];
                    input.id = `${idBase}-${index}`;
                }
            });

            // Update remove button data-index
            const removeButton = item.querySelector('.remove-education-btn');
            if (removeButton) {
                removeButton.dataset.index = index;
            }
        });
    }

    // Form validation functions
    function checkUserName(userName) {
        if (!userName) throw `Error: You must supply a userName!`;
        if (typeof userName !== 'string') throw `Error: userName must be a string!`;
        userName = userName.trim();
        if (userName.length === 0)
            throw `Error: userName cannot be an empty string or string with just spaces`;
        if (!isNaN(userName))
            throw `Error: ${userName} is not a valid value for userName as it only contains digits`;
        if (userName.length < 5 || userName.length > 20)
            throw `Error: userName must be at least 5 characters and at most 20 characters`;
        return userName;
    }

    function checkEmail(email) {
        if (!email) throw 'Error: You must provide an email address';
        if (typeof email !== 'string') throw 'Error: Email must be a string';
        email = email.trim();
        if (email.length === 0) throw 'Error: Email cannot be an empty string or just spaces';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            throw 'Error: Invalid email format';
        }

        return email.toLowerCase();
    }

    function validateDate(dateString) {
        if (!dateString) return true; // Date is optional

        // Check if the string matches the YYYY-MM-DD format
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) {
            throw 'Error: Date must be in YYYY-MM-DD format';
        }

        // Parse the date parts
        const parts = dateString.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        // Check year range
        if (year < 1900 || year > new Date().getFullYear()) {
            throw 'Error: Year must be between 1900 and current year';
        }

        // Check month range
        if (month < 1 || month > 12) {
            throw 'Error: Month must be between 1 and 12';
        }

        // Check day range based on month
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust February for leap years
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
            daysInMonth[1] = 29;
        }

        if (day < 1 || day > daysInMonth[month - 1]) {
            throw `Error: Invalid day for the selected month`;
        }

        return true;
    }

    // Function to validate the form before submission
    function validateForm() {
        let isValid = true;
        const errorMessages = {};

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });

        try {
            checkUserName(document.getElementById('userName').value);
        } catch (e) {
            errorMessages['userName'] = e;
            isValid = false;
        }

        try {
            checkEmail(document.getElementById('email').value);
        } catch (e) {
            errorMessages['email'] = e;
            isValid = false;
        }

        // Validate dates
        try {
            validateDate(document.getElementById('dob').value);
        } catch (e) {
            errorMessages['dob'] = e;
            isValid = false;
        }

        // Validate education dates
        document.querySelectorAll('[id^="startDate-"], [id^="endDate-"]').forEach(dateField => {
            try {
                validateDate(dateField.value);
            } catch (e) {
                const fieldId = dateField.id;
                errorMessages[fieldId] = e;
                isValid = false;
            }
        });

        // Display error messages
        for (const [field, message] of Object.entries(errorMessages)) {
            const errorElement = document.getElementById(`${field}-error`);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }

        return isValid;
    }

    // Event Listeners
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();
            enableEditMode();
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', (event) => {
            event.preventDefault();
            restoreFormData();
            disableEditMode();
        });
    }

    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (educationCount < maxEducation) {
                educationContainer.insertAdjacentHTML('beforeend', createEducationItem(educationCount));
                educationCount++;
                attachRemoveEducationListeners();
            } else {
                alert(`You can add a maximum of ${maxEducation} education entries.`);
            }
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (event) => {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }

    // Populate state dropdown if needed
    const stateDropdown = document.getElementById('state');
    if (stateDropdown && stateDropdown.options.length <= 1) {
        const states = [
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
            "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
            "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
        ];
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateDropdown.appendChild(option);
        });
    }
});