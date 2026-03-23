# MOOCCubeX BI Dashboard & Dropout Prediction Platform

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-Next.js-black?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql)

An advanced, full-stack Business Intelligence (BI) and Predictive Analytics platform designed to analyze learner behavior and predict student dropouts across Massive Open Online Courses (MOOCs). By leveraging the extensive **[MOOCCubeX](https://github.com/THU-KEG/MOOCCubeX)** dataset, this platform provides interactive dashboards, real-time metrics, and detailed Machine Learning evaluations across 5 distinct learning phases.

---

## ✨ Key Features

* **Course Management:** View a comprehensive list of all courses and drill down into detailed analytics for each specific course.
* **Specialized Content & Subjects:** Dedicated dashboard pages for specific topics such as *Data Mining*, *Data Quality*, Learning Data Analysis, and Learning Outcome Prediction.
* **Predictive Analytics (Experiment):** A specialized dashboard showcasing the performance results, metrics, and comparisons of 9 Machine Learning models.
* **Backend Integration / API:** Custom API routes structured and defined directly within the Next.js `src/app` directory (alongside the core FastAPI backend).

---

## 🚀 Detailed Pipeline & Data Flow

The platform's architecture is built upon a robust end-to-end data pipeline, from raw ingestion to client-side visualization.

### 1. Data Ingest
* **Source:** MOOCCubeX Dataset (processed CSV format).
* **Process:** Raw data is collected and initially stored in local CSV chunks representing various learning phases. 
* **Database Migration:** A custom automated ingestion script (`migrate_csv_to_db.py`) utilizing `pandas` processes the datasets, appends necessary phase lineage (`source_file`), and seamlessly chunks the records directly into a cloud-hosted **PostgreSQL** database on Render.

### 2. Machine Learning & Predictive Analytics
* **Objective:** Binary classification to predict the likelihood of a student dropping out (Label 1) versus completing the course (Label 0).
* **Models Evaluated:** A comprehensive benchmark of 9 algorithms including Traditional ML (Random Forest, SVM, KNN), Boosting (XGBoost, LightGBM, CatBoost), and Deep Learning (LSTM, ANN-LSTM, TabNet).
* **Results:** The models are evaluated across 5 consecutive testing phases, tracking Accuracy, Precision, Recall, F1-Score, and ROC-AUC. **TabNet** emerges as the most stable and performant model with an average AUC of **0.9204**.

### 3. Backend API Layer (FastAPI)
* Engineered using Python's **FastAPI** for maximal concurrency and speed.
* Connects to the PostgreSQL Database securely via **SQLAlchemy**.
* Exposes RESTful endpoints for the frontend visualization engine (e.g., retrieving top dropouts, temporal enrollment trends, and AI evaluation metrics).

### 4. Frontend BI Visualization (Next.js)
* Built upon **React / Next.js 15 (App Router)** and styled with **Tailwind CSS**.
* Delivers zero-latency static rendering and client-side graphs powered by **Recharts**.
* Features detailed views including the main **Overview Dashboard**, individual **Course Analytics**, and the exhaustive **Predictive Analytics Results (ML Models)** table.

---

## 🛠️ Technology Stack

| Category | Technologies |
| --- | --- |
| **Frontend** | React 19, Next.js (App Router), Tailwind CSS v4, Recharts, Lucide Icons |
| **Backend** | Python 3.9+, FastAPI, Uvicorn, SQLAlchemy, Pandas, pydantic-settings |
| **Database** | PostgreSQL (Render Cloud & Local pgAdmin) |
| **Deployment** | Vercel (CI/CD for Frontend), Render (CI/CD for Backend API & Database) |

---

## 📂 Project Structure

```text
DropoutMOOCCubeX/
├── frontend/                  # Next.js React Application
│   ├── src/app/               # App Router pages and global layouts
│   ├── src/components/        # Reusable BI Dashboard components
│   └── package.json           # Node dependencies
├── backend/                   # FastAPI Python Application
│   ├── main.py                # Core API Router & Server
│   ├── database.py            # Async PostgreSQL engine setup
│   ├── crud.py                # Data query logic
│   ├── models.py              # SQLAlchemy Schema definitions
│   ├── migrate_csv_to_db.py   # Data Ingestion Script (CSV -> Postgres)
│   └── requirements.txt       # Python dependencies
└── docker-compose.yml         # Container orchestration (optional)
```

---

## ⚙️ Local Development Setup

### 1. Database Configuration
Ensure PostgreSQL is running locally on port `5432`.
Create a `.env` file inside the `backend/` directory:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/CSDL-MOOC
```

### 2. Backend API
Open a terminal in the `backend/` directory:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Migrate CSV data to Database (Ensure data folder is placed correctly)
python migrate_csv_to_db.py

# Start the FastAPI Server
uvicorn main:app --reload --port 8000
```
> The API will be available at `http://localhost:8000`

### 3. Frontend Dashboard
Open a new terminal in the `frontend/` directory:
```bash
# Provide Backend URL to the frontend environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Install dependencies and start the dev server
npm install
npm run dev
```
> The BI Dashboard will be accessible at `http://localhost:3000`

---

## 🌐 Cloud Deployment

- **Frontend:** Automatically synced and deployed via **Vercel** (`Root Directory: frontend`, `Framework Preset: Next.js`).
- **Backend:** Automatically synced and deployed as a Web Service via **Render** (`Build Command: pip install -r requirements.txt`, `Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT`).
- **Database:** Hosted on Render PostgreSQL, connected via internal routing for minimum latency.
