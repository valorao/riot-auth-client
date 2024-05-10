import { lastmatches } from "./lastmatches.js";

export function checkCookies() {
    try {
        const player_id_rank = document.getElementById('player-id-rank');
        const player_name = document.getElementById('player-name');
        const player_tagline = document.getElementById('player-tagline');
        const rank_name = document.getElementById('rank-tier-name');
        const rank_icon = document.getElementById('rank-tier-icon');
        const player_banner_img = document.getElementById('player-banner-img');
        const page_title = document.getElementById('page-title')
        const dodgeBtn = document.getElementById('dodgeBtn');
        fetch('/v1/riot/fromstatic/cookies')
        .then(response => response.json())
        .then(data => {
            if (data.puuid && data.ssid) {
                const endTime = localStorage.getItem('cooldownEnd');
                if (endTime && Date.now() < endTime) {
                    dodgeBtn.disabled = true;
                    dodgeBtn.style.cursor = 'default';
                    dodgeBtn.style.backgroundColor = '#ffa500';
                    const intervalId = setInterval(() => {
                        const remainingTime = Math.round((endTime - Date.now()) / 1000);
                        if (remainingTime <= 0) {
                            clearInterval(intervalId);
                            dodgeBtn.disabled = false;
                            dodgeBtn.style.backgroundColor = '';
                            dodgeBtn.textContent = 'Sair do pré-jogo';
                            dodgeBtn.style.cursor = '';
                            localStorage.removeItem('cooldownEnd');
                        } else {
                            dodgeBtn.textContent = 'Aguarde: ' + remainingTime + 's';
                        }
                    }, 1000);
                }
                lastmatches();
                document.getElementById('loginBtn').disabled = true;
                document.getElementById('reauthBtn').disabled = false;
                document.getElementById('dodgeBtn').disabled = false;
                document.getElementById('logoutBtn').disabled = false;
                document.getElementById('reauthBtn').style.display = 'block';
                document.getElementById('dodgeBtn').style.display = 'block';
                document.getElementById('logoutBtn').style.display = 'block';
                loginBtn.style.backgroundColor = '#005400';
                loginBtn.textContent = 'Conectado';
                document.getElementById('password-inputbox').style.display = 'none';
                document.getElementById('username-inputbox').style.display = 'none';
                document.getElementById('remember-forgot').style.display = 'none';
                document.getElementById('create-account').style.display = 'none';
                loginBtn.style.cursor = 'default';
    
                    fetch('/v1/riot/actions/player/rank', {
                        method: 'GET',
                    }).then(response => {
                        if (response.status === 401) {
                            response.json().then(data => {
                                player_name.textContent = 'Refaça o Login ou atualize os cookies.';
                            })
                        }
                        if (response.status === 200) {
                            response.json().then(data => {
                                player_name.textContent = data.riotid;
                                player_tagline.textContent = '#' + data.tagline;
                                player_banner_img.src = data.bannerimg;
                                rank_name.textContent = data.tierName;
                                rank_icon.src = data.tierSmallIcon;
                                player_id_rank.style.display = '';
                                loginBtn.textContent = 'Conectado como: ' + data.riotid;
                                page_title.textContent = 'valorao - ' + "Perfil de: " + data.riotid;
                                
                            })
                        }
                    })
            }
        });
    }
    catch (error) {
        console.error('Error:', error);
    }
}