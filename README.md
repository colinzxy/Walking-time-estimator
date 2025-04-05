# Colin’s Walking Time Estimator

A smart web app to estimate walking time using either manual inputs or GPX files.

## Features

- **Manual Mode**: Enter total distance, ascent and descent
- **GPX Mode**: Upload GPX to auto-calculate distance and elevation
- **Elevation API fallback** if GPX lacks elevation data
- Optional average pace and break time
- Clear breakdown of time components
- Displays which algorithm is used (Naismith + Langmuir)
- Mobile-friendly layout

## Algorithm

Refined Naismith’s Rule + Langmuir Correction:

- Flat: `distance / pace`
- Ascent: `+10 min per 100m`
- Descent:
  - +10 min per 300m (moderate slope)
  - +20 min per 300m (steep slope)

## Hosting on GitHub Pages

1. Push all files to a GitHub repo
2. Go to **Settings > Pages**
3. Select `main` branch and `/ (root)`
4. Your site will be live at `https://your-username.github.io/repo-name`

---

&copy; Colin Zhang
