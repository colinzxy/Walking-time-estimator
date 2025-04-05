# Walking Time Estimator

A simple web tool that estimates total walking time based on:
- Total distance (km)
- Total ascent (m)
- Total descent (m)
- (Optional) Average pace on flat ground (min/km)

## Estimation Formula

We use a refined version of **Naismith's Rule** with **Langmuir’s Correction**:

- **Flat Ground:** Uses your average pace (default: 12 min/km)
- **Ascent:** Adds 10 min for every 100m climbed (or 1 hour per 600m)
- **Descent:**
  - No adjustment for gentle slopes (<5%)
  - +10 min per 300m for moderate slopes (5–12%)
  - +20 min per 300m for steep slopes (>12%)

## How to Use
1. Enter total distance, ascent, and descent.
2. (Optional) Enter your flat walking pace.
3. Click **Calculate** to see estimated time.
4. Click **Reset** to start over.

## Hosting on GitHub Pages
1. Push all files to a GitHub repository.
2. Go to **Settings > Pages**, and select the `main` branch with `/root` folder.
3. Your website will be live at the URL provided.
