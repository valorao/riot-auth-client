export function lastmatches() {
    try {
        fetch('/v1/riot/player/last-matches', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => {
            if(response.status === 400 || response.status === 401) {
                window.location.href = `/account/pt-BR/beta/auth/?redirect=${window.location.pathname}`;
            }
            return response.json();
        })
        .then(data => {
            const matchKeys = Object.keys(data.matches);
            
            for(let i = 0; i < matchKeys.length; i++) {
                const match = data.matches[matchKeys[i]];
                const map_name = document.getElementById('match-' + (i+1) + '-map');
                const map_image = document.getElementById('match-' + (i+1) + '-map-img');
                const agent_image = document.getElementById('match-' + (i+1) + '-agent-img');
                const match_results = document.getElementById('match-' + (i+1) + '-score');
                const player_stats = document.getElementById('match-' + (i+1) + '-kda');
                const game_mode = document.getElementById('match-' + (i+1) + '-gamemode');

                map_name.textContent = match.mapInfo.mapName;
                map_image.src = match.mapInfo.mapListViewIcon;
                agent_image.src = match.agentInfo.displayIcon;
                if (match.matchData.gamemode === 'Deathmatch') {
                    game_mode.textContent = 'Deathmatch';
                    const kills = match.matchData.stats.kills;
                    const deaths = match.matchData.stats.deaths;
                    const assists = match.matchData.stats.assists;
                    player_stats.textContent = kills + ' / ' + deaths + ' / ' + assists;
                    match_results.textContent = '';
                    
                    for (let i = matchKeys.length + 1; i <= 5; i++) {
                        const match = document.getElementById('match-' + i);
                        if (match) {
                            match.style.display = 'none';
                        }
                    }
                }
                else if (match.matchData.gamemode === 'Standard') {
                    const red_team_score = match.matchData.score.RedTeamScore;
                    const blue_team_score = match.matchData.score.blueTeamScore;
                    match_results.textContent = red_team_score + ' x ' + blue_team_score;
                    const kills = match.matchData.stats.kills;
                    const deaths = match.matchData.stats.deaths;
                    const assists = match.matchData.stats.assists;
                    player_stats.textContent = kills + ' / ' + deaths + ' / ' + assists;
                    for (let i = matchKeys.length + 1; i <= 5; i++) {
                        const match = document.getElementById('match-' + i);
                        if (match) {
                            match.style.display = 'none';
                        }
                    }
                }
            }
            document.querySelectorAll('.skeleton').forEach(element => {
                element.classList.remove('skeleton');
            });
            let images = document.querySelectorAll('img');
            let imagesLoaded = 0;

            images.forEach(img => {
                img.onload = () => {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        const h1 = document.createElement('h1');
                        h1.textContent = 'Match History';
                        document.getElementById('title').appendChild(h1);
                        var element = document.querySelector('.skeleton-text');
                        element.remove();
                    }
                };
            });


            console.log(data)
        })
    }
    catch (error) {
        console.error('Error:', error);
    }
}