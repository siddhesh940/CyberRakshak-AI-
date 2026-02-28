"""
CyberRakshak AI - FastAPI Backend Server
AI-Powered Social Media Scam Detection Platform
"""

import os
import sys
import logging
import datetime
import typing
import collections

import joblib
import fastapi
import fastapi.middleware.cors
import pydantic

# Add parent dir to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import utils.preprocessing

# Logging
logging.basicConfig(level=logging.INFO)
logger: logging.Logger = logging.getLogger("CyberRakshak")

# ─── App Setup ───────────────────────────────────────────────────────────
app = fastapi.FastAPI(
    title="CyberRakshak AI",
    description="AI-Powered Social Media Scam Detection Platform",
    version="1.0.0",
)

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load ML Models ─────────────────────────────────────────────────────
MODEL_DIR: str = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')

models = {}

def load_models() -> None:
    """Load all trained ML models."""
    global models
    try:
        models['tfidf'] = joblib.load(os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl'))
        models['scam_lr'] = joblib.load(os.path.join(MODEL_DIR, 'scam_detector_lr.pkl'))
        models['scam_nb'] = joblib.load(os.path.join(MODEL_DIR, 'scam_detector_nb.pkl'))
        models['scam_rf'] = joblib.load(os.path.join(MODEL_DIR, 'scam_detector_rf.pkl'))
        models['text_info'] = joblib.load(os.path.join(MODEL_DIR, 'text_model_info.pkl'))
        logger.info("Text scam models loaded ✓")
    except Exception as e:
        logger.warning(f"Text models not loaded: {e}")

    try:
        models['url_rf'] = joblib.load(os.path.join(MODEL_DIR, 'url_detector_rf.pkl'))
        models['url_features'] = joblib.load(os.path.join(MODEL_DIR, 'url_feature_cols.pkl'))
        models['url_info'] = joblib.load(os.path.join(MODEL_DIR, 'url_model_info.pkl'))
        logger.info("URL phishing model loaded ✓")
    except Exception as e:
        logger.warning(f"URL model not loaded: {e}")

    try:
        models['job_tfidf'] = joblib.load(os.path.join(MODEL_DIR, 'job_tfidf_vectorizer.pkl'))
        models['job_detector'] = joblib.load(os.path.join(MODEL_DIR, 'job_scam_detector.pkl'))
        models['job_info'] = joblib.load(os.path.join(MODEL_DIR, 'job_model_info.pkl'))
        logger.info("Job scam model loaded ✓")
    except Exception as e:
        logger.warning(f"Job model not loaded: {e}")

    try:
        models['financial_scaler'] = joblib.load(os.path.join(MODEL_DIR, 'financial_scaler.pkl'))
        models['financial_detector'] = joblib.load(os.path.join(MODEL_DIR, 'financial_fraud_detector.pkl'))
        models['financial_info'] = joblib.load(os.path.join(MODEL_DIR, 'financial_model_info.pkl'))
        logger.info("Financial fraud model loaded ✓")
    except Exception as e:
        logger.warning(f"Financial model not loaded: {e}")

load_models()

# ─── In-Memory Analytics Store ──────────────────────────────────────────
scan_history = []

def record_scan(scan_type, result, risk_level, category="") -> None:
    """Record a scan for analytics."""
    scan_history.append({
        "timestamp": datetime.datetime.now().isoformat(),
        "type": scan_type,
        "result": result,
        "risk_level": risk_level,
        "category": category
    })

# ─── Request/Response Models ────────────────────────────────────────────
class MessageRequest(pydantic.BaseModel):
    message: str

class URLRequest(pydantic.BaseModel):
    url: str

class JobRequest(pydantic.BaseModel):
    title: str = ""
    company_profile: str = ""
    description: str = ""
    requirements: str = ""
    benefits: str = ""

class DetectionResult(pydantic.BaseModel):
    is_scam: bool
    scam_probability: float
    risk_level: str
    category: str
    explanations: typing.List[str]
    model_confidence: dict
    timestamp: str

class URLResult(pydantic.BaseModel):
    is_phishing: bool
    risk_score: float
    risk_level: str
    features_detected: dict
    explanations: typing.List[str]
    timestamp: str

class JobResult(pydantic.BaseModel):
    is_fake: bool
    fraud_probability: float
    risk_level: str
    explanations: typing.List[str]
    timestamp: str

# ─── API Endpoints ──────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "name": "CyberRakshak AI",
        "version": "1.0.0",
        "description": "AI-Powered Social Media Scam Detection Platform",
        "status": "active",
        "models_loaded": list(models.keys()),
        "endpoints": ["/detect-message", "/scan-url", "/detect-job", "/analytics"]
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models_loaded": len(models),
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.post("/detect-message", response_model=DetectionResult)
def detect_message(request: MessageRequest) -> DetectionResult:
    """Detect scam/spam/phishing in a text message."""
    if not request.message.strip():
        raise fastapi.HTTPException(status_code=400, detail="Message cannot be empty")

    if 'tfidf' not in models or 'scam_lr' not in models:
        raise fastapi.HTTPException(status_code=503, detail="Text scam models not loaded. Train models first.")

    cleaned = utils.preprocessing.clean_text(request.message)

    # Vectorize
    tfidf_vec = models['tfidf'].transform([cleaned])

    # Get predictions from all models
    lr_prob = models['scam_lr'].predict_proba(tfidf_vec)[0]
    nb_prob = models['scam_nb'].predict_proba(tfidf_vec)[0]
    rf_prob = models['scam_rf'].predict_proba(tfidf_vec)[0]

    # Ensemble average
    avg_prob = (lr_prob[1] * 0.4 + nb_prob[1] * 0.3 + rf_prob[1] * 0.3)

    is_scam = avg_prob >= 0.5
    risk_level = utils.preprocessing.get_risk_level(avg_prob)

    # Classify category
    category, matched = utils.preprocessing.classify_scam_category(request.message)

    # Generate explanation
    explanations = utils.preprocessing.generate_explanation(request.message, avg_prob, category)

    result = DetectionResult(
        is_scam=is_scam,
        scam_probability=round(float(avg_prob), 4),
        risk_level=risk_level,
        category=category if is_scam else "Safe",
        explanations=explanations if explanations else ["No suspicious patterns detected"],
        model_confidence={
            "logistic_regression": round(float(lr_prob[1]), 4),
            "naive_bayes": round(float(nb_prob[1]), 4),
            "random_forest": round(float(rf_prob[1]), 4),
            "ensemble": round(float(avg_prob), 4)
        },
        timestamp=datetime.datetime.now().isoformat()
    )

    record_scan("message", "scam" if is_scam else "safe", risk_level, category if is_scam else "")
    return result


@app.post("/scan-url", response_model=URLResult)
def scan_url(request: URLRequest) -> URLResult:
    """Scan a URL for phishing indicators."""
    if not request.url.strip():
        raise fastapi.HTTPException(status_code=400, detail="URL cannot be empty")

    # Extract features from URL
    features = utils.preprocessing.extract_url_features(request.url)

    explanations = []
    risk_score = 0.0

    # Rule-based scoring
    url_lower = request.url.lower()

    if features.get('UsingIP', -1) == 1:
        risk_score += 0.2
        explanations.append("URL uses an IP address instead of domain name")
    if features.get('LongURL', -1) == 1:
        risk_score += 0.1
        explanations.append("URL is suspiciously long")
    if features.get('ShortURL', -1) == 1:
        risk_score += 0.15
        explanations.append("URL uses a URL shortening service")
    if features.get('Symbol@', -1) == 1:
        risk_score += 0.15
        explanations.append("URL contains @ symbol (potential redirect)")
    if features.get('Redirecting//', -1) == 1:
        risk_score += 0.1
        explanations.append("URL contains multiple redirects")
    if features.get('PrefixSuffix-', -1) == 1:
        risk_score += 0.1
        explanations.append("Domain uses prefix/suffix with hyphens")
    if features.get('SubDomains', -1) == 1:
        risk_score += 0.1
        explanations.append("URL has excessive subdomains")
    if features.get('HTTPS', -1) == 1:
        risk_score += 0.1
        explanations.append("URL does not use HTTPS encryption")

    # ML model prediction if available
    if 'url_rf' in models:
        try:
            feature_cols = models['url_features']
            import pandas as pd
            feature_df = pd.DataFrame([features])
            for col in feature_cols:
                if col not in feature_df.columns:
                    feature_df[col] = 0
            feature_df = feature_df[feature_cols]
            ml_pred = models['url_rf'].predict_proba(feature_df)[0]
            ml_risk = float(ml_pred[1]) if len(ml_pred) > 1 else float(ml_pred[0])
            risk_score = (risk_score * 0.4 + ml_risk * 0.6)
        except Exception as e:
            logger.warning(f"URL ML prediction failed: {e}")

    risk_score = min(risk_score, 1.0)
    is_phishing = risk_score >= 0.5
    risk_level = utils.preprocessing.get_risk_level(risk_score)

    if not explanations:
        explanations.append("URL appears to be safe")

    features_detected = {
        "uses_ip": features.get('UsingIP', -1) == 1,
        "long_url": features.get('LongURL', -1) == 1,
        "short_url": features.get('ShortURL', -1) == 1,
        "has_at_symbol": features.get('Symbol@', -1) == 1,
        "has_redirect": features.get('Redirecting//', -1) == 1,
        "has_hyphen": features.get('PrefixSuffix-', -1) == 1,
        "excessive_subdomains": features.get('SubDomains', -1) == 1,
        "no_https": features.get('HTTPS', -1) == 1,
    }

    result = URLResult(
        is_phishing=is_phishing,
        risk_score=round(risk_score, 4),
        risk_level=risk_level,
        features_detected=features_detected,
        explanations=explanations,
        timestamp=datetime.datetime.now().isoformat()
    )

    record_scan("url", "phishing" if is_phishing else "safe", risk_level, "Phishing Link" if is_phishing else "")
    return result


@app.post("/detect-job", response_model=JobResult)
def detect_job(request: JobRequest) -> JobResult:
    """Detect fake/fraudulent job postings."""
    combined: str = f"{request.title} {request.company_profile} {request.description} {request.requirements} {request.benefits}"
    if len(combined.strip()) < 10:
        raise fastapi.HTTPException(status_code=400, detail="Please provide job posting details")

    if 'job_tfidf' not in models or 'job_detector' not in models:
        raise fastapi.HTTPException(status_code=503, detail="Job scam models not loaded. Train models first.")

    cleaned = utils.preprocessing.clean_text(combined)
    tfidf_vec = models['job_tfidf'].transform([cleaned])
    prob = models['job_detector'].predict_proba(tfidf_vec)[0]

    fraud_prob = float(prob[1])
    is_fake = fraud_prob >= 0.5
    risk_level = utils.preprocessing.get_risk_level(fraud_prob)

    explanations = []
    text_lower = combined.lower()

    if not request.company_profile.strip():
        explanations.append("No company profile provided")
        fraud_prob = min(fraud_prob + 0.1, 1.0)
    if 'work from home' in text_lower and 'earn' in text_lower:
        explanations.append("Contains work-from-home earning claims")
    if 'no experience' in text_lower:
        explanations.append("Claims no experience needed")
    if 'guaranteed' in text_lower:
        explanations.append("Offers guaranteed income/position")
    if any(word in text_lower for word in ['urgent', 'immediately', 'asap']):
        explanations.append("Creates urgency to apply")
    if not request.requirements.strip():
        explanations.append("No specific requirements listed (suspicious)")
    if any(word in text_lower for word in ['fee', 'payment', 'deposit', 'registration fee']):
        explanations.append("Requests payment from applicant")

    if not explanations:
        if is_fake:
            explanations.append("Job posting matches patterns of known fraudulent listings")
        else:
            explanations.append("Job posting appears legitimate")

    result = JobResult(
        is_fake=is_fake,
        fraud_probability=round(fraud_prob, 4),
        risk_level=risk_level,
        explanations=explanations,
        timestamp=datetime.datetime.now().isoformat()
    )

    record_scan("job", "fake" if is_fake else "legit", risk_level, "Fake Job Scam" if is_fake else "")
    return result


@app.get("/analytics")
def get_analytics():
    """Get analytics data for the dashboard."""
    total_scans: int = len(scan_history)

    # Category distribution
    categories = [s['category'] for s in scan_history if s['category']]
    category_counts = dict(collections.Counter(categories))

    # Risk distribution
    risk_levels = [s['risk_level'] for s in scan_history]
    risk_counts = dict(collections.Counter(risk_levels))

    # Scan type distribution
    scan_types = [s['type'] for s in scan_history]
    type_counts = dict(collections.Counter(scan_types))

    # Results distribution
    results = [s['result'] for s in scan_history]
    result_counts = dict(collections.Counter(results))

    # Recent scans
    recent = scan_history[-20:][::-1]

    # Threat stats
    threats_detected: int = sum(1 for s in scan_history if s['result'] in ['scam', 'phishing', 'fake'])

    # Daily scan trend (last 7 days)
    daily_trend = []
    for i in range(7):
        date = (datetime.datetime.now() - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
        count = sum(1 for s in scan_history if s['timestamp'].startswith(date))
        threat_count = sum(1 for s in scan_history if s['timestamp'].startswith(date) and s['result'] in ['scam', 'phishing', 'fake'])
        daily_trend.append({"date": date, "scans": count, "threats": threat_count})

    # Model info
    model_info = {}
    for key in ['text_info', 'url_info', 'job_info', 'financial_info']:
        if key in models:
            info = models[key]
            model_info[key.replace('_info', '')] = {
                k: round(v, 4) if isinstance(v, float) else v
                for k, v in info.items()
                if not isinstance(v, list)
            }

    return {
        "total_scans": total_scans,
        "threats_detected": threats_detected,
        "detection_rate": round(threats_detected / max(total_scans, 1) * 100, 1),
        "models_active": len([k for k in models.keys() if not k.endswith('_info') and not k.endswith('_features')]),
        "category_distribution": category_counts,
        "risk_distribution": risk_counts,
        "scan_type_distribution": type_counts,
        "result_distribution": result_counts,
        "daily_trend": daily_trend[::-1],
        "recent_scans": recent,
        "model_info": model_info,
        "timestamp": datetime.datetime.now().isoformat()
    }


@app.get("/model-status")
def model_status():
    """Get status of all loaded models."""
    status = {}
    model_names = {
        'tfidf': 'TF-IDF Vectorizer',
        'scam_lr': 'Logistic Regression (Text)',
        'scam_nb': 'Naive Bayes (Text)',
        'scam_rf': 'Random Forest (Text)',
        'url_rf': 'Random Forest (URL)',
        'job_tfidf': 'TF-IDF (Job)',
        'job_detector': 'Logistic Regression (Job)',
        'financial_scaler': 'Standard Scaler (Financial)',
        'financial_detector': 'Gradient Boosting (Financial)'
    }

    for key, name in model_names.items():
        status[key] = {
            "name": name,
            "loaded": key in models,
            "status": "active" if key in models else "not loaded"
        }

    return {"models": status, "total_loaded": len(models)}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
