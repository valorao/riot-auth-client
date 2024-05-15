export function login () {
    const skeleton = document.getElementById('skeletonBtn');
    const loginBtn = document.querySelector('.btn');
    const previousLocation = document.referrer;
    let redirect
    let callback
    if (previousLocation.includes('/account/pt-BR/beta/history/')) {
        redirect = 'history'
        callback = '/account/pt-BR/beta/history/'
    } else if (previousLocation.includes('/account/pt-BR/beta/')) {
        redirect = 'account'
        callback = '/account/pt-BR/beta/'
    } else {
        redirect = 'none'
    }
    
    loginBtn.style.display = 'none';
        fetch('http://localhost:5107/v1/riot/fromstatic/cookies').then(response => {
            if (response.status === 400) {
                if (redirect !== 'history' || redirect !== 'account') {
                    loginBtn.style.display = 'none';
                }
                if (redirect === 'history' || redirect === 'account') {
                    skeleton.style.display = 'none';
                    loginBtn.style.display = 'flex';
                }
            }
            if (response.status === 200) {
                if (redirect !== 'history' || redirect !== 'account') {
                    loginBtn.style.display = 'none';
                }
                if (redirect === 'history' || redirect === 'account') {
                window.location.href = `${callback}`;
                }
            }
            if (response.status === 403) {
                fetch('http://localhost:5107/v1/riot/auth/reauth').then(response => {
                    if (response.status === 400) {
                        skeleton.style.display = 'none';
                        loginBtn.style.display = 'flex';
                    }
                    if (response.status === 303) {
                        if (redirect !== 'none' || redirect !== 'noe') {
                            loginBtn.style.display = 'none';
                        }
                        window.location.href = `${callback}`;
                    }
            })
        }
        })
        if (redirect === 'history' || redirect === 'account') {
            let loginBtn = document.getElementById('loginBtn');
            let username = document.getElementById('usernameBox');
            let password = document.getElementById('passwordBox');
            loginBtn.onclick = function(event) {
                loginBtn.style.backgroundColor = '#a5a3a3';
                loginBtn.textContent = 'Conectando...';
                loginBtn.disabled = true;
                loginBtn.style.cursor = 'default';
                event.preventDefault();
                let user = username.value;
                let pass = password.value;
                if (user === '' || pass === '') {
                    loginBtn.style.backgroundColor = '#ff0000';
                    loginBtn.textContent = 'Insira um usuário e senha';
                    loginBtn.disabled = false;
                    setTimeout(() => {
                        loginBtn.style.backgroundColor = '';
                        loginBtn.textContent = 'Continuar com Riot Games';
                        let img = document.createElement('img');
                        img.src = 'https://cdn.valorao.cloud/images%2Friotlogo.png';
                        img.style.cursor = 'pointer';
                        loginBtn.appendChild(img);
                    }, 3000);
                    return;
                }
        
                const rememberCheckbox = document.getElementById('remember-me');
                const data = {
                    'username': user,
                    'password': pass
                };
                
                if (rememberCheckbox && rememberCheckbox.checked) {
                    data.remember = 'true';
                }
                if (!rememberCheckbox || !rememberCheckbox.checked) {
                    data.remember = 'false';
                }
        
                fetch('http://localhost:5107/v1/riot/auth', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(response => {
                    if (response.status === 403) {
                        loginBtn.style.backgroundColor = '#FFA500';
                        loginBtn.textContent = 'Desative a A2F para continuar.';
                        setTimeout(() => {
                            loginBtn.style.backgroundColor = '';
                            loginBtn.textContent = 'Continuar com Riot Games';
                            loginBtn.disabled = false;
                            loginBtn.style.cursor = 'pointer';
                        }, 3000);
                    }
                    if (response.status === 400 || response.status === 401 || response.status === 500) {
                        loginBtn.style.backgroundColor = '#ff0000';
                        loginBtn.textContent = 'Insira um usuário e senha.';
                        setTimeout(() => {
                            loginBtn.style.backgroundColor = '';
                            loginBtn.textContent = 'Continuar com Riot Games';
                            loginBtn.disabled = false;
                            loginBtn.style.cursor = 'pointer';
                        }, 3000);
                    }
                    if (response.status === 200) {
                        loginBtn.style.backgroundColor = '#00ff00';
                        loginBtn.textContent = 'Conectado';
        
                        window.location.href = `${callback}`;
                    }
                    return response.json();
                })
                .catch(error => console.error('Error:', error));
            }

        }
        if (redirect !== 'history' || redirect !== 'account') {
            loginBtn.style.display = 'none';
        }
    }
