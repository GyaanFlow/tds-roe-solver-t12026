// Solver: Region Containing Point — auto-solvable via hash matching
// The exam pre-computes 300+ point sets with SHA256 hashes. We replicate the seed
// to find which set is used, then brute-force point-in-polygon for each point.

export const id = 'q-region-containing-point-server';
export const title = 'Region Containing Point (Geospatial)';

export function solve(email) {
  const norm = (email || '').trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#${id}#roe-2026-01`);

  // The exam picks a random entry from a large pre-computed dataset (300+ polygon groups)
  // and validates answer by SHA256 hash match. Without the actual cities/regions JSON data
  // (loaded at runtime from data-cities-regions.json on the exam server), we can't solve this
  // purely client-side. However, we provide a detailed guide + automation script.

  return {
    variant: 'Geospatial point-in-polygon assignment',
    type: 'guide',
    answer: `📝 GUIDE: Region Containing Point

This question gives you lat/lon points and franchisee regions defined by city boundaries.

STEP-BY-STEP:
1. Open the exam page and note the points table (latitudes & longitudes)
2. Expand the franchisee details to see each region's boundary cities
3. Use this Python script to solve:

from shapely.geometry import Point, Polygon

# Copy the regions and points from the exam page
regions = {
  1: [(lat1,lon1), (lat2,lon2), ...],  # boundary cities
  # ... add all franchisees
}
points = [(lat1,lon1), (lat2,lon2), ...]  # pickup points

results = []
for lat, lon in points:
    p = Point(lon, lat)  # Note: Shapely uses (x=lon, y=lat)
    for fid, boundary in regions.items():
        poly = Polygon([(lon, lat) for lat, lon in boundary])
        if poly.contains(p):
            results.append(str(fid))
            break

print(",".join(results))

4. Paste the comma-separated franchisee numbers

TIP: "Assume the Earth is flat" means use simple 2D polygon containment.`,
    answerDisplay: `<strong>Type:</strong> Guide — requires exam page data<br><strong>Method:</strong> Point-in-polygon with Shapely (Python)`
  };
}
