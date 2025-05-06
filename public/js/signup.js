document.addEventListener('DOMContentLoaded', () => {
    function checkUserName(userName) {
        if (!userName) throw `Error: You must supply a userName!`;
        if (typeof userName !== 'string') throw `Error: userName must be a string!`;
        userName = userName.trim();
        if (userName.length === 0)
            throw `Error: userName cannot be an empty string or string with just spaces`;
        if (!isNaN(userName))
            throw `Error: ${strVal} is not a valid value for userNameas it only contains digits`;
        if (userName.length >= 20 && userName.length >= 5)
            throw `Error: userName cannot be at least 5 character and at most 20 character`;
        return userName;
    };

    function checkPassword(password) {
        const uppercaseChar = /[A-Z]/;
        const lowercaseChar = /[a-z]/;
        const digitChar = /[0-9]/;
        const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (!password) throw `Error: You must supply a password!`;
        if (typeof password !== 'string') throw `Error: password must be a string!`;
        password = password.trim();
        if (password.length === 0)
            throw `Error: password cannot be an empty string or string with just spaces`;
        if (password.length < 8)
            throw `Error: password cannot be at least 8 characters`;
        if (digitChar.test(password))
            throw `Error: password must have at lease one number`;
        if (uppercaseChar.test(password))
            throw `Error: password must have at lease one UpperCase Character`;
        if (lowercaseChar.test(password))
            throw `Error: password must have at lease one LowerCase Character`;
        if (specialChar.test(password))
            throw `Error: password must have at lease one Special Character`;

        return password;
    };

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
                    <input type="text" id="school-${index}" name="education[${index}][schoolName] required">
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

    if (signupForm) {

    }

    // Initial attachment of remove education listeners
    attachRemoveEducationListeners();
});