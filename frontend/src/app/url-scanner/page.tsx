"use client";

import { RiskBadge, RiskMeter } from "@/components/RiskDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { scanURL, type URLResult } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    Check,
    CheckCircle,
    ExternalLink,
    Globe,
    Link2,
    Loader2,
    RotateCcw,
    Shield,
    XCircle,
} from "lucide-react";
import { useState } from "react";

const exampleURLs = [
  "http://192.168.1.1/banking/login.php",
  "http://secure-banking-login.xyz/sbi/verify",
  "https://bit.ly/free-iphone-win",
  "https://google.com",
  "http://amaz0n-security.com/verify-account",
  "https://github.com",
];

export default function URLScannerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<URLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await scanURL(url);
      setResult(res);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to scan URL";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
          <Link2 className="h-4 w-4" />
          URL Threat Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Phishing URL Scanner
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Paste any suspicious URL or link to detect phishing, malware, and
          malicious websites using AI-powered feature analysis.
        </p>
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto mb-10"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  placeholder="https://suspicious-link.example.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-12 h-12 text-base"
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                />
              </div>
              <Button
                onClick={handleScan}
                disabled={!url.trim() || loading}
                size="lg"
                className="gap-2 h-12"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Link2 className="h-5 w-5" />
                )}
                Scan URL
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                size="lg"
                className="h-12"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* Example URLs */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-slate-500">Try:</span>
              {exampleURLs.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setUrl(ex)}
                  className="text-xs px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 text-slate-400 hover:text-blue-400 transition-all truncate max-w-[200px]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-red-500/30">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-400 font-medium">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* Main Result */}
            <Card
              className={
                result.is_phishing
                  ? "border-red-500/30 glow-red"
                  : "border-emerald-500/30 glow-green"
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.is_phishing ? (
                      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="h-7 w-7 text-red-400" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle className="h-7 w-7 text-emerald-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {result.is_phishing
                          ? "PHISHING DETECTED"
                          : "URL APPEARS SAFE"}
                      </h3>
                      <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                        <ExternalLink className="h-3 w-3" />
                        {url.length > 60 ? url.slice(0, 60) + "..." : url}
                      </p>
                    </div>
                  </div>
                  <RiskBadge level={result.risk_level} size="lg" />
                </div>

                <RiskMeter value={result.risk_score} />
              </CardContent>
            </Card>

            {/* Feature Analysis */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  Feature Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.features_detected).map(
                    ([key, val]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-2 p-3 rounded-lg border ${
                          val
                            ? "bg-red-500/5 border-red-500/20"
                            : "bg-emerald-500/5 border-emerald-500/20"
                        }`}
                      >
                        {val ? (
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                        ) : (
                          <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        )}
                        <span className="text-sm text-slate-300">
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Explanations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  Threat Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.explanations.map((exp, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      {exp}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
