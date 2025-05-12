document.addEventListener('DOMContentLoaded', () => {
    const businessSignupForm = document.getElementById('business-signup-form');
    
    if (businessSignupForm) {
        businessSignupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(businessSignupForm);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // 获取所有错误显示元素
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(el => el.textContent = '');
            
            let isFormValid = true;

            // 验证每个字段
            try {
                checkString(formDataObj.userName, "Username");
            } catch (e) {
                document.getElementById('userName-error').textContent = e;
                isFormValid = false;
            }

            try {
                checkString(formDataObj.company, "Company");
            } catch (e) {
                document.getElementById('company-error').textContent = e;
                isFormValid = false;
            }

            try {
                checkEmail(formDataObj.email);
            } catch (e) {
                document.getElementById('email-error').textContent = e;
                isFormValid = false;
            }

            try {
                checkPhone(formDataObj.phone, "Phone");
            } catch (e) {
                document.getElementById('phone-error').textContent = e;
                isFormValid = false;
            }

            try {
                checkString(formDataObj.description, "Description");
            } catch (e) {
                document.getElementById('description-error').textContent = e;
                isFormValid = false;
            }

            try {
                checkPassword(formDataObj.password, "Password");
            } catch (e) {
                document.getElementById('password-error').textContent = e;
                isFormValid = false;
            }

            try {
                if (formDataObj.password !== formDataObj.confirmPassword) {
                    throw "Passwords do not match";
                }
            } catch (e) {
                document.getElementById('confirmPassword-error').textContent = e;
                isFormValid = false;
            }

            try {
                checkString(formDataObj.address, "Address");
            } catch (e) {
                document.getElementById('address-error').textContent = e;
                isFormValid = false;
            }

            try {
                checkString(formDataObj.city, "City");
            } catch (e) {
                document.getElementById('city-error').textContent = e;
                isFormValid = false;
            }

            try {
                checkString(formDataObj.state, "State");
            } catch (e) {
                document.getElementById('state-error').textContent = e;
                isFormValid = false;
            }

            try {
                if (formDataObj.courses) {
                    checkStringArray(formDataObj.courses.split(','), "Courses");
                }
            } catch (e) {
                document.getElementById('courses-error').textContent = e;
                isFormValid = false;
            }

            try {
                if (!formDataObj.terms) {
                    throw "You must agree to the terms";
                }
            } catch (e) {
                document.getElementById('terms-error').textContent = e;
                isFormValid = false;
            }

            try {
                if (!formDataObj.privacy) {
                    throw "You must agree to the privacy policy";
                }
            } catch (e) {
                document.getElementById('privacy-error').textContent = e;
                isFormValid = false;
            }

            // 如果表单有效，则提交
            if (isFormValid) {
                try {
                    const requestData = {
                        userName: formDataObj.userName,
                        company: formDataObj.company,
                        email: formDataObj.email,
                        password: formDataObj.password,
                        phone: formDataObj.phone,
                        description: formDataObj.description,
                        address: formDataObj.address,
                        city: formDataObj.city,
                        state: formDataObj.state,
                        courses: formDataObj.courses ? formDataObj.courses.split(',').map(course => course.trim()) : [],
                        terms: formDataObj.terms ? 'on' : '',
                        privacy: formDataObj.privacy ? 'on' : ''
                    };
                    
                    console.log('Sending registration data:', requestData);

                    const response = await fetch('/business/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData)
                    });

                    const data = await response.json();
                    console.log('Server response:', data);

                    if (response.ok) {
                        // 注册成功，重定向到仪表盘
                        window.location.href = data.redirect || '/business/dashboard';
                    } else {
                        // 显示服务器返回的错误信息
                        console.error('Registration failed:', data);
                        const errorContainer = document.getElementById('error-container');
                        const errorMessage = document.getElementById('error-message');
                        
                        if (errorContainer && errorMessage) {
                            // 处理错误信息
                            let errorText = 'Registration failed';
                            
                            if (data.error) {
                                if (typeof data.error === 'object') {
                                    // 如果是对象，尝试获取第一个错误信息
                                    const errorKeys = Object.keys(data.error);
                                    if (errorKeys.length > 0) {
                                        errorText = data.error[errorKeys[0]];
                                    } else {
                                        errorText = 'An unknown error occurred';
                                    }
                                } else {
                                    errorText = data.error;
                                }
                            }
                            
                            errorMessage.textContent = errorText;
                            errorContainer.classList.add('show');
                            
                            // 滚动到错误信息
                            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            
                            // 标记有错误的输入框
                            const formGroups = document.querySelectorAll('.form-group');
                            formGroups.forEach(group => {
                                const input = group.querySelector('input, textarea, select');
                                if (input) {
                                    input.classList.add('error');
                                }
                            });
                        } else {
                            alert(errorText);
                        }
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                    const errorContainer = document.getElementById('error-container');
                    const errorMessage = document.getElementById('error-message');
                    
                    if (errorContainer && errorMessage) {
                        errorMessage.textContent = 'An error occurred during registration';
                        errorContainer.classList.add('show');
                        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        alert('An error occurred during registration');
                    }
                }
            }
        });
    }

    // 验证函数
    function checkString(value, fieldName) {
        if (!value) throw `${fieldName} is required`;
        if (typeof value !== 'string') throw `${fieldName} must be a string`;
        if (value.trim().length === 0) throw `${fieldName} cannot be empty or just whitespace`;
        if (value.length > 100) throw `${fieldName} cannot be longer than 100 characters`;
        return value.trim();
    }

    function checkEmail(email) {
        if (!email) throw 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw 'Please enter a valid email address';
        return email;
    }

    function checkPhone(phone, fieldName) {
        if (!phone) throw `${fieldName} is required`;
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(phone)) throw 'Please enter a valid phone number';
        return phone;
    }

    function checkPassword(password, fieldName) {
        if (!password) throw `${fieldName} is required`;
        if (password.length < 8) throw `${fieldName} must be at least 8 characters`;
        if (!/[a-z]/.test(password)) throw `${fieldName} must contain at least one lowercase letter`;
        if (!/[A-Z]/.test(password)) throw `${fieldName} must contain at least one uppercase letter`;
        if (!/[0-9]/.test(password)) throw `${fieldName} must contain at least one number`;
        if (!/[!@#$%^&*]/.test(password)) throw `${fieldName} must contain at least one special character`;
        return password;
    }

    function checkStringArray(array, fieldName) {
        if (!Array.isArray(array)) throw `${fieldName} must be an array`;
        array.forEach(item => {
            if (typeof item !== 'string') throw `${fieldName} must contain only strings`;
            if (item.trim().length === 0) throw `${fieldName} cannot contain empty strings`;
        });
        return array;
    }
});