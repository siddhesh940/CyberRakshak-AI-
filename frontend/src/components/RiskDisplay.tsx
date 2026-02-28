"use client";

import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldX,
} from "lucide-react";

const riskConfig: Record<
  string,
  {
    color: string;
    bg: string;
    border: string;
    icon: typeof Shield;
    label: string;
  }
> = {
  CRITICAL: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: ShieldX,
    label: "CRITICAL",
  },
  HIGH: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    icon: ShieldAlert,
    label: "HIGH RISK",
  },
  MEDIUM: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: AlertTriangle,
    label: "MEDIUM",
  },
  LOW: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: Shield,
    label: "LOW RISK",
  },
  SAFE: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: ShieldCheck,
    label: "SAFE",
  },
};

export function RiskBadge({
  level,
  size = "md",
}: {
  level: string;
  size?: "sm" | "md" | "lg";
}) {
  const config = riskConfig[level] || riskConfig.MEDIUM;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold border",
        config.bg,
        config.border,
        config.color,
        sizeClasses[size],
      )}
    >
      <Icon
        className={cn(
          size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
        )}
      />
      {config.label}
    </span>
  );
}

export function RiskMeter({ value }: { value: number }) {
  const percentage = Math.round(value * 100);
  const getColor = () => {
    if (percentage >= 80) return "from-red-500 to-red-600";
    if (percentage >= 60) return "from-orange-500 to-orange-600";
    if (percentage >= 40) return "from-yellow-500 to-yellow-600";
    if (percentage >= 20) return "from-blue-500 to-blue-600";
    return "from-emerald-500 to-emerald-600";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">Threat Score</span>
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out",
            getColor(),
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
