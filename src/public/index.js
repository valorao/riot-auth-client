window.onload = function() {
    let imgElement = document.getElementById('valorao-logo');
    imgElement.classList.add('img-loaded');
    let loginBtn = document.getElementById('loginBtn');
    let reauthBtn = document.getElementById('reauthBtn');
    let dodgeBtn = document.getElementById('dodgeBtn');
    let username = document.getElementById('usernameBox');
    let password = document.getElementById('passwordBox');
    let logoutBtn = document.getElementById('logoutBtn');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fetch('/v1/riot/fromstatic/cookies')
    .then(response => response.json())
    .then(data => {
        if (data.puuid && data.otherCookie) {

            document.getElementById('page-title').textContent = 'valorao - Control Panel';
            document.getElementById('loginBtn').disabled = true;
            document.getElementById('reauthBtn').disabled = false;
            document.getElementById('dodgeBtn').disabled = false;
            document.getElementById('logoutBtn').disabled = false;
            document.getElementById('reauthBtn').style.display = 'block';
            document.getElementById('dodgeBtn').style.display = 'block';
            document.getElementById('logoutBtn').style.display = 'block';
            loginBtn.style.backgroundColor = '#00ff00';
            loginBtn.textContent = 'Logged in.';
            document.getElementById('password-inputbox').style.display = 'none';
            document.getElementById('username-inputbox').style.display = 'none';
            document.getElementById('remember-forgot').style.display = 'none';
            document.getElementById('create-account').style.display = 'none';
        }
    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    loginBtn.onclick = function(event) {
        event.preventDefault();
        let user = username.value;
        let pass = password.value;
        if (user === '' || pass === '') {
            loginBtn.style.backgroundColor = '#ff0000';
            loginBtn.textContent = 'Enter a Username and Password';
            setTimeout(() => {
                loginBtn.style.backgroundColor = '';
                loginBtn.textContent = 'Login';
            }, 3000);
            return;
        }

        console.log('Sending fetch request with username and password');

        fetch('/v1/riot/auth/browser', {
            method: 'GET',
            headers: {
                'username': user,
                'password': pass
            },
        }).then(response => {
            if (response.status === 400) {
                loginBtn.style.backgroundColor = '#ff0000';
                loginBtn.textContent = 'Invalid Username or Password';
                setTimeout(() => {
                    loginBtn.style.backgroundColor = '';
                    loginBtn.textContent = 'Login';
                }, 3000);
            }
            if (response.status === 200) {
                loginBtn.style.backgroundColor = '#00ff00';
                loginBtn.textContent = 'Logged in.';

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

        console.log('Sending fetch request to reauthenticate');

        fetch('/v1/riot/actions/player/pregame/leave', {
            method: 'GET'
        }).then(response => {
            if (response.status === 204) {
                dodgeBtn.style.backgroundColor = '#00ff00';
                dodgeBtn.textContent = 'Queue Dodged.';
                setTimeout(() => {
                    dodgeBtn.style.backgroundColor = '';
                    dodgeBtn.textContent = 'Dodge Queue';
                }, 3000);
            }
            if (response.status === 404) {
                dodgeBtn.style.backgroundColor = '#ff0000';
                dodgeBtn.textContent = 'You are not in a pre-game.';
                setTimeout(() => {
                    dodgeBtn.style.backgroundColor = '';
                    dodgeBtn.textContent = 'Dodge Queue';
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