let breakdown = null;

function toggleMode() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    document.getElementById('manualInput').style.display = mode === 'manual' ? 'block' : 'none';
    document.getElementById('gpxInput').style.display = mode === 'gpx' ? 'block' : 'none';
}

function resetAll() {
    document.getElementById('result').textContent = "";
    document.getElementById('details').textContent = "";
    document.getElementById('details').innerHTML = "";
    breakdown = null;
}

function showDetails() {
    if (!breakdown) {
        document.getElementById('details').textContent = "Please calculate first.";
        return;
    }

    const d = breakdown;
    document.getElementById('details').innerHTML = `
        <p>Flat time: ${d.flatMinutes} minutes (at ${d.pace} min/km)</p>
        <p>Ascent time: ${d.ascentMinutes} minutes</p>
        <p>Descent time: ${d.descentMinutes} minutes</p>
        <p>Break time: ${d.breakTime} minutes</p>
        <p><strong>Total: ${d.totalMinutes} minutes</strong></p>
    `;
}

function calculateTime() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    if (mode === 'manual') {
        return calculateManual();
    } else {
        return calculateFromGPX();
    }
}

function calculateManual() {
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
    const flatMinutes = (distance / flatSpeedKph) * 60;
    const ascentMinutes = (ascent / 600) * 60;

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

    breakdown = {
        pace,
        flatMinutes: flatMinutes.toFixed(1),
        ascentMinutes: ascentMinutes.toFixed(1),
        descentMinutes: descentMinutes.toFixed(1),
        breakTime: breakTime.toFixed(1),
        totalMinutes: totalMinutes.toFixed(1),
    };

    document.getElementById('result').textContent = `Estimated time: ${hours}h ${minutes}m`;
    document.getElementById('details').innerHTML = "";
}

function calculateFromGPX() {
    const fileInput = document.getElementById('gpxFile');
    const file = fileInput.files[0];
    const userPace = parseFloat(document.getElementById('pace').value) || 12;
    const breakTime = parseFloat(document.getElementById('break').value) || 0;

    if (!file) {
        document.getElementById('result').textContent = "Please upload a GPX file.";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, "application/xml");
        const trkpts = xml.getElementsByTagName("trkpt");

        if (trkpts.length < 2) {
            document.getElementById('result').textContent = "Not enough data in GPX file.";
            return;
        }

        let totalDistance = 0;
        let totalAscent = 0;
        let totalDescent = 0;

        const elevations = [];
        const coords = [];

        for (let i = 0; i < trkpts.length; i++) {
            const lat = parseFloat(trkpts[i].getAttribute("lat"));
            const lon = parseFloat(trkpts[i].getAttribute("lon"));
            const ele = parseFloat(trkpts[i].getElementsByTagName("ele")[0]?.textContent || "0");

            elevations.push(ele);
            coords.push({ lat, lon });
        }

        for (let i = 1; i < coords.length; i++) {
            const d = haversine(coords[i - 1], coords[i]);
            totalDistance += d;

            const eleDiff = elevations[i] - elevations[i - 1];
            if (eleDiff > 0) {
                totalAscent += eleDiff;
            } else {
                totalDescent += Math.abs(eleDiff);
            }
        }

        const pace = userPace;
        const flatSpeedKph = 60 / pace;
        const flatMinutes = (totalDistance / flatSpeedKph) * 60;
        const ascentMinutes = (totalAscent / 600) * 60;

        // Steeper slope handling per segment is possible here in future improvements
        const descentPerKm = totalDescent / totalDistance;
        let descentMinutes = 0;
        if (descentPerKm > 100) {
            descentMinutes = (totalDescent / 300) * 20;
        } else if (descentPerKm > 50) {
            descentMinutes = (totalDescent / 300) * 10;
        }

        const totalMinutes = flatMinutes + ascentMinutes + descentMinutes + breakTime;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);

        breakdown = {
            pace,
            flatMinutes: flatMinutes.toFixed(1),
            ascentMinutes: ascentMinutes.toFixed(1),
            descentMinutes: descentMinutes.toFixed(1),
            breakTime: breakTime.toFixed(1),
            totalMinutes: totalMinutes.toFixed(1),
        };

        document.getElementById('result').textContent = `Estimated time: ${hours}h ${minutes}m`;
        document.getElementById('details').innerHTML = "";
    };

    reader.readAsText(file);
}

function haversine(p1, p2) {
    const R = 6371; // km
    const toRad = (x) => x * Math.PI / 180;
    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lon - p1.lon);
    const lat1 = toRad(p1.lat);
    const lat2 = toRad(p2.lat);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
