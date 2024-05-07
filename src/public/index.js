window.onload = function() {
    let loginBtn = document.getElementById('loginBtn');
    let reauthBtn = document.getElementById('reauthBtn');
    let username = document.getElementById('usernameBox');
    let password = document.getElementById('passwordBox');

    let cookies = document.cookie;
    console.log(cookies);

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

        fetch('http://localhost:5107/v1/riot/actions/ping', {
            method: 'GET',
            headers: {
                'username': user,
                'password': pass
            },
        }).then(response => {
            console.log(response);
            if (response.status === 303) {
                loginBtn.style.backgroundColor = '#00ff00';
                loginBtn.textContent = 'Logged in.';
                setTimeout(() => {
                    loginBtn.style.backgroundColor = '';
                    loginBtn.textContent = 'Login';
                }, 3000);
            }
            return response.json(); // parse the body of the response
        })
        .catch(error => console.error('Error:', error));

    }

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
}