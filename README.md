# 🏥 CureSync

> **AI-Driven Health Center Command Center & Supply Chain Optimization Platform**
> Real-time monitoring, predictive medicine stock-outs, smart resource redistribution, and automated operations for Primary (PHCs) and Community Health Centres (CHCs).

---

## 📌 Overview

**CureSync** is a District Health Digital Twin and AI Command Center designed to solve the critical operational inefficiencies faced by Primary Health Centres (PHCs) and Community Health Centres (CHCs). Instead of manual reporting that causes delayed interventions, CureSync provides district administrators with real-time operational visibility and proactive AI-generated solutions before service quality drops.

### 🌟 Core Value Proposition
> **Observe** live health-center status, **Predict** shortages and surges, **Recommend** optimal resource redistribution, and help district administrators **Act** before services fail.

---

## 🚀 Key Features

*   **📊 District Operations Dashboard:** A bird's-eye view of all PHCs and CHCs with custom metrics including the **District Health Score**, bed occupancy, doctor attendance, active medicine alerts, and total daily patients.
*   **🗺️ Map-Based Risk Visualization:** Interactive spatial representation using Leaflet & OpenStreetMap, color-coding health centers (🟢 Healthy, 🟡 Watch, 🟠 At Risk, 🔴 Critical) based on live scores.
*   **🔮 Predictive Stock-Outs:** Automatic calculations of average daily consumption rates to forecast exactly when critical medicines will run out.
*   **🔄 Resource Redistribution Optimizer:** Smart algorithms that detect stock-outs or high patient surges and recommend transferring medicines/staff/beds from nearby surplus centers without violating their own safety thresholds.
*   **🗣️ Voice-Driven Worker Portal:** A simple portal where health center workers can update operational metrics (medicine stock, occupied beds, doctor attendance) using browser-based voice inputs for speed and efficiency.
*   **🤖 Gemini AI Assistant & Reporting:** A natural-language interface allowing administrators to ask operations queries (e.g., *"Which PHCs need urgent attention today?"*) and generate multilingual summaries (English, Hindi, Gujarati).

---

## 🛠️ Tech Stack (Cost-Efficient & Scale-Ready)

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 + TypeScript + Tailwind CSS | Highly responsive UI, dynamic dashboards, and page routing. |
| **Backend** | FastAPI | High-performance async Python backend supporting ML/AI utilities. |
| **Database** | Supabase (PostgreSQL) | Structured storage, real-time sync, and relational health center schemas. |
| **Auth** | Supabase Auth | Role-based authentication (Health Center Worker & District Administrator). |
| **AI / LLM** | Google Gemini (via Google AI Studio) | Explanations, report generation, demand forecasting assistance, and chatbot. |
| **Mapping** | Leaflet + OpenStreetMap | Custom geographic dashboard visualizations. |
| **Charts** | Recharts | Interactive resource, patient trend, and stock charts. |

---

## 🗄️ Database Architecture

CureSync leverages a clean, relational PostgreSQL schema structured as follows:

*   `phcs`: Detailed records of health centers (name, type, district, latitude, longitude).
*   `users_profile`: Profiles mapping Supabase auth users to roles (`admin` vs `worker`).
*   `medicines`: Live stock counts, minimum thresholds, and expiry dates.
*   `stock_movements`: Log of medicine changes for consumption analysis.
*   `beds`: Bed counts and occupancy status.
*   `doctors` & `doctor_attendance`: Shifts, specializations, and daily check-ins.
*   `patient_logs`: Historical patient footfall used for forecasting.
*   `alerts` & `recommendations`: System-generated flags and AI/optimizer suggestions.

---

## 📈 Health Score Calculation

CureSync scores each center from `0` to `100` dynamically using standard deterministic formulas:

$$\text{Health Score} = (\text{Medicine Stock}) \times 0.30 + (\text{Doctor Availability}) \times 0.25 + (\text{Bed Availability}) \times 0.20 + (\text{Patient Load}) \times 0.15 + (\text{Test Availability}) \times 0.10$$

---

## 💻 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   Supabase Account

### Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Harshitagarwal113/CureSync.git
    cd CureSync
    ```

2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  **Backend Setup:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

4.  **Database Migration:**
    Execute the Supabase SQL scripts to spin up tables, setup RLS policies, and run the seed script to populate demo data.

---

## 📄 License

This project is licensed under the MIT License.
