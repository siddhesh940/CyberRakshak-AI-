"use client";

import { RiskBadge, RiskMeter } from "@/components/RiskDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { detectJob, type JobResult } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    Briefcase,
    Building,
    CheckCircle,
    FileText,
    Gift,
    ListChecks,
    Loader2,
    RotateCcw,
} from "lucide-react";
import { useState } from "react";

export default function JobDetectorPage() {
  const [form, setForm] = useState({
    title: "",
    company_profile: "",
    description: "",
    requirements: "",
    benefits: "",
  });
  const [result, setResult] = useState<JobResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!form.description.trim() && !form.title.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await detectJob(form);
      setResult(res);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to analyze job posting";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: "",
      company_profile: "",
      description: "",
      requirements: "",
      benefits: "",
    });
    setResult(null);
    setError("");
  };

  const loadExample = () => {
    setForm({
      title: "Data Entry Operator - Work From Home - Earn ₹50,000/day",
      company_profile: "",
      description:
        "We are looking for candidates who can do simple data entry work from home. No experience or education required. You will earn guaranteed ₹50,000 per day. Just register with a small fee of ₹999 and start earning immediately. This is a limited time opportunity.",
      requirements:
        "No requirements. Anyone can apply. Must have a smartphone.",
      benefits:
        "Guaranteed daily income of ₹50,000. Free laptop after 1 month. Work only 2 hours per day.",
    });
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
          <Briefcase className="h-4 w-4" />
          Recruitment Fraud Detection
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Fake Job Detector
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Paste job posting details to detect fraudulent recruitment scams using
          AI.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-purple-400" />
                Job Posting Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Job Title
                </label>
                <Input
                  placeholder="e.g., Data Entry Operator - Work From Home"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 flex items-center gap-1 block">
                  <Building className="h-3 w-3" /> Company Profile
                </label>
                <Textarea
                  placeholder="Company description (leave blank if not provided)..."
                  value={form.company_profile}
                  onChange={(e) => update("company_profile", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 flex items-center gap-1 block">
                  <FileText className="h-3 w-3" /> Job Description
                </label>
                <Textarea
                  placeholder="Full job description..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 flex items-center gap-1 block">
                  <ListChecks className="h-3 w-3" /> Requirements
                </label>
                <Textarea
                  placeholder="Job requirements..."
                  value={form.requirements}
                  onChange={(e) => update("requirements", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 flex items-center gap-1 block">
                  <Gift className="h-3 w-3" /> Benefits
                </label>
                <Textarea
                  placeholder="Benefits offered..."
                  value={form.benefits}
                  onChange={(e) => update("benefits", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={
                    (!form.description.trim() && !form.title.trim()) || loading
                  }
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
                      <Briefcase className="h-5 w-5" />
                      Detect Fraud
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} size="lg">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={loadExample}
                className="w-full text-slate-400"
              >
                Load Example Fake Job Posting
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
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
                exit={{ opacity: 0 }}
              >
                <Card className="border-red-500/30">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <p className="text-red-400">{error}</p>
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
                      <Briefcase className="h-10 w-10 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-lg font-medium">
                      Paste job details to analyze
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
              >
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center py-16">
                    <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-purple-400 font-medium">
                      Analyzing job posting...
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
                className="space-y-4"
              >
                <Card
                  className={
                    result.is_fake
                      ? "border-red-500/30 glow-red"
                      : "border-emerald-500/30 glow-green"
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {result.is_fake ? (
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
                            {result.is_fake
                              ? "FAKE JOB DETECTED"
                              : "APPEARS LEGITIMATE"}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {form.title || "Analyzed Job Posting"}
                          </p>
                        </div>
                      </div>
                      <RiskBadge level={result.risk_level} size="lg" />
                    </div>

                    <RiskMeter value={result.fraud_probability} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                      Analysis Details
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
