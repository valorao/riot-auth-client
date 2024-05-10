import { checkCookies } from './services/checkcookies.js';
import { login } from './services/login.js';
import { reauth } from './services/reauth.js';
import { dodge } from './services/dodgeservice.js';
import { logout } from './services/logout.js';
    let imgElement = document.getElementById('valorao-logo');
    imgElement.classList.add('img-loaded');
    const player_id_rank = document.getElementById('player-id-rank');
    player_id_rank.style.display = 'none';

    checkCookies();
    login();
    reauth();
    dodge();
    logout();