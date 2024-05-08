window.onload = function() {
    let imgElement = document.getElementById('valorao-logo');
    imgElement.classList.add('img-loaded');
    let loginBtn = document.getElementById('loginBtn');
    let reauthBtn = document.getElementById('reauthBtn');
    let dodgeBtn = document.getElementById('dodgeBtn');
    let username = document.getElementById('usernameBox');
    let password = document.getElementById('passwordBox');
    let logoutBtn = document.getElementById('logoutBtn');
    const player_id_rank = document.getElementById('player-id-rank');
    const player_name = document.getElementById('player-name');
    const player_tagline = document.getElementById('player-tagline');
    const rank_name = document.getElementById('rank-tier-name');
    const rank_icon = document.getElementById('rank-tier-icon');
    player_id_rank.style.display = 'none';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fetch('/v1/riot/fromstatic/cookies')
    .then(response => response.json())
    .then(data => {
        if (data.puuid && data.ssid) {

            let cooldown = Number(localStorage.getItem('cooldown'));
            if (cooldown) {
                dodgeBtn.textContent = 'On Cooldown: ' + cooldown + 's';
                dodgeBtn.disabled = true;
                const intervalId = setInterval(() => {
                    cooldown--;
                    dodgeBtn.textContent = 'On Cooldown: ' + cooldown + 's';
                    localStorage.setItem('cooldown', cooldown);
                    if (cooldown === 0) {
                        clearInterval(intervalId);
                        dodgeBtn.disabled = false;
                        dodgeBtn.textContent = 'Dodge Queue';
                        localStorage.removeItem('cooldown');
                    }
                }, 1000);
            }

            document.getElementById('page-title').textContent = 'valorao - Control Panel';
            document.getElementById('loginBtn').disabled = true;
            document.getElementById('reauthBtn').disabled = false;
            document.getElementById('dodgeBtn').disabled = false;
            document.getElementById('logoutBtn').disabled = false;
            document.getElementById('reauthBtn').style.display = 'block';
            document.getElementById('dodgeBtn').style.display = 'block';
            document.getElementById('logoutBtn').style.display = 'block';
            loginBtn.style.backgroundColor = '#00ff00';
            loginBtn.textContent = 'Logged in';
            document.getElementById('password-inputbox').style.display = 'none';
            document.getElementById('username-inputbox').style.display = 'none';
            document.getElementById('remember-forgot').style.display = 'none';
            document.getElementById('create-account').style.display = 'none';
            loginBtn.style.cursor = 'default';

                fetch('/v1/riot/actions/player/rank', {
                    method: 'GET',
                }).then(response => {
                    if (response.status === 200) {
                        response.json().then(data => {
                            player_name.textContent = data.riotid;
                            player_tagline.textContent = '#' + data.tagline;
                            rank_name.textContent = data.tierName;
                            rank_icon.src = data.tierSmallIcon;
                            player_id_rank.style.display = '';
                            loginBtn.textContent = 'Logged in as: ' + data.riotid;
                        })
                        console.log(player_id_rank.textContent)
                    }
                })
        }
    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                loginBtn.textContent = 'Login';
                loginBtn.style.cursor = 'pointer';
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

        fetch('/v1/riot/auth/browser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
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
            return response.json(); // parse the body of the response
        })
        .catch(error => console.error('Error:', error));

    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    reauthBtn.onclick = function(event) {
        event.preventDefault();

        console.log('Sending fetch request to reauthenticate');

        fetch('/v1/riot/auth/reauth', {
            method: 'GET'
        }).then(response => {
            if (response.status === 303) {
                reauthBtn.style.backgroundColor = '#00ff00';
                reauthBtn.textContent = 'Cookie Reauthenticated';
                setTimeout(() => {
                    reauthBtn.style.backgroundColor = '';
                    reauthBtn.textContent = 'Reauth Cookies';
                }, 3000);
            }
            if (response.status === 400) {
                reauthBtn.style.backgroundColor = '#ff0000';
                reauthBtn.textContent = 'No Cookies to Reauth';
                setTimeout(() => {
                    reauthBtn.style.backgroundColor = '';
                    reauthBtn.textContent = 'Reauth Cookies';
                }, 3000);
            }
            return response.json(); // parse the body of the response
        })
        .catch(error => console.error('Error:', error));
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    dodgeBtn.onclick = function(event) {
        event.preventDefault();

        fetch('/v1/riot/actions/player/pregame/leave', {
            method: 'GET'
        }).then(response => {
            if (response.status === 204) {
                dodgeBtn.style.backgroundColor = '#00ff00';
                dodgeBtn.textContent = 'Queue Dodged.';
                dodgeBtn.style.backgroundColor = '#ffa500';
                let counter = 60;
                const intervalId = setInterval(() => {
                    counter--;
                    dodgeBtn.textContent = 'On Cooldown: ' + counter + 's';
                    dodgeBtn.style.cursor = 'default';
                    dodgeBtn.disabled = true;
                    localStorage.setItem('cooldown', counter);
                    if (counter === 0) {
                        clearInterval(intervalId);
                        dodgeBtn.disabled = false;
                        dodgeBtn.textContent = 'Dodge Queue';
                        localStorage.removeItem('cooldown');
                    }
                }, 1000);

                dodgeBtn.style.cursor = '';
                dodgeBtn.style.backgroundColor = '';
                dodgeBtn.disabled = true;
            }
            if (response.status === 404) {
                dodgeBtn.style.backgroundColor = '#ff0000';
                dodgeBtn.textContent = 'You are not in a pre-game.';
                dodgeBtn.style.cursor = 'default';
                dodgeBtn.disabled = true;
                setTimeout(() => {
                    dodgeBtn.style.backgroundColor = '';
                    dodgeBtn.textContent = 'Dodge Queue';
                    dodgeBtn.style.cursor = '';
                    dodgeBtn.disabled = false;
                }, 3000);
            }
        })
        .catch(error => console.error('Error:', error));
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        logoutBtn.onclick = function(event) {
        event.preventDefault();
        fetch('/v1/riot/fromstatic/logout', {  // Corrected line
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(data => {
            location.reload();
        });
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////