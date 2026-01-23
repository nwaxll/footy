// ===============================
// CONFIG
// ===============================
const API_KEY = "536baaa4fc0af696d005eaf5cc737bbf";
const SEASON = 2025;

// League IDs
const LEAGUES = [
    1,    // World Cup
    2,    // Champions League
    39,   // Premier League
    140   // La Liga
];

// ===============================
// DOM ELEMENTS
// ===============================
const liveDiv = document.getElementById("liveMatches");
const upcomingDiv = document.getElementById("upcomingMatches");
const pastDiv = document.getElementById("pastMatches");

// ===============================
// DATE HELPERS
// ===============================
const today = new Date();

const pastDate = new Date();
pastDate.setDate(today.getDate() - 10);

const futureDate = new Date();
futureDate.setDate(today.getDate() + 10);

const formatDate = date => date.toISOString().split("T")[0];

// ===============================
// INIT
// ===============================
loadAll();

// ===============================
// CORE FUNCTIONS
// ===============================
async function fetchMatches(url) {
    try {
        const res = await fetch(url, {
            headers: {
                "x-apisports-key": API_KEY
            }
        });

        const data = await res.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error("API ERROR:", data.errors);
            return [];
        }

        return data.response || [];
    } catch (err) {
        console.error("FETCH FAILED:", err);
        return [];
    }
}

async function loadAll() {
    await loadLive();
    await loadUpcoming();
    await loadPast();
}

// ===============================
// LIVE MATCHES
// ===============================
async function loadLive() {
    liveDiv.innerHTML = "Loading live matches...";
    let html = "";

    for (const league of LEAGUES) {
        const matches = await fetchMatches(
            `https://v3.football.api-sports.io/fixtures?live=all&league=${league}`
        );

        matches.forEach(m => html += matchHTML(m));
    }

    liveDiv.innerHTML = html || "No live matches right now.";
}

// ===============================
// UPCOMING MATCHES (NEXT 10 DAYS)
// ===============================
async function loadUpcoming() {
    upcomingDiv.innerHTML = "Loading upcoming matches...";
    let html = "";

    for (const league of LEAGUES) {
        const matches = await fetchMatches(
            `https://v3.football.api-sports.io/fixtures?league=${league}&season=${SEASON}&from=${formatDate(today)}&to=${formatDate(futureDate)}`
        );

        matches.forEach(m => html += matchHTML(m, true));
    }

    upcomingDiv.innerHTML = html || "No upcoming matches.";
}

// ===============================
// PAST MATCHES (LAST 10 DAYS)
// ===============================
async function loadPast() {
    pastDiv.innerHTML = "Loading past matches...";
    let html = "";

    for (const league of LEAGUES) {
        const matches = await fetchMatches(
            `https://v3.football.api-sports.io/fixtures?league=${league}&season=${SEASON}&from=${formatDate(pastDate)}&to=${formatDate(today)}&status=FT`
        );

        matches.forEach(m => html += matchHTML(m));
    }

    pastDiv.innerHTML = html || "No recent matches.";
}

// ===============================
// MATCH CARD TEMPLATE
// ===============================
function matchHTML(match, upcoming = false) {
    const time = match.fixture.date.split("T")[1].slice(0, 5);

    const score = upcoming
        ? time
        : `${match.goals.home} - ${match.goals.away}`;

    return `
        <div class="match">
            <div>
                <strong>${match.teams.home.name}</strong>
                vs
                <strong>${match.teams.away.name}</strong>
                <div class="league">${match.league.name}</div>
            </div>
            <div>${score}</div>
        </div>
    `;
}
