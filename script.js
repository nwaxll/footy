const API_KEY = "536baaa4fc0af696d005eaf5cc737bbf"; // put your key here

const matchesDiv = document.getElementById("matches");
const scoresSection = document.getElementById("scores");

document.getElementById("loadScores").addEventListener("click", loadScores);

document.getElementById("highlights").addEventListener("click", () => {
    alert("Highlights page coming soon (YouTube links)");
});

// League IDs (API-Football)
const LEAGUES = {
    "World Cup": 1,
    "Champions League": 2,
    "Premier League": 39,
    "La Liga": 140
};

async function loadScores() {
    scoresSection.style.display = "block";
    matchesDiv.innerHTML = "Loading live matches...";

    let html = "";

    for (const [leagueName, leagueId] of Object.entries(LEAGUES)) {
        const response = await fetch(
            `https://v3.football.api-sports.io/fixtures?live=all&league=${leagueId}`,
            {
                headers: {
                    "x-apisports-key": API_KEY
                }
            }
        );

        const data = await response.json();

        data.response.forEach(match => {
            html += `
                <div class="match">
                    <div>
                        <strong>${match.teams.home.name}</strong>
                        vs
                        <strong>${match.teams.away.name}</strong>
                        <div class="league">${leagueName}</div>
                    </div>
                    <div>
                        ${match.goals.home} - ${match.goals.away}
                    </div>
                </div>
            `;
        });
    }

    matchesDiv.innerHTML = html || "No live matches right now.";
}
