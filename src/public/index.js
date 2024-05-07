window.onload = function() {
    let loginBtn = document.getElementById('loginBtn');
    let reauthBtn = document.getElementById('reauthBtn');
    let dodgeBtn = document.getElementById('dodgeBtn');
    let username = document.getElementById('usernameBox');
    let password = document.getElementById('passwordBox');
    let logoutBtn = document.getElementById('logoutBtn');

    let cookies = document.cookie;
    console.log(cookies);
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

        fetch('http://localhost:5107/v1/riot/auth/browser', {
            method: 'GET',
            headers: {
                'username': user,
                'password': pass
            },
        }).then(response => {
            console.log(response);
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

                document.getElementById('reauthBtn').disabled = false;
                document.getElementById('dodgeBtn').disabled = false;
                document.getElementById('logoutBtn').disabled = false;
                document.getElementById('reauthBtn').style.display = 'block';
                document.getElementById('dodgeBtn').style.display = 'block';
                document.getElementById('logoutBtn').style.display = 'block';
    
            }
            return response.json(); // parse the body of the response
        })
        .catch(error => console.error('Error:', error));

    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    reauthBtn.onclick = function(event) {
        event.preventDefault();

        console.log('Sending fetch request to reauthenticate');

        fetch('http://localhost:5107/v1/riot/auth/reauth', {
            method: 'GET'
        }).then(response => {
            console.log(response);
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

        fetch('http://localhost:5107/v1/riot/auth/with/cookies/actions/player/pregame/leave', {
            method: 'GET'
        }).then(response => {
            console.log(response);
            if (response.status === 204) {
                dodgeBtn.style.backgroundColor = '#00ff00';
                dodgeBtn.textContent = 'Queue Dodged.';
                setTimeout(() => {
                    dodgeBtn.style.backgroundColor = '';
                    dodgeBtn.textContent = 'Dodge Queue';
                }, 3000);
            }
            if (response.status === 400) {
                dodgeBtn.style.backgroundColor = '#ff0000';
                dodgeBtn.textContent = 'You are not in a pre-game.';
                setTimeout(() => {
                    dodgeBtn.style.backgroundColor = '';
                    dodgeBtn.textContent = 'Dodge Queue';
                }, 3000);
            }
            return response.json(); // parse the body of the response
        })
        .catch(error => console.error('Error:', error));
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    logoutBtn.onclick = function(event) {
    event.preventDefault();

    // Delete cookies
    document.cookie.split(";").forEach((c) => {
        document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Hide the other buttons
    document.getElementById('reauthBtn').style.display = 'none';
    document.getElementById('dodgeBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';

    // Reset the login button
    loginBtn.style.backgroundColor = '';
    loginBtn.textContent = 'Login';
    }
}