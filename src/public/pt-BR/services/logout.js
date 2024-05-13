export function logout () {
    let logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.onclick = function(event) {
        event.preventDefault();
        fetch('https://apis.valorao.cloud/rso/fromstatic/logout', {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => response.text())
        .then(data => {
            location.reload();
        });
    }
}