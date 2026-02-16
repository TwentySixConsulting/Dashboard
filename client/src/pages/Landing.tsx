import { useState } from "react";
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
  ChevronRight,
  Sparkles,
  Target,
  Layers,
} from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";
import { login } from "@/lib/auth";

interface LandingProps {
  onLogin: () => void;
  onStartToday: () => void;
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

  const features = [
    {
      icon: BarChart3,
      title: "Salary Benchmarking",
      desc: "Compare your pay structures against real UK market data across quartiles.",
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      desc: "Stay ahead with the latest pay trends, CPI data, and sector-specific analysis.",
    },
    {
      icon: Users,
      title: "Role-by-Role Analysis",
      desc: "Detailed breakdowns for every role, showing exactly where you stand in the market.",
    },
    {
      icon: Shield,
      title: "Risk Identification",
      desc: "Spot retention risks and competitive gaps before they become costly problems.",
    },
    {
      icon: Target,
      title: "Benefits Comparison",
      desc: "See how your benefits package stacks up against industry best practice.",
    },
    {
      icon: Layers,
      title: "Strategic Guidance",
      desc: "Actionable next steps and recommendations tailored to your organisation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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
              onClick={() => setShowLogin(true)}
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

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh]">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  UK Market Data, Updated Quarterly
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight tracking-tight">
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
                  onClick={() => setShowLogin(true)}
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
              <Card className="p-8 shadow-xl border-slate-100 max-w-md mx-auto w-full" data-testid="login-form">
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
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-blue-100/50 rounded-3xl blur-3xl" />
                <Card className="relative p-8 shadow-xl border-slate-100 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">What you'll get</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Full salary benchmarking against UK market quartiles",
                      "Role-by-role analysis with positioning insights",
                      "Benefits comparison across market sectors",
                      "Strengths & risk identification for retention",
                      "Strategic recommendations and next steps",
                      "Downloadable charts and export options",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <span className="text-sm text-slate-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-20 px-6 bg-gradient-to-b from-white to-slate-50/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl text-slate-800">Everything you need for confident pay decisions</h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto">
              Our dashboard gives you a comprehensive view of how your compensation stacks up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-all duration-300 border-slate-100 group" data-testid={`feature-card-${i}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="font-display font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-slate-800 mb-4">Ready to benchmark your pay?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Get started in minutes. Tell us about your organisation and roles, and we'll build your dashboard.
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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="TwentySix" className="h-5 opacity-60" />
          </div>
          <p className="text-xs text-slate-400">TwentySix Reward Consultancy</p>
        </div>
      </footer>
    </div>
  );
}
