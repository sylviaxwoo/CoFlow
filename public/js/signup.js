document.addEventListener('DOMContentLoaded', () => {
    function checkUserName(userName) {
        if (!userName) throw `Error: You must supply a userName!`;
        if (typeof userName !== 'string') throw `Error: userName must be a string!`;
        userName = userName.trim();
        if (userName.length === 0)
            throw `Error: userName cannot be an empty string or string with just spaces`;
        if (!isNaN(userName))
            throw `Error: UserName is not a valid value for userName as it only contains digits`;
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
        if (!digitChar.test(password))
            throw `Error: password must have at lease one number`;
        if (!uppercaseChar.test(password))
            throw `Error: password must have at lease one UpperCase Character`;
        if (!lowercaseChar.test(password))
            throw `Error: password must have at lease one LowerCase Character`;
        if (!specialChar.test(password))
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

    function checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
            throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    }

    function checkDate(date) {
        if (date === null || date === undefined)
            throw new Error("Date cannot be null or undefined");
        if (typeof date !== 'string')
            throw new Error("Date must be a string");

        date = date.trim();
        if (date === '')
            throw new Error("Date cannot be empty");

        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = date.match(dateRegex);

        if (!match) {
            throw new Error("Date must be in format YYYY-MM-DD");
        }

        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        const current = new Date();
        if (year <= 1990 && yeat <= current.getFullYear()) {
            throw new Error("Year must be in correct range");
        }

        if (month < 1 || month > 12) {
            throw new Error("Month must be between 01 and 12");
        }
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            throw new Error(`Day must be between 01 and ${daysInMonth} for the given month`);
        }

        const dateValid = new Date(year, month - 1, day); // month is 0-indexed in Date
        if (
            dateValid.getFullYear() !== year ||
            dateValid.getMonth() !== month - 1 ||
            dateValid.getDate() !== day
        ) {
            throw new Error("Invalid date: The provided year, month, and day do not form a valid date.");
        }
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');

        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    function checkGender(gender) {

        if (gender === null || gender === undefined) {
            throw new Error("Gender cannot be null or undefined");
        }
        if (typeof gender !== 'string') {
            throw new Error("Gender must be a string");
        }
        gender = gender.trim();
        if (gender.length == 0) {
            throw new Error("Gender cannot be empty");
        }
        const validgender = ['male', 'female', 'other'];
        const resgender = gender.toLowerCase();

        if (!validgender.includes(resgender)) {
            throw new Error("Gender must be in: Male, Female, Other");
        }
        return resgender;
    }

    function checkStringArray(arr, varName) {
        //We will allow an empty array for this,
        //if it's not empty, we will make sure all tags are strings
        if (!arr || !Array.isArray(arr))
            throw `You must provide an array of ${varName}`;
        for (let i in arr) {
            if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
                throw `One or more elements in ${varName} array is not a string or is an empty string`;
            }
            arr[i] = arr[i].trim();
        }

        return arr;
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
        reIndexEducationItems();
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
        const educationItems = document.querySelectorAll('.education-item');
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
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(signupForm);

            const userName = formData.get('userName');
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const password = formData.get('password');
            const bio = formData.get('bio');
            const gender = formData.get('gender');
            const state = formData.get('state');
            const city = formData.get('city');
            const dob = formData.get('dob');
            const courses = formData.get('courses');
            const terms = formData.get('terms');
            const privacy = formData.get('privacy');

            var userNameError = document.getElementById('userName-error');
            var firstNameError = document.getElementById('firstName-error');
            var lastNameError = document.getElementById('lastName-error');
            var emailError = document.getElementById('email-error');
            var passwordError = document.getElementById('password-error');
            var bioError = document.getElementById('bio-error');
            var genderError = document.getElementById('gender-error');
            // var stateError = document.getElementById('state-error');
            // var cityError = document.getElementById('city-error');
            var dobError = document.getElementById('dob-error');
            var coursesError = document.getElementById('courses-error');
            var educationError = document.getElementById('education-error');

            userNameError.textContent = '';
            firstNameError.textContent = '';
            lastNameError.textContent = '';
            emailError.textContent = '';
            passwordError.textContent = '';
            bioError.textContent = '';
            genderError.textContent = '';
            // stateError
            // cityError
            dobError.textContent = '';
            coursesError.textContent = '';
            educationError.textContent = '';

            var isFormValid = true;
            try {
                userNameError.textContent = '';
                checkUserName(userName);
            } catch (e) {
                userNameError.textContent = e;
                isFormValid = false;
            }
            try {
                checkPassword(password, "password");
            } catch (e) {
                passwordError.textContent = e;
                isFormValid = false;
            }
            try {
                checkString(firstName, "First Name");
            } catch (e) {
                firstNameError.textContent = e;
                isFormValid = false;
            }

            try {
                checkString(lastName, "Last Name");
            } catch (e) {
                lastNameError.textContent = e;
                isFormValid = false;
            }
            try {
                checkEmail(email);
            } catch (e) {
                emailError.textContent = e;
                isFormValid = false;
            }
            try {
                bio ? checkString(bio) : "";
            } catch (e) {
                bioError.textContent = e;
                isFormValid = false;
            }

            //Gender
            try {
                gender ? checkGender(gender) : "";
            } catch (e) {
                genderError.textContent = e;
                isFormValid = false;
            }

            //State
            // try {
            //     checkState(state);
            // } catch (e) {
            //     stateError.textContent = e;
            //     isFormValid = false;
            // }

            //City
            // try {
            //     checkCity(city);
            // } catch (e) {
            //     cityError.textContent = e;
            //     isFormValid = false;
            // }

            //dob
            try {
                dob ? checkDate(dob) : '';
            } catch (e) {
                dobError.textContent = e;
                isFormValid = false;
            }

            //courses
            try {
                courses ? checkStringArray(courses.trim().split(','), "Courses") : '';
            } catch (e) {
                coursesError.textContent = e;
                isFormValid = false;
            }

            const educations = document.querySelectorAll('.education-item');
            if (educations) {
                educations.forEach((edu, index) => {
                    var schoolName = edu.querySelector(`[name="education[${index}][schoolName]"]`);
                    schoolName = schoolName ? schoolName.value : ""
                    var educationLevel = edu.querySelector(`[name="education[${index}][educationLevel]"]`);
                    var educationLevel = educationLevel ? educationLevel.value : "";
                    var major = edu.querySelector(`[name="education[${index}][major]"]`);
                    var major = major ? major.value : "";
                    var startDate = edu.querySelector(`[name="education[${index}][startDate]"]`);
                    var startDate = startDate ? startDate.value : "";
                    var endDate = edu.querySelector(`[name="education[${index}][endDate]"]`);
                    var endDate = endDate ? endDate.value : "";
                    try {
                        checkString(schoolName, `Education-${index + 1} School Name`);
                        educationLevel ? checkString(educationLevel, `Education-${index + 1} Education Level`) : "";
                        major ? checkString(major, `Education-${index + 1} Major`) : "";
                        startDate ? checkDate(startDate, `Education-${index + 1} Start Date`) : "";
                        endDate ? checkDate(endDate, `Education-${index + 1} End Date`) : "";
                    } catch (error) {
                        educationError.textContent += error + '; ';
                        isFormValid = false;
                    }
                })
            };

            if (isFormValid) {
                signupForm.submit();
            } else {
                console.log('Form has errors.');
            }


        });


    }


    attachRemoveEducationListeners();
});