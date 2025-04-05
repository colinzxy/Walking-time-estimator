function calculateTime() {
    const distance = parseFloat(document.getElementById('distance').value);
    const ascent = parseFloat(document.getElementById('ascent').value);
    const descent = parseFloat(document.getElementById('descent').value);
    const userPace = parseFloat(document.getElementById('pace').value);

    if (isNaN(distance) || isNaN(ascent) || isNaN(descent)) {
        document.getElementById('result').textContent = "Please fill in all required fields.";
        return;
    }

    // Use user pace if provided, otherwise default to 12 min/km
    const pace = userPace || 12;
    const flatSpeedKph = 60 / pace; // Convert min/km to km/h

    // Base time on flat ground
    let timeMinutes = (distance / flatSpeedKph) * 60;

    // Naismith ascent: +10 min per 100m
    timeMinutes += (ascent / 600) * 60;

    // Langmuir descent correction
    const descentPerKm = descent / distance; // m/km

    if (descentPerKm > 100) {
        // Steep (>12%)
        timeMinutes += (descent / 300) * 20;
    } else if (descentPerKm > 50) {
        // Moderate (5–12%)
        timeMinutes += (descent / 300) * 10;
    }
    // else: gentle descent, no added time

    const hours = Math.floor(timeMinutes / 60);
    const minutes = Math.round(timeMinutes % 60);

    document.getElementById('result').textContent = `Estimated time: ${hours}h ${minutes}m`;
}
