"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Brain,
    Briefcase,
    ChevronRight,
    Eye,
    Globe,
    Layers,
    Link2,
    Lock,
    ScanLine,
    Shield,
    ShieldCheck,
    Zap,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: ScanLine,
    title: "Scam Message Detector",
    desc: "AI-powered detection of phishing, spam, and scam messages using NLP and multi-model ensemble learning.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: Link2,
    title: "Phishing URL Scanner",
    desc: "Instantly scan suspicious URLs for phishing indicators with 30+ feature analysis and ML models.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Briefcase,
    title: "Fake Job Detector",
    desc: "Identify fraudulent job postings and recruitment scams before you fall victim.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Real-time cybersecurity analytics with threat distribution, risk levels, and scan history.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Brain,
    title: "AI Explanations",
    desc: "Understand WHY a message is flagged as a scam with detailed AI-generated explanations.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: Layers,
    title: "Multi-Model Engine",
    desc: "Ensemble of Logistic Regression, Random Forest, and Naive Bayes for maximum accuracy.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const scamCategories = [
  "Lottery Scam",
  "Fake Job Scam",
  "Bank Fraud",
  "OTP Fraud",
  "UPI Payment Scam",
  "Digital Arrest Scam",
  "Investment Scam",
  "Phishing Link",
  "Crypto Scam",
  "Email Scam",
  "Social Engineering",
];

const stats = [
  { value: "11+", label: "Scam Categories", icon: Shield },
  { value: "200K+", label: "Training Samples", icon: Layers },
  { value: "97%+", label: "Detection Accuracy", icon: Eye },
  { value: "< 1s", label: "Response Time", icon: Zap },
];

const howItWorks = [
  {
    step: "01",
    title: "Paste Suspicious Content",
    desc: "Copy and paste the suspicious message, URL, or job posting into our analyzer.",
  },
  {
    step: "02",
    title: "AI Analysis",
    desc: "Our multi-model AI engine analyzes the content using NLP and machine learning.",
  },
  {
    step: "03",
    title: "Get Results",
    desc: "Receive instant risk assessment with scam probability, category, and explanation.",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
              <Shield className="h-4 w-4" />
              AI-Powered Cybersecurity Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Cyber</span>
            <span className="gradient-text">Rakshak</span>
            <span className="text-white"> AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-4"
          >
            Detect social media scams, phishing attacks, and digital fraud with
            advanced AI and machine learning
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base text-slate-500 max-w-2xl mx-auto mb-10"
          >
            Protecting citizens from lottery scams, fake jobs, OTP fraud, UPI
            scams, digital arrest threats, and more — powered by NLP &amp;
            ensemble ML models.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/detector">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base gap-2 glow-cyan"
              >
                <ScanLine className="h-5 w-5" />
                Scan for Scams
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base gap-2"
              >
                <BarChart3 className="h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            {scamCategories.map((cat, i) => (
              <motion.span
                key={cat}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400 transition-all cursor-default"
              >
                {cat}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Complete Scam Detection Suite
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Advanced AI tools to protect you from every type of online scam
              and fraud
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full hover:border-slate-700 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bg} border ${feature.border} mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Three Simple Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="h-full relative overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-6xl font-bold text-cyan-500/10 absolute top-4 right-6">
                      {item.step}
                    </div>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                        <span className="text-cyan-400 font-bold text-sm">
                          {item.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CYBER SAFETY STATS */}
      <section className="py-24 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-red-400 text-sm font-semibold tracking-wider uppercase">
              Why This Matters
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Cyber Crime Statistics
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                val: "₹1.25L Cr",
                label: "Annual cyber fraud losses in India",
                color: "text-red-400",
                bg: "border-red-500/20",
              },
              {
                val: "65%",
                label: "Rise in phishing attacks (2024)",
                color: "text-orange-400",
                bg: "border-orange-500/20",
              },
              {
                val: "3.2M+",
                label: "Cyber crime complaints filed",
                color: "text-yellow-400",
                bg: "border-yellow-500/20",
              },
              {
                val: "47%",
                label: "Victims are 18-35 age group",
                color: "text-purple-400",
                bg: "border-purple-500/20",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`${stat.bg} hover:border-slate-600 transition-all`}
                >
                  <CardContent className="p-6 text-center">
                    <AlertTriangle
                      className={`h-6 w-6 ${stat.color} mx-auto mb-3`}
                    />
                    <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                      {stat.val}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ShieldCheck className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stay Protected. Stay Vigilant.
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Don&apos;t let scammers win. Use CyberRakshak AI to verify
              suspicious messages, URLs, and job postings before it&apos;s too
              late.
            </p>
            <Link href="/detector">
              <Button size="lg" className="text-base gap-2 glow-cyan">
                <ScanLine className="h-5 w-5" />
                Start Scanning Now
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-cyan-400" />
              <span className="font-bold text-white">
                Cyber<span className="text-cyan-400">Rakshak</span> AI
              </span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; 2026 CyberRakshak AI. AI-Powered Scam Detection Platform.
            </p>
            <div className="flex items-center gap-4">
              <Globe className="h-4 w-4 text-slate-500" />
              <Lock className="h-4 w-4 text-slate-500" />
              <ShieldCheck className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
