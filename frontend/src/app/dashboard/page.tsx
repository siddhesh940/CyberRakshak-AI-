"use client";

import { RiskBadge } from "@/components/RiskDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalytics, type AnalyticsData } from "@/lib/api";
import { motion } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Clock,
    Cpu,
    RefreshCw,
    ScanLine,
    Shield,
    Target,
    TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const COLORS = [
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
  "#f43f5e",
];

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAnalytics();
      setData(res);
      setError("");
    } catch {
      setError(
        "Could not connect to backend. Make sure the server is running.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const categoryData = data
    ? Object.entries(data.category_distribution).map(([name, value]) => ({
        name: name.length > 15 ? name.slice(0, 15) + "..." : name,
        value,
      }))
    : [];

  const riskData = data
    ? Object.entries(data.risk_distribution).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const scanTypeData = data
    ? Object.entries(data.scan_type_distribution).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-3">
            <BarChart3 className="h-4 w-4" />
            Security Operations Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Threat Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time cybersecurity intelligence and threat monitoring
          </p>
        </div>
        <Button
          onClick={fetchData}
          variant="outline"
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {error && (
        <Card className="border-yellow-500/30 mb-8">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <p className="text-yellow-400 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: "Total Scans",
            value: data?.total_scans ?? 0,
            icon: ScanLine,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
          },
          {
            label: "Threats Detected",
            value: data?.threats_detected ?? 0,
            icon: AlertTriangle,
            color: "text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
          },
          {
            label: "Detection Rate",
            value: `${data?.detection_rate ?? 0}%`,
            icon: Target,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
          },
          {
            label: "Models Active",
            value: data?.models_active ?? 0,
            icon: Cpu,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card
              className={`${stat.border} hover:border-slate-600 transition-all`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Scam Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyan-400" />
                Scam Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      fill="#06b6d4"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Activity className="h-10 w-10 mx-auto mb-2 text-slate-600" />
                    <p>No scan data yet. Start scanning to see analytics.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                Risk Level Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {riskData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {riskData.map((entry, index) => {
                        const riskColors: Record<string, string> = {
                          CRITICAL: "#ef4444",
                          HIGH: "#f97316",
                          MEDIUM: "#eab308",
                          LOW: "#3b82f6",
                          SAFE: "#22c55e",
                        };
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={riskColors[entry.name] || COLORS[index]}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Activity className="h-10 w-10 mx-auto mb-2 text-slate-600" />
                    <p>No risk data. Perform scans to populate.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Scan Activity & Type Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                Daily Scan Trend (7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data && data.daily_trend.some((d) => d.scans > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.daily_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(val) => val.slice(5)}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="scans"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="threats"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-500">
                  No trend data yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Scan Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-blue-400" />
                Scan Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={scanTypeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-500">
                  No scan type data yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Model Info & Recent Scans */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                Model Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.model_info && Object.keys(data.model_info).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(data.model_info).map(([name, info]) => (
                    <div
                      key={name}
                      className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white capitalize">
                          {name.replace(/_/g, " ")} Model
                        </span>
                        {typeof info === "object" && "accuracy" in info && (
                          <span className="text-sm font-bold text-emerald-400">
                            {((info.accuracy as number) * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {typeof info === "object" &&
                          Object.entries(info).map(([k, v]) => (
                            <span
                              key={k}
                              className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-400"
                            >
                              {k}:{" "}
                              {typeof v === "number" && v < 1
                                ? `${(v * 100).toFixed(1)}%`
                                : String(v)}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Cpu className="h-10 w-10 mx-auto mb-2 text-slate-600" />
                    <p>Model info available after training</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                Recent Scan Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.recent_scans && data.recent_scans.length > 0 ? (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  {data.recent_scans.map((scan, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            scan.result === "scam" ||
                            scan.result === "phishing" ||
                            scan.result === "fake"
                              ? "bg-red-400"
                              : "bg-emerald-400"
                          }`}
                        />
                        <div>
                          <p className="text-sm text-white capitalize">
                            {scan.type} scan
                          </p>
                          <p className="text-xs text-slate-500">
                            {scan.category || scan.result}
                          </p>
                        </div>
                      </div>
                      <RiskBadge level={scan.risk_level} size="sm" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Clock className="h-10 w-10 mx-auto mb-2 text-slate-600" />
                    <p>No recent scans</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
