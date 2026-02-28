const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface DetectionResult {
  is_scam: boolean;
  scam_probability: number;
  risk_level: string;
  category: string;
  explanations: string[];
  model_confidence: {
    logistic_regression: number;
    naive_bayes: number;
    random_forest: number;
    ensemble: number;
  };
  timestamp: string;
}

export interface URLResult {
  is_phishing: boolean;
  risk_score: number;
  risk_level: string;
  features_detected: Record<string, boolean>;
  explanations: string[];
  timestamp: string;
}

export interface JobResult {
  is_fake: boolean;
  fraud_probability: number;
  risk_level: string;
  explanations: string[];
  timestamp: string;
}

export interface AnalyticsData {
  total_scans: number;
  threats_detected: number;
  detection_rate: number;
  models_active: number;
  category_distribution: Record<string, number>;
  risk_distribution: Record<string, number>;
  scan_type_distribution: Record<string, number>;
  result_distribution: Record<string, number>;
  daily_trend: { date: string; scans: number; threats: number }[];
  recent_scans: {
    timestamp: string;
    type: string;
    result: string;
    risk_level: string;
    category: string;
  }[];
  model_info: Record<string, Record<string, number>>;
  timestamp: string;
}

export async function detectMessage(message: string): Promise<DetectionResult> {
  const resp = await fetch(`${API_BASE}/detect-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: "Server error" }));
    throw new Error(err.detail || "Failed to analyze message");
  }
  return resp.json();
}

export async function scanURL(url: string): Promise<URLResult> {
  const resp = await fetch(`${API_BASE}/scan-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: "Server error" }));
    throw new Error(err.detail || "Failed to scan URL");
  }
  return resp.json();
}

export async function detectJob(data: {
  title: string;
  company_profile: string;
  description: string;
  requirements: string;
  benefits: string;
}): Promise<JobResult> {
  const resp = await fetch(`${API_BASE}/detect-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: "Server error" }));
    throw new Error(err.detail || "Failed to detect job scam");
  }
  return resp.json();
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const resp = await fetch(`${API_BASE}/analytics`);
  if (!resp.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return resp.json();
}
