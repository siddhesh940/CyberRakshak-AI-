"""
CyberRakshak AI - ML Model Training Script
Trains all detection models from the datasets.
"""

import os
import warnings
import re

import pandas as pd
import joblib
import sklearn.feature_extraction.text
import sklearn.linear_model
import sklearn.ensemble
import sklearn.naive_bayes
import sklearn.model_selection
import sklearn.metrics
import sklearn.preprocessing

warnings.filterwarnings('ignore')

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(PROJECT_ROOT, 'datasets')
MODEL_DIR = os.path.join(PROJECT_ROOT, 'backend', 'models')
os.makedirs(MODEL_DIR, exist_ok=True)


def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', ' URL ', text)
    text = re.sub(r'\S+@\S+', ' EMAIL ', text)
    text = re.sub(r'[$\u20b9\u20ac\u00a3]\s*[\d,]+', ' MONEY ', text)
    text = re.sub(r'\b\d{10,}\b', ' PHONE ', text)
    text = re.sub(r'\b\d+\b', ' NUM ', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def load_spam_datasets():
    texts = []
    labels = []

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'spam.csv'), encoding='latin-1', on_bad_lines='skip')
        df = df[['v1', 'v2']].dropna()
        texts.extend(df['v2'].tolist())
        labels.extend([1 if v == 'spam' else 0 for v in df['v1']])
        print(f"  spam.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  spam.csv error: {e}")

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'spam_ham_dataset.csv'), encoding='utf-8', on_bad_lines='skip')
        df = df[['label', 'text']].dropna()
        texts.extend(df['text'].tolist())
        labels.extend([1 if v == 'spam' else 0 for v in df['label']])
        print(f"  spam_ham_dataset.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  spam_ham_dataset.csv error: {e}")

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'Enron.csv'), encoding='utf-8', on_bad_lines='skip')
        df = df[['subject', 'body', 'label']].dropna(subset=['body', 'label'])
        df['text'] = df['subject'].fillna('') + ' ' + df['body'].fillna('')
        texts.extend(df['text'].tolist())
        labels.extend([1 if v == 1 else 0 for v in df['label']])
        print(f"  Enron.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  Enron.csv error: {e}")

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'Nigerian_Fraud.csv'), encoding='utf-8', on_bad_lines='skip')
        df = df[['subject', 'body', 'label']].dropna(subset=['body', 'label'])
        df['text'] = df['subject'].fillna('') + ' ' + df['body'].fillna('')
        texts.extend(df['text'].tolist())
        labels.extend([1 if v == 1 else 0 for v in df['label']])
        print(f"  Nigerian_Fraud.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  Nigerian_Fraud.csv error: {e}")

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'SpamAssasin.csv'), encoding='utf-8', on_bad_lines='skip')
        df = df[['subject', 'body', 'label']].dropna(subset=['body', 'label'])
        df['text'] = df['subject'].fillna('') + ' ' + df['body'].fillna('')
        texts.extend(df['text'].tolist())
        labels.extend([1 if v == 1 else 0 for v in df['label']])
        print(f"  SpamAssasin.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  SpamAssasin.csv error: {e}")

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'phishing_email.csv'), encoding='utf-8', on_bad_lines='skip')
        df = df[['text_combined', 'label']].dropna()
        texts.extend(df['text_combined'].tolist())
        labels.extend([1 if v == 1 else 0 for v in df['label']])
        print(f"  phishing_email.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  phishing_email.csv error: {e}")

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'CEAS_08.csv'), encoding='utf-8', on_bad_lines='skip')
        df = df[['subject', 'body', 'label']].dropna(subset=['body', 'label'])
        df['text'] = df['subject'].fillna('') + ' ' + df['body'].fillna('')
        texts.extend(df['text'].tolist())
        labels.extend([1 if v == 1 else 0 for v in df['label']])
        print(f"  CEAS_08.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  CEAS_08.csv error: {e}")

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'Ling.csv'), encoding='utf-8', on_bad_lines='skip')
        df = df[['subject', 'body', 'label']].dropna(subset=['body', 'label'])
        df['text'] = df['subject'].fillna('') + ' ' + df['body'].fillna('')
        texts.extend(df['text'].tolist())
        labels.extend([1 if v == 1 else 0 for v in df['label']])
        print(f"  Ling.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  Ling.csv error: {e}")

    try:
        df = pd.read_csv(os.path.join(DATASET_DIR, 'Nazario.csv'), encoding='utf-8', on_bad_lines='skip')
        df = df[['subject', 'body', 'label']].dropna(subset=['body', 'label'])
        df['text'] = df['subject'].fillna('') + ' ' + df['body'].fillna('')
        texts.extend(df['text'].tolist())
        labels.extend([1 if v == 1 else 0 for v in df['label']])
        print(f"  Nazario.csv: {len(df)} rows loaded")
    except Exception as e:
        print(f"  Nazario.csv error: {e}")

    return texts, labels


def train_text_scam_detector():
    print("\n" + "=" * 60)
    print("TRAINING TEXT SCAM DETECTION MODEL")
    print("=" * 60)

    print("Loading datasets...")
    texts, labels = load_spam_datasets()
    print(f"\nTotal samples: {len(texts)}")
    print(f"Scam: {sum(labels)}, Legit: {len(labels) - sum(labels)}")

    print("Cleaning text data...")
    cleaned = [clean_text(t) for t in texts]

    valid = [(t, l) for t, l in zip(cleaned, labels) if len(t) > 5]
    cleaned, labels = zip(*valid)
    cleaned = list(cleaned)
    labels = list(labels)
    print(f"After cleaning: {len(cleaned)} samples")

    X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(
        cleaned, labels, test_size=0.2, random_state=42, stratify=labels
    )

    print("\nTraining TF-IDF + Logistic Regression...")
    tfidf = sklearn.feature_extraction.text.TfidfVectorizer(max_features=15000, ngram_range=(1, 2), sublinear_tf=True)
    X_train_tfidf = tfidf.fit_transform(X_train)
    X_test_tfidf = tfidf.transform(X_test)

    lr = sklearn.linear_model.LogisticRegression(max_iter=1000, C=1.0, random_state=42)
    lr.fit(X_train_tfidf, y_train)
    y_pred = lr.predict(X_test_tfidf)
    acc = sklearn.metrics.accuracy_score(y_test, y_pred)
    print(f"  Logistic Regression Accuracy: {acc:.4f}")

    print("Training Naive Bayes...")
    nb = sklearn.naive_bayes.MultinomialNB(alpha=0.1)
    nb.fit(X_train_tfidf, y_train)
    y_pred_nb = nb.predict(X_test_tfidf)
    acc_nb = sklearn.metrics.accuracy_score(y_test, y_pred_nb)
    print(f"  Naive Bayes Accuracy: {acc_nb:.4f}")

    print("Training Random Forest...")
    rf = sklearn.ensemble.RandomForestClassifier(n_estimators=100, max_depth=50, random_state=42, n_jobs=-1)
    rf.fit(X_train_tfidf, y_train)
    y_pred_rf = rf.predict(X_test_tfidf)
    acc_rf = sklearn.metrics.accuracy_score(y_test, y_pred_rf)
    print(f"  Random Forest Accuracy: {acc_rf:.4f}")

    print("\nSaving models...")
    joblib.dump(tfidf, os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl'))
    joblib.dump(lr, os.path.join(MODEL_DIR, 'scam_detector_lr.pkl'))
    joblib.dump(nb, os.path.join(MODEL_DIR, 'scam_detector_nb.pkl'))
    joblib.dump(rf, os.path.join(MODEL_DIR, 'scam_detector_rf.pkl'))

    info = {
        'logistic_regression': acc,
        'naive_bayes': acc_nb,
        'random_forest': acc_rf,
        'total_samples': len(cleaned),
        'features': tfidf.max_features
    }
    joblib.dump(info, os.path.join(MODEL_DIR, 'text_model_info.pkl'))
    print("Text scam detector saved!")
    return info


def train_phishing_url_detector():
    print("\n" + "=" * 60)
    print("TRAINING PHISHING URL DETECTION MODEL")
    print("=" * 60)

    df = pd.read_csv(os.path.join(DATASET_DIR, 'phishing.csv'), encoding='utf-8')
    print(f"Loaded phishing.csv: {len(df)} rows")

    feature_cols = [c for c in df.columns if c not in ['Index', 'class']]
    X = df[feature_cols].fillna(0)
    y = df['class'].map({-1: 1, 0: 0, 1: 0})

    X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest for URL detection...")
    rf = sklearn.ensemble.RandomForestClassifier(n_estimators=150, max_depth=30, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)
    acc = sklearn.metrics.accuracy_score(y_test, y_pred)
    print(f"  Accuracy: {acc:.4f}")

    joblib.dump(rf, os.path.join(MODEL_DIR, 'url_detector_rf.pkl'))
    joblib.dump(feature_cols, os.path.join(MODEL_DIR, 'url_feature_cols.pkl'))
    info = {'accuracy': acc, 'features': feature_cols, 'total_samples': len(df)}
    joblib.dump(info, os.path.join(MODEL_DIR, 'url_model_info.pkl'))
    print("URL phishing detector saved!")
    return info


def train_job_scam_detector():
    print("\n" + "=" * 60)
    print("TRAINING FAKE JOB DETECTION MODEL")
    print("=" * 60)

    df = pd.read_csv(os.path.join(DATASET_DIR, 'fake_job_postings.csv'), encoding='utf-8')
    print(f"Loaded fake_job_postings.csv: {len(df)} rows")

    text_cols = ['title', 'company_profile', 'description', 'requirements', 'benefits']
    df['combined_text'] = ''
    for col in text_cols:
        df['combined_text'] += ' ' + df[col].fillna('')

    df['combined_text'] = df['combined_text'].apply(clean_text)
    df = df[df['combined_text'].str.len() > 10]

    X_text = df['combined_text'].tolist()
    y = df['fraudulent'].tolist()
    print(f"Fraud: {sum(y)}, Legit: {len(y) - sum(y)}")

    X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(X_text, y, test_size=0.2, random_state=42, stratify=y)

    print("Training TF-IDF + Logistic Regression for job scam detection...")
    tfidf = sklearn.feature_extraction.text.TfidfVectorizer(max_features=10000, ngram_range=(1, 2), sublinear_tf=True)
    X_train_tfidf = tfidf.fit_transform(X_train)
    X_test_tfidf = tfidf.transform(X_test)

    lr = sklearn.linear_model.LogisticRegression(max_iter=1000, C=1.0, class_weight='balanced', random_state=42)
    lr.fit(X_train_tfidf, y_train)
    y_pred = lr.predict(X_test_tfidf)
    acc = sklearn.metrics.accuracy_score(y_test, y_pred)
    print(f"  Accuracy: {acc:.4f}")
    print(sklearn.metrics.classification_report(y_test, y_pred, target_names=['Legit', 'Fraud']))

    joblib.dump(tfidf, os.path.join(MODEL_DIR, 'job_tfidf_vectorizer.pkl'))
    joblib.dump(lr, os.path.join(MODEL_DIR, 'job_scam_detector.pkl'))
    info = {'accuracy': acc, 'total_samples': len(df), 'fraud_count': sum(y)}
    joblib.dump(info, os.path.join(MODEL_DIR, 'job_model_info.pkl'))
    print("Job scam detector saved!")
    return info


def train_financial_fraud_detector():
    print("\n" + "=" * 60)
    print("TRAINING FINANCIAL FRAUD DETECTION MODEL")
    print("=" * 60)

    df = pd.read_csv(os.path.join(DATASET_DIR, 'creditcard.csv'), encoding='utf-8')
    print(f"Loaded creditcard.csv: {len(df)} rows")

    feature_cols = [c for c in df.columns if c != 'Class']
    X = df[feature_cols].fillna(0)
    y = df['Class']
    print(f"Fraud: {sum(y)}, Legit: {len(y) - sum(y)}")

    fraud_idx = y[y == 1].index
    legit_idx = y[y == 0].sample(n=min(10000, len(y[y == 0])), random_state=42).index
    subset_idx = fraud_idx.append(legit_idx)
    X_sub = X.loc[subset_idx]
    y_sub = y.loc[subset_idx]

    X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(X_sub, y_sub, test_size=0.2, random_state=42, stratify=y_sub)

    scaler = sklearn.preprocessing.StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("Training Gradient Boosting for financial fraud detection...")
    gb = sklearn.ensemble.GradientBoostingClassifier(
        n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
    )
    gb.fit(X_train_scaled, y_train)
    y_pred = gb.predict(X_test_scaled)
    acc = sklearn.metrics.accuracy_score(y_test, y_pred)
    print(f"  Accuracy: {acc:.4f}")

    joblib.dump(scaler, os.path.join(MODEL_DIR, 'financial_scaler.pkl'))
    joblib.dump(gb, os.path.join(MODEL_DIR, 'financial_fraud_detector.pkl'))
    joblib.dump(feature_cols, os.path.join(MODEL_DIR, 'financial_feature_cols.pkl'))
    info = {'accuracy': acc, 'total_samples': len(df)}
    joblib.dump(info, os.path.join(MODEL_DIR, 'financial_model_info.pkl'))
    print("Financial fraud detector saved!")
    return info


if __name__ == '__main__':
    print("=" * 60)
    print("  CyberRakshak AI - Model Training Pipeline")
    print("=" * 60)

    results = {}
    results['text'] = train_text_scam_detector()
    results['url'] = train_phishing_url_detector()
    results['job'] = train_job_scam_detector()
    results['financial'] = train_financial_fraud_detector()

    print("\n" + "=" * 60)
    print("  ALL MODELS TRAINED SUCCESSFULLY!")
    print("=" * 60)
    for name, info in results.items():
        print(f"  {name}: {info}")
    print("\nModels saved to:", MODEL_DIR)
