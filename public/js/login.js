document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    function checkUserName(userName) {
        if (!userName) throw `Error: You must supply a userName!`;
        if (typeof userName !== 'string') throw `Error: userName must be a string!`;
        userName = userName.trim();
        if (userName.length === 0)
            throw `Error: userName cannot be an empty string or string with just spaces`;
        if (!isNaN(userName))
            throw `Error: userName is not a valid value for userName as it only contains digits`;
        if (userName.length >= 20 || userName.length < 5)
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
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            var userName = document.getElementById('userName').value;
            var password = document.getElementById('password').value;
            console.log(userName, password);
            const errorUserName = document.getElementById('userName-error');
            const errorPassword = document.getElementById('password-error');
            var validinput = 1;
            try {
                errorUserName.textContent = '';
                userName = checkUserName(userName);
            } catch (e) {
                errorUserName.textContent = e;
                errorUserName.style.color = 'red';
                validinput = 0;
            }
            try {
                password = checkString(password, "password");
            } catch (e) {
                errorPassword.textContent = e;
                errorPassword.style.color = 'red';
                validinput = 0;
            }
            if (validinput) {
                loginForm.submit();
            } else {
                console.log('Form has errors. Not submitting.');
            }


        });


    }

});