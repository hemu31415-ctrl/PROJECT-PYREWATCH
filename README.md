# 🛰️ PYREWATCH — AI-Powered Satellite Thermal Intelligence & Industrial Flare Monitoring
### Problem Statement: SIH26162 | Smart India Hackathon 2026 | Tech Taxila
### AI-Based Detection & Classification of Industrial Fires & Persistent Thermal Sources Using NASA FIRMS, OSM & Satellite Radiometry

<div align="center">

  <img src="https://img.shields.io/badge/Radiometry-NASA_FIRMS_VIIRS%2FMODIS-E03C31?style=for-the-badge&logo=nasa&logoColor=white" alt="NASA FIRMS" />
  <img src="https://img.shields.io/badge/GIS_Database-PostgreSQL_%2B_PostGIS-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostGIS" />
  <img src="https://img.shields.io/badge/Backend-FastAPI_%2B_GeoAlchemy2-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Uncertainty-Conformal_Prediction_(90%25)-38bdf8?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="Conformal" />
  <img src="https://img.shields.io/badge/Console-React_%2B_Leaflet_GIS-61dafb?style=for-the-badge&logo=leaflet&logoColor=black" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Live_API-Render_Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render" />

</div>

---

## 📌 The Real-World Problem
Earth observation satellites like **NASA FIRMS** (VIIRS / MODIS) observe thousands of thermal anomalies every 3–4 hours across India. However, raw satellite pixels only state: *"A 375m thermal hotspot was detected at (lat, lng) with Fire Radiative Power (MW)."*

They cannot distinguish between:
1. **A routine hydrocarbon flare** safely burning off gas at an oil refinery.
2. **An uncontrolled industrial fire or refinery explosion** threatening critical infrastructure and populated zones.
3. **Operational base-load furnace heat** at a continuous steel mill or cement kiln.
4. **Seasonal crop residue burning** (stubble) across agricultural belts.
5. **Canopy forest wildfires** expanding across wilderness ranges.

**Pyrewatch** bridges this intelligence gap by fusing multi-sensor satellite radiometry, OpenStreetMap (OSM) industrial infrastructure polygons, historical overpass statistics, and calibrated machine learning into an operational disaster intelligence platform.

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph SATELLITE["1. Satellite Radiometry Ingestion"]
        N1["NASA FIRMS NRT API (VIIRS 375m / NOAA-20 & NOAA-21)"]
        N2["Telemetry: Lat, Lng, FRP (MW), Brightness Temp (K), Confidence, Overpass Time"]
    end

    subgraph PREPROCESSING["2. High-Performance Spatial Ingestion"]
        P1["Fast Bounding-Box Industrial Pre-Filter (Eliminates 98% Unnecessary Trig)"]
        P2["O(N) Spatial Grid Cell Clustering (< 5ms for 4,000+ points)"]
    end

    subgraph BASELINE["3. 90-Day Statistical Self-Baseline Engine"]
        B1["Historical Median FRP & Interquartile Range (IQR) Calculation"]
        B2["Anomaly Z-Score: Z = (FRP_current - Median_FRP) / IQR"]
        B3["State Assignment: Normal (<=1.3x) vs. Elevated (1.3-2.2x) vs. Abnormal (>2.2x)"]
    end

    subgraph CORROBORATION["4. Multi-Source Evidence Fusion & GIS"]
        G1["OpenStreetMap (OSM) Industrial Facility Corroboration (8.5 km to 18 km Buffers)"]
        G2["Land-Cover Context & Vegetation Spectral Masking (NDVI / NBR)"]
        G3["Calibrated Conformal Prediction Sets (Guaranteed 90% Coverage Bounds)"]
    end

    subgraph C2["5. Operational Tactical C2 Console"]
        C1["Interactive Leaflet Map (Thermal Radii, Facility Pins, Vector Lines)"]
        C2["Priority Alert Queue with Web Audio Synthesis Alarms"]
        C3["Explainable AI (XAI) Fusion Dossier Cards"]
        C4["One-Click Export: GeoJSON, KML (Google Earth), CSV"]
    end

    SATELLITE --> PREPROCESSING
    PREPROCESSING --> BASELINE
    BASELINE --> CORROBORATION
    CORROBORATION --> C2
```

---

## 🧮 Mathematical & Scientific Breakthroughs

### 1. The "Know What's Normal" Self-Baseline Engine
Rather than relying on static thermal thresholds that trigger false alarms on normal smelters, Pyrewatch asks: **"Is this thermal release unusual for this exact coordinate?"**
- The engine calculates the historical median FRP ($\tilde{F}$) and Interquartile Range ($\text{IQR}$) over a rolling 90-day satellite overpass window.
- The Anomaly Multiplier is defined as:
  $$M = \frac{\text{FRP}_{\text{observed}}}{\tilde{F}_{\text{baseline}}}$$
- An excursion of $M \ge 2.2\times$ or a robust Z-score $Z > 3.0$ triggers a **Critical Alert**, while normal baseload furnace heat ($M \le 1.3\times$) is recognized and suppressed.

### 2. Calibrated Conformal Prediction (Uncertainty Quantification)
To eliminate catastrophic false positives, Pyrewatch returns **mathematically guaranteed conformal prediction sets** $\Gamma^\epsilon(X)$:
$$P\left(Y \in \Gamma^\epsilon(X)\right) \ge 1 - \epsilon \quad (\text{Coverage } 90\%)$$
Instead of a naive single-class output, an ambiguous signature near an industrial corridor returns a calibrated set such as:
$$\Gamma^{0.10} = \{\text{industrial\_flare}, \text{industrial\_thermal}\}$$
providing emergency decision-makers with provable coverage bounds.

---

## 🏷️ 5-Class Hierarchical Thermal Segregation

| Class | Description | Physical Verification Signatures | Tier |
| :--- | :--- | :--- | :---: |
| **`industrial_flare`** | Hydrocarbon flaring at refineries, petrochemical units, and LNG terminals. | High FRP ($>25\text{ MW}$), point-source geometry within $0.8\text{ km}$ of OSM flare stacks. | **High** |
| **`industrial`** | Runaway industrial fire, catastrophic chemical tank blaze, or explosion. | Severe thermal surge ($M > 2.2\times$), abnormal brightness ($>350\text{ K}$), emergency downwind exposure. | **Critical** |
| **`persistent`** | Continuous furnace / kiln heat at steel mills, power plants, and smelters. | High recurrence rate ($>40$ passes/yr), stable baseline ($M \approx 1.0$), zero rapid expansion. | **Watch** |
| **`wildfire`** | Canopy forest fires or seasonal crop residue (stubble) burning. | High NDVI/NBR vegetation index, linear moving front, absent from industrial databases. | **Watch** |
| **`unknown`** | Ambiguous, cloud-obscured, or isolated single-pass heat anomalies. | Sub-threshold FRP, uncorroborated by OSM or multi-temporal passes. Preserved for operator review. | **Low** |

---

## 🚀 Quick Start & Reproduction

### Live Production Deployment
- **Production API:** `https://backend1-3-zb2a.onrender.com`
- **Health Check:** `https://backend1-3-zb2a.onrender.com/health`

### Local Setup
```bash
# 1. Start Backend API
cd backend1
python -m venv venv
# Windows: .\venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt
python itip_backend/api/main.py

# 2. Start Frontend Console
cd ../frontend2
npm install
npm start
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Automated Test Suite

```bash
# Run backend API contract & baseline unit tests (100% passing)
python -m unittest discover -s tests

# Run frontend React component tests (100% passing)
npm test -- --watchAll=false
```

---

## 📜 Authors & Acknowledgments
- **Hemant Desai** — Systems Architect & Machine Learning Lead ([@hemu31415-ctrl](https://github.com/hemu31415-ctrl))
- **Team Tech Taxila** — Developed for Smart India Hackathon 2026 (Problem Statement SIH26162)
- Data provided by **NASA LANCE / EOSDIS FIRMS** and **OpenStreetMap Contributors**.
