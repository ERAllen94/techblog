async function signupFormHandler(event) {
    event.preventDefault();

const username = document.querySelector('#username-signup').value.trim();
const email = document.querySelector('#email-signup').value.trim();
const password = document.querySelector('#password-signup').value.trim();
console.log(username,email,password,'hi');
if (username && email && password) {
    const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
            username,
            email,
            password   
        }),
        headers: { 'Content-Type': 'application/json'}
    });
    console.log('hello',response)
    if (response.ok) {
        const login = await fetch('/api/users/login',{
            method: 'post',
            body: JSON.stringify({
                'username': username,
                'password': password

            }),
            headers: { 'Content-Type': 'application/json'}
        });
        if (login.ok) {
            setTimeout(() => {document.location.replace('/dashboard') }, 200);
        }
console.log('sup')
    } else {
        console.log('i hit the else')
        alert(response.statusText);
    }
}

}

async function loginFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    if (username && password) {
        const login = await fetch('/api/users/login',{
            method: 'post',
            body: JSON.stringify({
                'username': username,
                'password': password

            }),
            headers: { 'Content-Type': 'application/json'}
        });
        if (login.ok) {
            setTimeout(() => {document.location.replace('/dashboard') }, 200);
        } else{
            alert(response.statusText);
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);