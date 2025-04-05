let breakdown = null;

function calculateTime() {
    const distance = parseFloat(document.getElementById('distance').value);
    const ascent = parseFloat(document.getElementById('ascent').value);
    const descent = parseFloat(document.getElementById('descent').value);
    const userPace = parseFloat(document.getElementById('pace').value);
    const breakTime = parseFloat(document.getElementById('break').value) || 0;

    if (isNaN(distance) || isNaN(ascent) || isNaN(descent)) {
        document.getElementById('result').textContent = "Please fill in all required fields.";
        breakdown = null;
        return;
    }

    const pace = userPace || 12;
    const flatSpeedKph = 60 / pace;

    // Flat ground time
    const flatMinutes = (distance / flatSpeedKph) * 60;

    // Ascent time (Naismith): 10 min per 100m = 1 hr per 600m
    const ascentMinutes = (ascent / 600) * 60;

    // Descent time (Langmuir adjustment)
    const descentPerKm = descent / distance;
    let descentMinutes = 0;
    if (descentPerKm > 100) {
        descentMinutes = (descent / 300) * 20;
    } else if (descentPerKm > 50) {
        descentMinutes = (descent / 300) * 10;
    }

    const totalMinutes = flatMinutes + ascentMinutes + descentMinutes + breakTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    // Save breakdown
    breakdown = {
        pace,
        flatMinutes: flatMinutes.toFixed(1),
        ascentMinutes: ascentMinutes.toFixed(1),
        descentMinutes: descentMinutes.toFixed(1),
        breakTime: breakTime.toFixed(1),
        totalMinutes: totalMinutes.toFixed(1),
    };

    document.getElementById('result').textContent = `Estimated time: ${hours}h ${minutes}m`;
    document.getElementById('details').innerHTML = ""; // clear any old details
}

function showDetails() {
    if (!breakdown) {
        document.getElementById('details').textContent = "Please calculate first.";
        return;
    }

    const d = breakdown;
    document.getElementById('details').innerHTML = `
        <p>Flat time: ${d.flatMinutes} minutes (at ${d.pace} min/km)</p>
        <p>Ascent time: ${d.ascentMinutes} minutes (Naismith's Rule)</p>
        <p>Descent time: ${d.descentMinutes} minutes (Langmuir correction)</p>
        <p>Break time: ${d.breakTime} minutes</p>
        <p><strong>Total: ${d.totalMinutes} minutes</strong></p>
    `;
}

function resetAll() {
    document.getElementById('result').textContent = "";
    document.getElementById('details').textContent = "";
    document.getElementById('details').innerHTML = "";
    breakdown = null;
}
