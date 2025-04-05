# Walking Time Estimator

This is a simple yet smart web app that estimates total walking time based on:

- **Manual input**: total distance (km), ascent (m), and descent (m)
- **OR GPX file upload**: automatically extracts track distance and elevation changes
- (Optional) average walking pace
- (Optional) break/rest time

It provides a realistic time estimate using walking algorithms and slope analysis.

---

## Features

### 1. **Input Modes**
At the top of the page, choose how you'd like to enter your walk data:

- **Manual Entry**  
  Enter total distance, ascent, and descent yourself.

- **GPX File Import**  
  Upload a `.gpx` file and the tool will:
  - Calculate total distance using haversine formula
  - Extract elevation data to determine ascent and descent
  - Estimate slope grade to refine the timing

### 2. **Smart Time Estimation**

We use a refined version of **Naismith’s Rule** with **Langmuir’s corrections**:

- **Flat Ground**: Based on average pace (default 12 min/km)
- **Ascent**: Adds 10 minutes for every 100m gained
- **Descent**:
  - Gentle: no penalty
  - Moderate (5–12%): +10 min per 300m
  - Steep (>12%): +20 min per 300m

### 3. **Break Time**
Optionally add rest or lunch breaks (in minutes), added to the total estimate.

### 4. **Calculation Breakdown**
After clicking "Calculate", you can click **Show Details** to view a full breakdown:
- Flat time
- Ascent and descent time
- Break time
- Total estimated duration

### 5. **Responsive UI**
- "Reset" clears all fields and outputs
- Calculation mode toggles between manual and GPX input

---

## How to Use

1. Open `index.html` in a browser or deploy it (see below).
2. Choose either **Manual Entry** or **GPX Upload**
3. Fill in the fields (pace and break time are optional)
4. Click **Calculate** to see the estimated walking time
5. Click **Show Details** to view the formula breakdown
6. Click **Reset** to start over

---

## Hosting on GitHub Pages

1. Push the project to a GitHub repository
2. Go to **Settings > Pages**
3. Choose:
   - Branch: `main`
   - Folder: `/ (root)`
4. GitHub will provide a public link like:  
   `https://your-username.github.io/walking-time-estimator/`

---

## GPX Files

- Ensure your `.gpx` file includes `<trkpt>` entries with valid `lat`, `lon`, and `<ele>` tags.
- The parser calculates distance between each point and aggregates elevation differences to improve accuracy.

---

## License

MIT – Free to use, adapt, and share.
