# 🛡️ CyberRakshak AI

**AI-Powered Social Media Scam Detection Platform**

CyberRakshak AI is a full-stack cybersecurity platform that leverages machine learning and NLP to detect and classify online scams, phishing URLs, fake job postings, and financial fraud in real time. Built with a **FastAPI** backend and a **Next.js** frontend, it provides an intuitive interface for users to scan suspicious content and receive instant, explainable AI-driven threat assessments.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (Windows)](#quick-start-windows)
  - [Manual Setup](#manual-setup)
- [ML Models & Datasets](#-ml-models--datasets)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔍 Scam Message Detector

- Multi-model ensemble (Logistic Regression, Naive Bayes, Random Forest) for scam/spam/phishing detection
- TF-IDF vectorization with bigram support (15,000 features)
- Automatic classification into 11 scam categories: Lottery Scam, Fake Job, Bank Fraud, OTP Fraud, UPI Scam, Digital Arrest, Investment Scam, Phishing Link, Crypto Scam, Email Scam, Social Engineering
- Human-readable AI explanations for each detection

### 🔗 Phishing URL Scanner

- 30+ URL feature extraction (IP usage, URL length, shorteners, HTTPS, subdomains, redirects, etc.)
- Random Forest ML model combined with rule-based scoring
- Real-time phishing risk assessment with feature breakdown

### 💼 Fake Job Detector

- NLP-based analysis of job postings (title, description, requirements, benefits)
- TF-IDF + Logistic Regression with class balancing for fraud detection
- Flags suspicious patterns: missing company profile, urgency language, payment requests, unrealistic offers

### 💳 Financial Fraud Detection

- Gradient Boosting classifier trained on credit card transaction data
- Standard scaling and undersampling for imbalanced data handling

### 📊 Analytics Dashboard

- Real-time scan statistics and threat distribution charts
- Category-wise, risk-level, and scan-type distribution (pie, bar, line charts via Recharts)
- Daily trend tracking, recent scan history, and model performance metrics
- Auto-refreshing every 30 seconds

### 🧠 Explainable AI

- Every detection result includes detailed explanations of **why** content was flagged
- Model confidence breakdown showing individual model probabilities and ensemble score
- Risk level classification: Low, Medium, High, Critical

---

## 🛠️ Tech Stack

| Layer        | Technology                                                                        |
| ------------ | --------------------------------------------------------------------------------- |
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Radix UI |
| **Backend**  | Python, FastAPI, Uvicorn                                                          |
| **ML/AI**    | scikit-learn, pandas, NumPy, NLTK, joblib                                         |
| **Models**   | Logistic Regression, Random Forest, Naive Bayes, Gradient Boosting                |
| **NLP**      | TF-IDF Vectorizer (unigram + bigram), regex-based pattern matching                |

---

## 📁 Project Structure

```
CyberRakshak/
├── start.bat                    # One-click launcher (Windows)
├── README.md
│
├── backend/
│   ├── main.py                  # FastAPI application & API endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── models/                  # Trained ML model files (.pkl)
│   ├── train/
│   │   └── train_models.py      # ML model training pipeline
│   └── utils/
│       └── preprocessing.py     # Text cleaning, feature extraction, scam classification
│
├── frontend/
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── page.tsx             # Landing page
│       │   ├── layout.tsx           # Root layout
│       │   ├── globals.css          # Global styles
│       │   ├── detector/page.tsx    # Scam message detector page
│       │   ├── url-scanner/page.tsx # Phishing URL scanner page
│       │   ├── job-detector/page.tsx# Fake job detector page
│       │   └── dashboard/page.tsx   # Analytics dashboard page
│       ├── components/
│       │   ├── ClientLayout.tsx     # Client-side layout wrapper
│       │   ├── Navbar.tsx           # Navigation bar
│       │   ├── RiskDisplay.tsx      # Risk badge & meter components
│       │   └── ui/                  # Reusable UI components (Button, Card, Input, Tabs, Textarea)
│       └── lib/
│           ├── api.ts               # API client functions
│           └── utils.ts             # Utility functions
│
└── datasets/                    # Training datasets
    ├── spam.csv                 # SMS spam dataset
    ├── spam_ham_dataset.csv     # Spam/ham email dataset
    ├── Enron.csv                # Enron email corpus
    ├── Nigerian_Fraud.csv       # Nigerian fraud emails
    ├── SpamAssasin.csv          # SpamAssassin dataset
    ├── phishing_email.csv       # Phishing email dataset
    ├── CEAS_08.csv              # CEAS 2008 dataset
    ├── Ling.csv                 # Ling spam dataset
    ├── Nazario.csv              # Nazario phishing dataset
    ├── phishing.csv             # URL phishing features dataset
    ├── fake_job_postings.csv    # Fake job postings dataset
    └── creditcard.csv           # Credit card fraud dataset
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm**
- **Git**

### Quick Start (Windows)

Simply double-click `start.bat` — it will automatically:

1. Install Python dependencies and start the FastAPI backend on `http://localhost:8000`
2. Install npm packages and start the Next.js frontend on `http://localhost:3000`

### Manual Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/siddhesh940/CyberRakshak-AI-.git
cd CyberRakshak-AI-
```

#### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

#### 3. Train ML Models (First Time Only)

```bash
python train/train_models.py
```

This will train all 4 detection models using the datasets and save `.pkl` files into `backend/models/`.

#### 4. Start the Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive Swagger documentation.

#### 5. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 🤖 ML Models & Datasets

### Models Trained

| Model                    | Algorithm               | Dataset(s)                                                         | Task                        |
| ------------------------ | ----------------------- | ------------------------------------------------------------------ | --------------------------- |
| Scam Message Detector    | Ensemble (LR + NB + RF) | spam.csv, Enron.csv, Nigerian_Fraud.csv, SpamAssasin.csv, + 5 more | Text scam/spam detection    |
| Phishing URL Detector    | Random Forest           | phishing.csv (30+ URL features)                                    | URL phishing detection      |
| Fake Job Detector        | Logistic Regression     | fake_job_postings.csv                                              | Job fraud detection         |
| Financial Fraud Detector | Gradient Boosting       | creditcard.csv                                                     | Credit card fraud detection |

### Training Pipeline

The training script (`backend/train/train_models.py`) performs:

1. **Data Loading** — Reads and merges multiple CSV datasets
2. **Text Preprocessing** — Lowercasing, URL/email/phone normalization, special character removal
3. **Feature Engineering** — TF-IDF vectorization (up to 15,000 features with bigrams)
4. **Model Training** — Trains multiple classifiers with train/test split (80/20)
5. **Model Persistence** — Saves trained models as `.pkl` files using joblib

### Scam Categories Detected

| Category            | Examples                                                |
| ------------------- | ------------------------------------------------------- |
| Lottery Scam        | "You won ₹25 lakh in lucky draw"                        |
| Fake Job Scam       | "Earn ₹50,000/day, no experience needed"                |
| Bank Fraud          | "Your account has been blocked, verify KYC"             |
| OTP Fraud           | "Share your OTP to secure your account"                 |
| UPI Payment Scam    | "Scan this QR code to receive payment"                  |
| Digital Arrest Scam | "FIR registered, pay to avoid arrest"                   |
| Investment Scam     | "Double your money with guaranteed returns"             |
| Phishing Link       | "Click here to verify your account"                     |
| Crypto Scam         | "Free Bitcoin airdrop, invest now"                      |
| Email Scam          | "Dear beneficiary, transfer $4.5 million"               |
| Social Engineering  | "Unusual activity detected, reset password immediately" |

---

## 🔌 API Endpoints

| Method | Endpoint          | Description                       |
| ------ | ----------------- | --------------------------------- |
| GET    | `/`               | API info and status               |
| GET    | `/health`         | Health check                      |
| POST   | `/detect-message` | Detect scam in text message       |
| POST   | `/scan-url`       | Scan URL for phishing             |
| POST   | `/detect-job`     | Detect fake job posting           |
| GET    | `/analytics`      | Get scan analytics and statistics |
| GET    | `/model-status`   | Check loaded model status         |

### Example Request — Detect Scam Message

```bash
curl -X POST http://localhost:8000/detect-message \
  -H "Content-Type: application/json" \
  -d '{"message": "Congratulations! You won a lottery. Click here to claim."}'
```

### Example Response

```json
{
  "is_scam": true,
  "scam_probability": 0.9523,
  "risk_level": "Critical",
  "category": "Lottery Scam",
  "explanations": [
    "Claims you won a prize or reward (common scam tactic)",
    "Urges to click on a link (phishing indicator)"
  ],
  "model_confidence": {
    "logistic_regression": 0.9712,
    "naive_bayes": 0.9341,
    "random_forest": 0.9516,
    "ensemble": 0.9523
  },
  "timestamp": "2026-02-28T12:00:00"
}
```

---

## 📸 Screenshots

### Landing Page

> Modern dark-themed landing page with feature highlights, scam category marquee, and platform statistics.

### Scam Message Detector

> Paste any suspicious SMS, email, or message to get instant AI analysis with risk level, category, model confidence breakdown, and explanations.

### Phishing URL Scanner

> Enter any URL to analyze 30+ phishing indicators with ML-powered risk scoring and feature-level breakdown.

### Fake Job Detector

> Input job posting details (title, description, requirements, benefits) to detect recruitment fraud.

### Analytics Dashboard

> Real-time dashboard with threat distribution charts, daily scan trends, risk-level analysis, and recent scan history.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for a safer digital India<br/>
  <strong>CyberRakshak AI</strong> — Your AI Shield Against Online Scams
</p>
