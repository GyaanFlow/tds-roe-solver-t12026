// Bypass: FastAPI IoT Sensor Stats (weight=0.5)
export const id = 'q-fastapi-sensor-server';
export const title = 'FastAPI IoT Sensor Analytics';

export function solve(email) {
  return {
    variant: 'Requires deploying a FastAPI /stats endpoint',
    type: 'bypass',
    answer: `// 🔥 GUIDE: FastAPI IoT Sensor Stats (0.5 marks)
//
// Deploy this FastAPI app and submit the URL:
//
// === requirements.txt ===
// fastapi
// uvicorn
// pandas
//
// === main.py ===
// from fastapi import FastAPI, Query, Response
// from fastapi.middleware.cors import CORSMiddleware
// import pandas as pd
// from functools import lru_cache
// from typing import Optional
//
// app = FastAPI()
// app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
//
// df = pd.read_csv("sensor_data.csv", parse_dates=["timestamp"])
//
// @lru_cache(maxsize=256)
// def compute_stats(location, sensor, start_date, end_date):
//     filtered = df.copy()
//     if location: filtered = filtered[filtered["location"] == location]
//     if sensor: filtered = filtered[filtered["sensor"] == sensor]
//     if start_date: filtered = filtered[filtered["timestamp"] >= start_date]
//     if end_date: filtered = filtered[filtered["timestamp"] <= end_date]
//     if len(filtered) == 0:
//         return {"count": 0, "avg": 0, "min": 0, "max": 0}, False
//     stats = {
//         "count": int(len(filtered)),
//         "avg": round(float(filtered["value"].mean()), 2),
//         "min": round(float(filtered["value"].min()), 2),
//         "max": round(float(filtered["value"].max()), 2),
//     }
//     return stats, True
//
// @app.get("/stats")
// async def get_stats(
//     response: Response,
//     location: Optional[str] = None,
//     sensor: Optional[str] = None,
//     start_date: Optional[str] = None,
//     end_date: Optional[str] = None,
// ):
//     key = (location, sensor, start_date, end_date)
//     stats, is_cached = compute_stats(*key)
//     response.headers["X-Cache"] = "HIT" if is_cached else "MISS"
//     return {"stats": stats}
//
// Deploy to Vercel/Railway/Render, then submit the base URL.`,
    answerDisplay: '<strong>Strategy:</strong> Deploy FastAPI with /stats endpoint, CSV data loading, response caching, and CORS. Submit the deployed URL.'
  };
}
