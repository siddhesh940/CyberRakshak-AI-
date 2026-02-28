"""
CyberRakshak AI - Text Preprocessing Utilities
"""

import re


# Scam keyword patterns for category classification
SCAM_PATTERNS: dict[str, list[str]] = {
    "Lottery Scam": [
        r'lottery', r'won\s+(a\s+)?prize', r'congratulations.*win', r'lucky\s+draw',
        r'claim\s+your\s+(prize|reward)', r'million\s+dollar', r'lakh.*prize',
        r'jackpot', r'sweepstake', r'raffle'
    ],
    "Fake Job Scam": [
        r'work\s+from\s+home', r'earn\s+\$?\d+.*per\s+(day|hour|week)',
        r'no\s+experience\s+needed', r'guaranteed\s+income', r'hiring\s+immediately',
        r'simple\s+task', r'data\s+entry\s+job', r'part\s*time.*earn'
    ],
    "Bank Fraud": [
        r'bank\s+account.*block', r'verify\s+your\s+(account|identity)',
        r'kyc\s+(update|verification|expire)', r'account.*suspend',
        r'unauthorized\s+transaction', r'bank.*alert', r'credit\s+card.*block',
        r'update.*banking\s+details'
    ],
    "OTP Fraud": [
        r'share\s+(your\s+)?otp', r'otp.*verify', r'send\s+(me\s+)?(the\s+)?otp',
        r'one\s+time\s+password', r'verification\s+code', r'otp.*expired',
        r'resend.*otp'
    ],
    "UPI Payment Scam": [
        r'upi.*payment', r'google\s*pay', r'phone\s*pe', r'paytm.*send',
        r'upi\s*id', r'pay.*upi', r'qr\s+code.*scan', r'payment.*link',
        r'send\s+money.*upi'
    ],
    "Digital Arrest Scam": [
        r'digital\s+arrest', r'cyber\s+(crime|police|cell)',
        r'arrest\s+warrant', r'legal\s+action', r'police\s+complaint',
        r'fir\s+registered', r'court\s+notice', r'narcotics', r'money\s+laundering'
    ],
    "Investment Scam": [
        r'invest.*guaranteed\s+returns', r'double\s+your\s+money',
        r'high\s+return', r'investment\s+opportunity', r'roi.*\d+%',
        r'mutual\s+fund.*guaranteed', r'stock\s+tip', r'trading\s+signal',
        r'forex.*profit'
    ],
    "Phishing Link": [
        r'click\s+(here|this\s+link|below)', r'verify.*link',
        r'update.*password.*link', r'confirm.*account.*link',
        r'bit\.ly|tinyurl|goo\.gl', r'login.*expire', r'suspended.*click'
    ],
    "Crypto Scam": [
        r'bitcoin', r'crypto.*invest', r'blockchain.*opportunity',
        r'nft.*free', r'airdrop', r'crypto.*double', r'ethereum.*free',
        r'mining.*profit', r'wallet.*crypto'
    ],
    "Email Scam": [
        r'dear\s+(sir|madam|friend|beneficiary)', r'confidential.*business',
        r'next\s+of\s+kin', r'inheritance', r'million.*transfer',
        r'foreign\s+fund', r'dying\s+wish', r'unclaimed\s+fund',
        r'prince.*nigeria', r'diplomat.*consignment'
    ],
    "Social Engineering Scam": [
        r'urgent.*action\s+required', r'your\s+account.*compromise',
        r'security\s+alert', r'unusual\s+activity', r'someone\s+logged',
        r'password.*reset', r'suspicious.*login', r'immediate\s+attention'
    ]
}


def clean_text(text) -> str:
    """Clean and normalize text for model input."""
    if not isinstance(text, str):
        return ""
    text: str = text.lower().strip()
    text: str = re.sub(r'http\S+|www\S+|https\S+', ' URL ', text)
    text: str = re.sub(r'\S+@\S+', ' EMAIL ', text)
    text: str = re.sub(r'[₹$€£]\s*[\d,]+', ' MONEY ', text)
    text: str = re.sub(r'\b\d{10,}\b', ' PHONE ', text)
    text: str = re.sub(r'\b\d+\b', ' NUM ', text)
    text: str = re.sub(r'[^\w\s]', ' ', text)
    text: str = re.sub(r'\s+', ' ', text).strip()
    return text


def classify_scam_category(text):
    """Classify text into a specific scam category based on keyword patterns."""
    text_lower = text.lower()
    scores = {}

    for category, patterns in SCAM_PATTERNS.items():
        score = 0
        matched_patterns = []
        for pattern in patterns:
            matches = re.findall(pattern, text_lower)
            if matches:
                score += len(matches)
                matched_patterns.append(pattern)
        if score > 0:
            scores[category] = (score, matched_patterns)

    if not scores:
        return "Email Scam", []

    best_category = max(scores, key=lambda k: scores[k][0])
    return best_category, scores[best_category][1]


def extract_url_features(url):
    """Extract features from a URL for phishing detection."""
    features = {}

    features['UsingIP'] = 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url) else -1
    features['LongURL'] = 1 if len(url) > 75 else (-1 if len(url) < 54 else 0)
    features['ShortURL'] = 1 if re.search(r'bit\.ly|goo\.gl|tinyurl|t\.co|is\.gd|ow\.ly', url) else -1
    features['Symbol@'] = 1 if '@' in url else -1
    features['Redirecting//'] = 1 if url.count('//') > 1 else -1
    try:
        domain_part = url.split('//')[1].split('/')[0] if '//' in url else url
        features['PrefixSuffix-'] = 1 if '-' in domain_part else -1
    except:
        features['PrefixSuffix-'] = 0
    
    # Count subdomains
    try:
        domain = url.split('//')[1].split('/')[0] if '//' in url else url.split('/')[0]
        subdomain_count = domain.count('.') - 1
        features['SubDomains'] = 1 if subdomain_count > 2 else (0 if subdomain_count == 2 else -1)
    except:
        features['SubDomains'] = 0

    features['HTTPS'] = -1 if url.startswith('https') else 1
    features['DomainRegLen'] = 0
    features['Favicon'] = -1
    features['NonStdPort'] = -1
    try:
        domain_text = url.lower().split('//')[1] if '//' in url else ''
        features['HTTPSDomainURL'] = 1 if 'https' in domain_text else -1
    except:
        features['HTTPSDomainURL'] = -1
    features['RequestURL'] = -1
    features['AnchorURL'] = -1
    features['LinksInScriptTags'] = -1
    features['ServerFormHandler'] = -1
    features['InfoEmail'] = -1
    features['AbnormalURL'] = -1
    features['WebsiteForwarding'] = -1
    features['StatusBarCust'] = -1
    features['DisableRightClick'] = -1
    features['UsingPopupWindow'] = -1
    features['IframeRedirection'] = -1
    features['AgeofDomain'] = -1
    features['DNSRecording'] = -1
    features['WebsiteTraffic'] = -1
    features['PageRank'] = -1
    features['GoogleIndex'] = -1
    features['LinksPointingToPage'] = 0
    features['StatsReport'] = -1

    return features


def generate_explanation(text, scam_prob, category):
    """Generate human-readable explanation for why a message is flagged as scam."""
    explanations = []
    text_lower = text.lower()

    # Check for suspicious patterns
    if re.search(r'http\S+|www\S+|https\S+', text_lower):
        explanations.append("Contains suspicious URL/link")

    if re.search(r'click\s+(here|this|below)', text_lower):
        explanations.append("Urges to click on a link (phishing indicator)")

    if re.search(r'urgent|immediately|asap|right\s+now', text_lower):
        explanations.append("Creates urgency to pressure quick action")

    if re.search(r'won|winner|prize|reward|congratulations', text_lower):
        explanations.append("Claims you won a prize or reward (common scam tactic)")

    if re.search(r'password|account|verify|confirm|login', text_lower):
        explanations.append("Requests sensitive account information")

    if re.search(r'bank|credit\s*card|kyc|upi|payment', text_lower):
        explanations.append("References financial/banking details")

    if re.search(r'otp|verification\s+code|one\s+time', text_lower):
        explanations.append("Attempts to steal OTP/verification codes")

    if re.search(r'free|offer|discount|deal|limited\s+time', text_lower):
        explanations.append("Uses too-good-to-be-true offers")

    if re.search(r'arrest|police|legal|court|fine', text_lower):
        explanations.append("Uses fear/threat of legal action")

    if re.search(r'invest|return|profit|double|guaranteed', text_lower):
        explanations.append("Promises guaranteed financial returns")

    if re.search(r'\b[A-Z]{3,}\b', text):
        explanations.append("Uses excessive capitalization for attention")

    if re.search(r'[!]{2,}', text):
        explanations.append("Uses excessive exclamation marks")

    if not explanations:
        if scam_prob > 0.5:
            explanations.append("Text patterns match known scam message templates")
            explanations.append("AI model detected suspicious language patterns")

    return explanations


def get_risk_level(probability) -> str:
    """Convert probability to risk level."""
    if probability >= 0.8:
        return "CRITICAL"
    elif probability >= 0.6:
        return "HIGH"
    elif probability >= 0.4:
        return "MEDIUM"
    elif probability >= 0.2:
        return "LOW"
    else:
        return "SAFE"
