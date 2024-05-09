export function reauth () {
    try {
        reauthBtn.onclick = function(event) {
            event.preventDefault();
    
            fetch('/v1/riot/auth/reauth', {
                method: 'GET'
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
                    reauthBtn.textContent = 'No Cookies to Reauth';
                    setTimeout(() => {
                        reauthBtn.style.backgroundColor = '';
                        reauthBtn.textContent = 'Reauth Cookies';
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