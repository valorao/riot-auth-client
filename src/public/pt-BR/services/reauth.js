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
                    reauthBtn.textContent = 'Cookies Atualizados';
                    setTimeout(() => {
                        reauthBtn.style.backgroundColor = '';
                        reauthBtn.textContent = 'Atualizar Cookies';
                    }, 3000);
                }
                if (response.status === 400) {
                    reauthBtn.style.backgroundColor = '#ff0000';
                    reauthBtn.textContent = "Sessão Expirada - Refaça o Login. Você será desconectado.";
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