//profile客户端校验

document.addEventListener('DOMContentLoaded', () => {
    // 获取元素
    const profileForm = document.getElementById('business-profile-form');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    // 初始表单状态
    let originalFormData = null;

    // 启用编辑模式
    function enableEditMode() {
        // 保存原始表单数据用于取消操作
        originalFormData = new FormData(profileForm);

        // 显示/隐藏按钮
        editProfileBtn.style.display = 'none';
        saveProfileBtn.style.display = 'inline-block';
        cancelEditBtn.style.display = 'inline-block';

        // 使所有输入可编辑
        const inputs = profileForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
        });
    }

    // 禁用编辑模式
    function disableEditMode() {
        // 显示/隐藏按钮
        editProfileBtn.style.display = 'inline-block';
        saveProfileBtn.style.display = 'none';
        cancelEditBtn.style.display = 'none';

        // 使所有输入只读
        const inputs = profileForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
            if (input.type === 'radio' || input.type === 'select-one' || input.type === 'file') {
                input.setAttribute('disabled', true);
            }
        });
    }

    // 恢复原始表单数据
    function restoreFormData() {
        if (originalFormData) {
            for (const [key, value] of originalFormData.entries()) {
                const field = profileForm.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'radio') {
                        const radio = profileForm.querySelector(`[name="${key}"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    } else if (field.type === 'file') {
                        field.value = "";
                    } else {
                        field.value = value;
                    }
                }
            }
        }
    }

    // 事件监听器
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

    // 图片上传处理 (与C端相同)
    const uploadPic = document.getElementById('uploadPic');
    const shownPic = document.getElementById("shownPic");
    const profilePicture = document.getElementById("profilePicture");
    
    if (uploadPic && shownPic) {
        uploadPic.addEventListener('change', function() {
            if (uploadPic.files[0]) {
                const cloudName = 'dknqbw5qg';
                const uploadPreset = 'coflow';
                const fd = new FormData();

                fd.append('file', uploadPic.files[0]);
                fd.append('upload_preset', uploadPreset);
                
                fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: fd
                })
                .then(response => response.json())
                .then(data => {
                    shownPic.src = data.secure_url;
                    profilePicture.value = data.secure_url;
                })
                .catch(error => {
                    console.error('Error uploading to Cloudinary:', error);
                });
            }
        });
    }

    // 表单提交验证
    if (profileForm) {
        saveProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const formData = new FormData(profileForm);

            // 获取表单数据
            const companyName = formData.get('companyName');
            const businessEmail = formData.get('businessEmail');
            const industry = formData.get('industry');
            const companyWebsite = formData.get('companyWebsite');
            const companyDescription = formData.get('companyDescription');
            const address = formData.get('address');
            const city = formData.get('city');
            const state = formData.get('state');
            const phone = formData.get('phone');

            // 获取错误显示元素
            const companyNameError = document.getElementById('companyName-error');
            const businessEmailError = document.getElementById('businessEmail-error');
            const industryError = document.getElementById('industry-error');
            const companyWebsiteError = document.getElementById('companyWebsite-error');
            const addressError = document.getElementById('address-error');
            const cityError = document.getElementById('city-error');
            const stateError = document.getElementById('state-error');
            const phoneError = document.getElementById('phone-error');

            // 清空错误信息
            companyNameError.textContent = '';
            businessEmailError.textContent = '';
            industryError.textContent = '';
            companyWebsiteError.textContent = '';
            addressError.textContent = '';
            cityError.textContent = '';
            stateError.textContent = '';
            phoneError.textContent = '';

            let isFormValid = true;

            // 公司名称校验
            try {
                checkString(companyName, "Company Name");
            } catch (e) {
                companyNameError.textContent = e;
                isFormValid = false;
            }

            // 企业邮箱校验
            try {
                checkEmail(businessEmail);
            } catch (e) {
                businessEmailError.textContent = e;
                isFormValid = false;
            }

            // 行业校验
            try {
                checkString(industry, "Industry");
            } catch (e) {
                industryError.textContent = e;
                isFormValid = false;
            }

            // 网站校验
            try {
                if (companyWebsite) {
                    checkURL(companyWebsite);
                }
            } catch (e) {
                companyWebsiteError.textContent = e;
                isFormValid = false;
            }

            // 地址校验
            try {
                checkString(address, "Address");
            } catch (e) {
                addressError.textContent = e;
                isFormValid = false;
            }

            // 城市校验
            try {
                checkString(city, "City");
            } catch (e) {
                cityError.textContent = e;
                isFormValid = false;
            }

            // 州/省校验
            try {
                checkString(state, "State");
            } catch (e) {
                stateError.textContent = e;
                isFormValid = false;
            }

            // 电话校验
            try {
                checkPhone(phone, "Phone");
            } catch (e) {
                phoneError.textContent = e;
                isFormValid = false;
            }

            // 如果表单有效则提交
            if (isFormValid) {
                profileForm.submit();
            } else {
                console.log('Business profile form has validation errors');
            }
        });
    }
});

// 校验函数 (与signup保持一致)
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

function checkURL(url) {
    if (!url) return;
    try {
        new URL(url);
    } catch (e) {
        throw 'Please enter a valid URL';
    }
    return url;
}