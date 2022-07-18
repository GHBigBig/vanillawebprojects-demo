// function validate () {
//     let username = document.getElementById('username').value;
//     let email = document.getElementById('email').value;
//     let password = document.getElementById('password').value;
//     let confirmPassword = document.getElementById('confirmPassword').value;

//     //用户名 字母开头，长度6-12位
//     let usernameRes = /^[a-zA-Z][\w]{5,11}$/.test(username);
//     //邮箱 xxx@xx.com
//     let emailRes = /^[\w]+@[\w]+\.[\w]{1,3}$/.test(email);
//     //密码  长度6~15，必须是字母+数字
//     let passwordRes = /^((?<=[0-9])[a-zA-Z])((?<=[a-zA-Z])[0-9])[0-9a-zA-Z]{6-15}$/.test(password);
//     //第二次输入的密码应该与第一次输入的密码相等
//     let confirmPasswordRes = confirmPassword === password;

//     if(!usernameRes) {
//         console.debug(`用户名：${username}输入非法：用户名应该以字母开头并且长度在6-12位`);
//     }
//     if(!emailRes) {
//         console.debug(`邮箱：${email}输入非法：请检查格式`);
//     }
//     if(!passwordRes) {
//         console.debug(`密码：${password}输入非法：密码应该包含字母和数字并且长度在6-15位`);
//     }
//     if(!confirmPasswordRes) {
//         console.debug(`密码：${confirmPassword}确认错误：请保存两次输入的密码一致`);
//     }
// }

const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const form = document.getElementById('form');

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function showError(input, msg) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';
    const small = formControl.querySelector('small');
    small.innerText = msg;
}

function checkEmail(input, msg) {
    const emailRes = /^[\w]+@[\w]+\.[\w]{1,3}$/;
    if(emailRes.test(input.value.trim())) {
        showSuccess(input);
    }else {
        showError(input, `邮箱格式无效！！！`);
    }
}

function checkLength(input, min, max) {
    if(input.value.trim().length < min) {
        showError(input, `${getFieldName(input)} 的长度不应小于 ${min}！！！`);
    }else if(input.value.trim().length > max) {
        showError(input, `${getFieldName(input)} 的长度不应大于 ${max}！！！`);
    }else {
        showSuccess(input);
    }
}

function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function checkRequire(items) {
    let require = true;
    items.forEach(item => {
        if(item.value.trim() === '') {
            showError(item, `${getFieldName(item)} 为必填项！！！`);
            require = false;
        }else {
            showSuccess(item);
        }
    });
    return require;
}

function checkPasswordMatch() {
    debugger
    if(password.value.trim() === confirmPassword.value.trim()) {
        showSuccess(confirmPassword);
    }else {
        showError(confirmPassword, `两次密码不匹配！！！`);
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();

    if(checkRequire([username, email, password, confirmPassword])) {
        checkLength(username, 2, 8);
        checkLength(password, 6, 15);
        checkEmail(email);
        checkPasswordMatch();
    }
});