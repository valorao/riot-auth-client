export function login () {
    try {
        let loginBtn = document.getElementById('loginBtn');
        let username = document.getElementById('usernameBox');
        let password = document.getElementById('passwordBox');
        loginBtn.onclick = function(event) {
            loginBtn.style.backgroundColor = '#a5a3a3';
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;
            loginBtn.style.cursor = 'default';
            event.preventDefault();
            let user = username.value;
            let pass = password.value;
            if (user === '' || pass === '') {
                loginBtn.style.backgroundColor = '#ff0000';
                loginBtn.textContent = 'Enter a Username and Password';
                loginBtn.disabled = false;
                setTimeout(() => {
                    loginBtn.style.backgroundColor = '';
                    loginBtn.textContent = 'Login with Riot Games';
                    let img = document.createElement('img');
                    img.src = 'https://cdn.valorao.cloud/images%2Friotlogo.png';
                    img.style.cursor = 'pointer';
                    loginBtn.appendChild(img);
                }, 3000);
                return;
            }
    
            var rememberCheckbox = document.getElementById('remember-me');
            var data = {
                'username': user,
                'password': pass
            };
            
            if (rememberCheckbox && rememberCheckbox.checked) {
                data.remember = 'true';
            }
            if (!rememberCheckbox || !rememberCheckbox.checked) {
                data.remember = 'false';
            }
    
            fetch('/v1/riot/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.status === 403) {
                    loginBtn.style.backgroundColor = '#FFA500';
                    loginBtn.textContent = 'Disable MFA to continue.';
                    setTimeout(() => {
                        loginBtn.style.backgroundColor = '';
                        loginBtn.textContent = 'Login';
                        loginBtn.disabled = false;
                        loginBtn.style.cursor = 'pointer';
                    }, 3000);
                }
                if (response.status === 400) {
                    loginBtn.style.backgroundColor = '#ff0000';
                    loginBtn.textContent = 'Invalid Username or Password';
                    setTimeout(() => {
                        loginBtn.style.backgroundColor = '';
                        loginBtn.textContent = 'Login';
                        loginBtn.disabled = false;
                        loginBtn.style.cursor = 'pointer';
                    }, 3000);
                }
                if (response.status === 200) {
                    loginBtn.style.backgroundColor = '#00ff00';
                    loginBtn.textContent = 'Logged in';
    
                    location.reload();
                }
                return response.json();
            })
            .catch(error => console.error('Error:', error));
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
