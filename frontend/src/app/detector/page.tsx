"use client";

import { RiskBadge, RiskMeter } from "@/components/RiskDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { detectMessage, type DetectionResult } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    Brain,
    CheckCircle,
    Info,
    Loader2,
    RotateCcw,
    ScanLine,
    Shield,
} from "lucide-react";
import { useState } from "react";

const exampleMessages = [
  "Congratulations! You have won ₹25 lakh in our lucky draw lottery. Click this link to claim your prize: http://bit.ly/win-prize-now",
  "URGENT: Your bank account has been blocked due to KYC expiry. Click here to verify: http://sbi-kyc-update.xyz/login",
  "Dear sir, I am a diplomat from Nigeria with $4.5 million to transfer to your account. Please share your bank details urgently.",
  "Work from home and earn ₹50,000 per day! No experience needed. Just simple data entry tasks. Contact us on WhatsApp.",
  "ALERT: Someone logged into your account from a new device. Share your OTP immediately to secure your account.",
  "Hi, this is from Cyber Crime department. A case has been filed against you. Pay ₹50,000 to avoid digital arrest.",
];

export default function DetectorPage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await detectMessage(message);
      setResult(res);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to analyze message. Ensure backend is running.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessage("");
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
          <ScanLine className="h-4 w-4" />
          AI Scam Detection Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Scam Message Detector
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Paste any suspicious message, email, or SMS to instantly detect if
          it&apos;s a scam using our multi-model AI engine.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-cyan-400" />
                Analyze Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste a suspicious message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[200px] resize-none text-base"
              />

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={!message.trim() || loading}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ScanLine className="h-5 w-5" />
                      Analyze Message
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} size="lg">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {/* Example Messages */}
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                  Try example messages:
                </p>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {exampleMessages.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(ex)}
                      className="w-full text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all text-xs text-slate-400 hover:text-slate-300 line-clamp-2"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-red-500/30">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <p className="text-red-400 font-medium">{error}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Make sure the backend server is running on port 8000
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!result && !error && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                      <ScanLine className="h-10 w-10 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-lg font-medium">
                      Paste a message to scan
                    </p>
                    <p className="text-slate-600 text-sm mt-2">
                      Results will appear here
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center py-16">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
                      <Brain className="absolute inset-0 m-auto h-8 w-8 text-cyan-400" />
                    </div>
                    <p className="text-cyan-400 font-medium">
                      Analyzing with AI...
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Running multi-model detection
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                {/* Main Result Card */}
                <Card
                  className={
                    result.is_scam
                      ? "border-red-500/30 glow-red"
                      : "border-emerald-500/30 glow-green"
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {result.is_scam ? (
                          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {result.is_scam ? "SCAM DETECTED" : "APPEARS SAFE"}
                          </h3>
                          <p className="text-sm text-slate-400">
                            Category: {result.category}
                          </p>
                        </div>
                      </div>
                      <RiskBadge level={result.risk_level} size="lg" />
                    </div>

                    <RiskMeter value={result.scam_probability} />
                  </CardContent>
                </Card>

                {/* Model Confidence */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-cyan-400" />
                      Model Confidence Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Logistic Regression",
                          val: result.model_confidence.logistic_regression,
                        },
                        {
                          name: "Naive Bayes",
                          val: result.model_confidence.naive_bayes,
                        },
                        {
                          name: "Random Forest",
                          val: result.model_confidence.random_forest,
                        },
                        {
                          name: "Ensemble",
                          val: result.model_confidence.ensemble,
                        },
                      ].map((m) => (
                        <div key={m.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">{m.name}</span>
                            <span className="text-white font-medium">
                              {(m.val * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                              style={{ width: `${m.val * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Explanations */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Info className="h-4 w-4 text-cyan-400" />
                      AI Explanation
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
        </motion.div>
      </div>
    </div>
  );
}
