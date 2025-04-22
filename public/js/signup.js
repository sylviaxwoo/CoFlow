document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const addEducationBtn = document.getElementById('add-education-btn');
    const educationContainer = document.getElementById('education-container');
    let educationCount = 1;
    const maxEducation = 5;

    // Function to generate a new education item HTML
    function createEducationItem(index) {
        return `
            <div class="education-item">
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

    // Event listener for adding education
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

    // Function to attach event listeners to remove education buttons
    function attachRemoveEducationListeners() {
        const removeButtons = document.querySelectorAll('.remove-education-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const indexToRemove = parseInt(event.target.dataset.index);
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
            item.querySelector('h3').textContent = `Education ${index + 1}`;
            item.querySelectorAll('[id^="school-"]').forEach(el => el.id = `school-${index}`);
            item.querySelectorAll('[name^="education["]').forEach(el => {
                const parts = el.name.split('[');
                el.name = `education[${index}]${parts[1]}`;
            });
            const removeButton = item.querySelector('.remove-education-btn');
            removeButton.dataset.index = index;
        });
    }

    // Populate state dropdown (replace with your actual data or API call)
    const stateDropdown = document.getElementById('state');
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

    // Basic form validation (you should add more robust validation)
    signupForm.addEventListener('submit', (event) => {
        let isValid = true;
        const errors = {};

        // Check required fields
        signupForm.querySelectorAll('.required input[type="text"], .required input[type="email"], .required input[type="password"], .required input[type="checkbox"]').forEach(input => {
            if (!input.value.trim() && input.type !== 'checkbox') {
                isValid = false;
                errors[input.name] = `${input.previousElementSibling.textContent.slice(0, -1)} is required.`;
                document.getElementById(`${input.id}-error`).textContent = errors[input.name];
            } else if (input.type === 'email' && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                isValid = false;
                errors[input.name] = 'Invalid email format.';
                document.getElementById(`${input.id}-error`).textContent = errors[input.name];
            } else if (input.type === 'checkbox' && !input.checked) {
                isValid = false;
                errors[input.name] = `You must agree to the ${input.nextElementSibling.textContent}.`;
                document.getElementById(`${input.id}-error`).textContent = errors[input.name];
            } else {
                document.getElementById(`${input.id}-error`).textContent = '';
            }
        });

        // Password confirmation (add if you include it)
        // const password = document.getElementById('password').value;
        // const confirmPassword = document.getElementById('confirmPassword').value;
        // if (confirmPassword && password !== confirmPassword) {
        //     isValid = false;
        //     errors['confirmPassword'] = 'Passwords do not match.';
        //     document.getElementById('confirmPassword-error').textContent = errors['confirmPassword'];
        // }

        if (!isValid) {
            event.preventDefault();
            console.log('Validation errors:', errors);
        }
    });

    // Initial attachment of remove education listeners
    attachRemoveEducationListeners();
});