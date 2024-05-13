export function reauth () {
    try {
        reauthBtn.onclick = function(event) {
            event.preventDefault();
    
            fetch('https://apis.valorao.cloud/rso/auth/reauth', {
                method: 'GET',
                credentials: 'include'
            }).then(response => {
                if (response.status === 303) {
                    reauthBtn.style.backgroundColor = '#005400';
                    reauthBtn.textContent = 'Cookie Reauthenticated';
                    setTimeout(() => {
                        reauthBtn.style.backgroundColor = '';
                        reauthBtn.textContent = 'Reauth Cookies';
                    }, 3000);
                }
                if (response.status === 400) {
                    reauthBtn.style.backgroundColor = '#ff0000';
                    reauthBtn.textContent = "Session Expired - Please login again. You'll be disconnected";
                    setTimeout(() => {
                        fetch('https://apis.valorao.cloud/rso/fromstatic/logout', {
                            method: 'GET',
                            credentials: 'include'
                        }).then(response => {
                            if (response.status === 204) {
                                window.location.reload();
                            }
                            if (response.status === 404) {
                                window.location.reload();
                            }
                        })
                    }, 3000);
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