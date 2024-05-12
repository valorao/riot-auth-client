export function lastmatches() {
    const map_name = document.getElementById('map-name');
    const map_image = document.getElementById('map-image');
    const agent_name = document.getElementById('agent-name');
    const agent_image = document.getElementById('agent-image');
    const match_results = document.getElementById('match-results');
    const player_stats = document.getElementById('player-stats');

    try {
        fetch('https://apis.valorao.cloud/rso/player/last-matches')
        .then(response => response.json())
        .then(data => {
            map_name.textContent = data.matches.match1.mapInfo.mapName;
            map_image.src = data.matches.match1.mapInfo.mapListViewIcon;
            console.log(map_image.src)
            agent_name.textContent = data.matches.match1.agentInfo.agentName;
            agent_image.src = data.matches.match1.agentInfo.displayIcon;
            const red_team_score = data.matches.match1.matchData.score.RedTeamScore;
            const blue_team_score = data.matches.match1.matchData.score.blueTeamScore;
            match_results.textContent = red_team_score + ' x ' + blue_team_score;
            const kills = data.matches.match1.matchData.stats.kills;
            const deaths = data.matches.match1.matchData.stats.deaths;
            const assists = data.matches.match1.matchData.stats.assists;
            player_stats.textContent = kills + ' / ' + deaths + ' / ' + assists;

            console.log(data)
        })
    }
    catch (error) {
        console.error('Error:', error);
    }
}