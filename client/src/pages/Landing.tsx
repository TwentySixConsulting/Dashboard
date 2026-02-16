import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  Layers,
  ChevronRight,
  Award,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Gift,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";
import { login } from "@/lib/auth";

interface LandingProps {
  onLogin: () => void;
  onStartToday: () => void;
}

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function MiniBarChart() {
  const bars = [
    { label: "Analyst", actual: 27, median: 29.5, color: "bg-amber-400" },
    { label: "Data Eng", actual: 47.5, median: 50, color: "bg-amber-400" },
    { label: "PM", actual: 60, median: 55, color: "bg-emerald-400" },
    { label: "CTO", actual: 95, median: 90, color: "bg-emerald-400" },
    { label: "Designer", actual: 42, median: 40, color: "bg-emerald-400" },
  ];
  const max = 100;
  return (
    <div className="space-y-3">
      {bars.map((b, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-500 font-medium">{b.label}</span>
            <span className="text-slate-400">£{b.actual}k vs £{b.median}k</span>
          </div>
          <div className="relative h-5 bg-slate-100 rounded-md overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-slate-200/80 rounded-md"
              style={{ width: `${(b.median / max) * 100}%` }}
            />
            <div
              className={`absolute inset-y-0 left-0 ${b.color} rounded-md opacity-90`}
              style={{ width: `${(b.actual / max) * 100}%`, animation: `grow-bar 1.5s ease-out ${i * 0.15}s both` }}
            />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-emerald-400 rounded-sm" />
          <span>Above Median</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-amber-400 rounded-sm" />
          <span>Below Median</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-slate-200 rounded-sm" />
          <span>Market Median</span>
        </div>
      </div>
    </div>
  );
}

function MiniPositioningTable() {
  const rows = [
    { role: "Product Manager", salary: "£60,000", position: "Above Median", pct: "+9.1%", positive: true },
    { role: "CTO", salary: "£95,000", position: "Upper Quartile", pct: "+5.6%", positive: true },
    { role: "Analyst", salary: "£27,000", position: "Below Median", pct: "-8.5%", positive: false },
    { role: "UX Designer", salary: "£42,000", position: "Above Median", pct: "+5.0%", positive: true },
    { role: "Data Engineer", salary: "£47,500", position: "Below Median", pct: "-5.0%", positive: false },
  ];
  return (
    <div className="overflow-hidden rounded-lg border border-slate-100">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-slate-50/80">
            <th className="text-left py-2 px-3 font-semibold text-slate-500">Role</th>
            <th className="text-right py-2 px-3 font-semibold text-slate-500">Salary</th>
            <th className="text-right py-2 px-3 font-semibold text-slate-500">vs Market</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-50">
              <td className="py-2 px-3 text-slate-700 font-medium">{r.role}</td>
              <td className="py-2 px-3 text-right text-slate-600">{r.salary}</td>
              <td className="py-2 px-3 text-right">
                <span className={`inline-flex items-center gap-0.5 font-semibold ${r.positive ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {r.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {r.pct}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniDonutPreview() {
  return (
    <div className="flex items-center gap-5">
      <div className="relative w-24 h-24 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12"
            strokeDasharray={`${0.6 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
            className="transition-all duration-1000" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12"
            strokeDasharray={`${0.3 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
            strokeDashoffset={`${-0.6 * 2 * Math.PI * 40}`}
            className="transition-all duration-1000" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="12"
            strokeDasharray={`${0.1 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
            strokeDashoffset={`${-0.9 * 2 * Math.PI * 40}`}
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">60%</p>
            <p className="text-[9px] text-slate-400">Competitive</p>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-600">At or above median</span>
          <span className="ml-auto font-semibold text-slate-800">6 roles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-600">Slightly below</span>
          <span className="ml-auto font-semibold text-slate-800">3 roles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-slate-600">Retention risk</span>
          <span className="ml-auto font-semibold text-slate-800">1 role</span>
        </div>
      </div>
    </div>
  );
}

export function Landing({ onLogin, onStartToday }: LandingProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <style>{`
        @keyframes grow-bar {
          from { width: 0%; }
        }
        @keyframes float-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float-up { animation: float-up 0.8s ease-out both; }
        .animate-float-up-delay { animation: float-up 0.8s ease-out 0.2s both; }
        .animate-float-up-delay2 { animation: float-up 0.8s ease-out 0.4s both; }
        .animate-fade-in { animation: fade-in 1s ease-out 0.3s both; }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 tracking-tight leading-none">Pay & Benefits</p>
              <p className="text-[10px] text-slate-400 mt-0.5">by TwentySix</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-800"
              onClick={() => {
                setShowLogin(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              data-testid="button-login-nav"
            >
              Log in
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              onClick={onStartToday}
              data-testid="button-start-nav"
            >
              Start Today <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[65vh]">
            <div className="space-y-8 animate-float-up">
              <div>
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  UK Market Data, Updated Quarterly
                </div>
                <h1 className="text-4xl lg:text-[3.25rem] font-display font-bold text-slate-900 leading-[1.15] tracking-tight">
                  Know exactly where your
                  <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent"> pay stands </span>
                  in the market
                </h1>
                <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg">
                  TwentySix delivers clear, data-driven salary benchmarking and benefits analysis so you can make confident reward decisions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all text-base px-8 h-12"
                  onClick={onStartToday}
                  data-testid="button-start-hero"
                >
                  Start Today <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-slate-600 border-slate-200 hover:bg-slate-50 text-base px-8 h-12"
                  onClick={() => {
                    setShowLogin(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  data-testid="button-login-hero"
                >
                  Log in to Dashboard
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-2">
                {["Real market data", "Quarterly updates", "Actionable insights"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {showLogin ? (
              <Card className="p-8 shadow-xl border-slate-100 max-w-md mx-auto w-full animate-float-up" data-testid="login-form">
                <div className="text-center mb-6">
                  <img src={logoImage} alt="TwentySix" className="h-8 mx-auto mb-4 opacity-80" />
                  <h2 className="font-display font-bold text-xl text-slate-800">Welcome back</h2>
                  <p className="text-sm text-slate-400 mt-1">Log in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-600 text-sm">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="h-11"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-600 text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-11 pr-10"
                        data-testid="input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                    disabled={loading}
                    data-testid="button-submit-login"
                  >
                    {loading ? "Logging in..." : "Log in"}
                  </Button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-5">
                  Don't have an account?{" "}
                  <button onClick={onStartToday} className="text-indigo-500 font-medium hover:underline" data-testid="link-signup">
                    Start today
                  </button>
                </p>
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 mt-3 block mx-auto"
                >
                  Back to overview
                </button>
              </Card>
            ) : (
              <div className="relative animate-float-up-delay">
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-3xl blur-2xl" />
                <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-700/50 rounded-md px-3 py-1 text-[10px] text-slate-300">
                        <BarChart3 className="w-3 h-3" />
                        Pay & Benefits Dashboard
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Market Comparison</p>
                        <p className="text-sm font-display font-bold text-slate-800 mt-0.5">Salary vs Market Median</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1 text-[10px] font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        Q1 2026
                      </div>
                    </div>
                    <MiniBarChart />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 10, suffix: "+", label: "Roles Benchmarked", icon: Briefcase },
              { value: 4, suffix: "", label: "Market Quartiles", icon: BarChart3 },
              { value: 15, suffix: "+", label: "Benefit Categories", icon: Gift },
              { value: 100, suffix: "%", label: "UK Market Data", icon: Target },
            ].map((stat, i) => (
              <Card key={i} className="p-5 text-center border-slate-100 hover:shadow-md transition-all" data-testid={`stat-card-${i}`}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-4.5 h-4.5 text-indigo-500" />
                </div>
                <p className="text-2xl font-display font-bold text-slate-800">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-6 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
              <PieChart className="w-3.5 h-3.5" />
              See What You'll Get
            </div>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-800">
              Your personalised pay report, visualised
            </h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto text-base">
              Every report includes clear charts, positioning analysis, and strategic recommendations tailored to your organisation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-display font-bold text-sm">Market Comparison</p>
                  <p className="text-blue-100 text-xs">Actual pay vs market median by role</p>
                </div>
              </div>
              <div className="p-6">
                <MiniBarChart />
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    See exactly how each role's salary compares to market quartiles with colour-coded positioning.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-display font-bold text-sm">Role-by-Role Breakdown</p>
                  <p className="text-violet-100 text-xs">Detailed positioning for every role</p>
                </div>
              </div>
              <div className="p-6">
                <MiniPositioningTable />
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Every role gets its own analysis card showing salary, market position, and actionable insight.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-display font-bold text-sm">Risk & Retention Analysis</p>
                  <p className="text-amber-100 text-xs">Identify pay gaps before they cost you</p>
                </div>
              </div>
              <div className="p-6">
                <MiniDonutPreview />
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Spot which roles are competitively positioned and which need attention to reduce turnover risk.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-600 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-display font-bold text-sm">Benefits & Bonus Insights</p>
                  <p className="text-teal-100 text-xs">Complete total reward picture</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { name: "Private Healthcare", pct: 78, trend: "up" },
                    { name: "Pension Match (5%+)", pct: 65, trend: "up" },
                    { name: "Hybrid / Remote", pct: 85, trend: "up" },
                    { name: "Share Options", pct: 42, trend: "stable" },
                    { name: "Training Budget", pct: 58, trend: "up" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-600 w-32 shrink-0 font-medium">{b.name}</span>
                      <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"
                          style={{ width: `${b.pct}%`, animation: `grow-bar 1.5s ease-out ${i * 0.1}s both` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 w-9 text-right">{b.pct}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    See how your benefits stack up against industry prevalence rates and emerging trends.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-800">
              Everything you need for confident pay decisions
            </h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto">
              Our dashboard gives you a comprehensive view of how your compensation stacks up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Salary Benchmarking",
                desc: "Compare your pay structures against real UK market data across quartiles.",
                gradient: "from-indigo-50 to-blue-50",
                iconColor: "text-indigo-500",
              },
              {
                icon: TrendingUp,
                title: "Market Insights",
                desc: "Stay ahead with the latest pay trends, CPI data, and sector-specific analysis.",
                gradient: "from-emerald-50 to-teal-50",
                iconColor: "text-emerald-500",
              },
              {
                icon: Users,
                title: "Role-by-Role Analysis",
                desc: "Detailed breakdowns for every role, showing exactly where you stand in the market.",
                gradient: "from-violet-50 to-purple-50",
                iconColor: "text-violet-500",
              },
              {
                icon: Shield,
                title: "Risk Identification",
                desc: "Spot retention risks and competitive gaps before they become costly problems.",
                gradient: "from-amber-50 to-orange-50",
                iconColor: "text-amber-500",
              },
              {
                icon: Target,
                title: "Benefits Comparison",
                desc: "See how your benefits package stacks up against industry best practice.",
                gradient: "from-teal-50 to-cyan-50",
                iconColor: "text-teal-500",
              },
              {
                icon: Lightbulb,
                title: "Strategic Guidance",
                desc: "Actionable next steps and recommendations tailored to your organisation.",
                gradient: "from-cyan-50 to-blue-50",
                iconColor: "text-cyan-500",
              },
            ].map((f, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-all duration-300 border-slate-100 group" data-testid={`feature-card-${i}`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-white mb-4">
                Get started in three simple steps
              </h2>
              <p className="text-slate-400 text-base mb-10">
                From signup to your full report in minutes, not weeks.
              </p>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Create your account", desc: "Tell us about you and your organisation." },
                  { step: "2", title: "Enter your roles", desc: "Add roles online or upload a spreadsheet with salaries." },
                  { step: "3", title: "View your report", desc: "Instantly access your personalised pay & benefits dashboard." },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
                      {s.step}
                    </div>
                    <div>
                      <p className="text-white font-display font-bold">{s.title}</p>
                      <p className="text-slate-400 text-sm mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              <Card className="relative bg-white/10 backdrop-blur-sm border-white/10 p-6 rounded-2xl">
                <div className="bg-white rounded-xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sample Insight</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-700">Strength</span>
                      </div>
                      <p className="text-xs text-emerald-600">Your senior roles are positioned competitively above the upper quartile, supporting leadership retention.</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-700">Watch</span>
                      </div>
                      <p className="text-xs text-amber-600">Entry-level analyst pay falls 8.5% below market median. Consider reviewing to improve early-career attraction.</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs font-semibold text-blue-700">Recommendation</span>
                      </div>
                      <p className="text-xs text-blue-600">Introduce a structured progression framework to bridge the gap between entry and mid-level salary bands.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-800 mb-4">Ready to benchmark your pay?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-base">
            Get started in minutes. Tell us about your organisation and roles, and we'll build your personalised dashboard.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 text-base px-10 h-12"
              onClick={onStartToday}
              data-testid="button-start-cta"
            >
              Start Today <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-slate-600 border-slate-200 text-base h-12"
              onClick={() => {
                setShowLogin(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              data-testid="button-login-cta"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="TwentySix" className="h-5 opacity-60" />
          </div>
          <p className="text-xs text-slate-400">TwentySix Reward Consultancy</p>
        </div>
      </footer>
    </div>
  );
}
