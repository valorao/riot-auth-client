export function logout () {
    let logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.onclick = function(event) {
        event.preventDefault();
        fetch('/v1/riot/fromstatic/logout', {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(data => {
            location.reload();
        });
    }
}