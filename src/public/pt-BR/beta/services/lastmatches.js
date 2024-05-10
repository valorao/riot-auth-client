export function lastmatches() {
    const map_name = document.getElementById('map-name');
    const map_image = document.getElementById('map-image');
    const agent_name = document.getElementById('agent-name');
    const agent_image = document.getElementById('agent-image');
    const match_results = document.getElementById('match-results');
    const player_stats = document.getElementById('player-stats');

    try {
        fetch('/v1/riot/dev/player/last-matches')
        .then(response => response.json())
        .then(data => {
            map_name.textContent = data.match1.mapInfo.mapName;
            map_image.src = data.match1.mapInfo.mapListViewIcon;
            console.log(map_image.src)
            agent_name.textContent = data.match1.agentInfo.agentName;
            agent_image.src = data.match1.agentInfo.displayIcon;
            const red_team_score = data.match1.score.RedTeamScore;
            const blue_team_score = data.match1.score.blueTeamScore;
            match_results.textContent = red_team_score + ' x ' + blue_team_score;
            const kills = data.match1.stats.kills;
            const deaths = data.match1.stats.deaths;
            const assists = data.match1.stats.assists;
            player_stats.textContent = kills + ' / ' + deaths + ' / ' + assists;

            console.log(data)
        })
    }
    catch (error) {
        console.error('Error:', error);
    }
}