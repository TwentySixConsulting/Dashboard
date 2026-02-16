import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  ArrowRight,
  Eye,
  EyeOff,
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f1129]">
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight leading-none">Pay & Benefits</p>
              <p className="text-[10px] text-slate-400 mt-0.5">by TwentySix</p>
            </div>
          </div>
          <div className="bg-white rounded-lg px-4 py-2 shadow-md">
            <img src={logoImage} alt="TwentySix" className="h-6" />
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            {showLogin ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-3">
                  <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Log in to access your dashboard
                  </p>
                </div>

                <Card className="bg-white/[0.06] backdrop-blur-xl border-white/[0.08] shadow-2xl shadow-black/20 p-7 rounded-2xl" data-testid="login-form">
                  <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                      <div className="bg-red-500/10 text-red-300 text-sm px-4 py-3 rounded-xl border border-red-500/20">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="h-12 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-400/50 focus:ring-indigo-400/20"
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="h-12 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl pr-10 focus:border-indigo-400/50 focus:ring-indigo-400/20"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all text-sm"
                      disabled={loading}
                      data-testid="button-submit-login"
                    >
                      {loading ? "Logging in..." : "Log in"}
                    </Button>
                  </form>
                </Card>

                <div className="text-center space-y-3">
                  <p className="text-sm text-slate-500">
                    Don't have an account?{" "}
                    <button onClick={onStartToday} className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors" data-testid="link-signup">
                      Start today
                    </button>
                  </p>
                  <button
                    onClick={() => setShowLogin(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Back to home
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-10 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight tracking-tight">
                    Pay & Benefits
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mt-1">
                      Dashboard
                    </span>
                  </h1>

                  <p className="text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
                    Data-driven salary benchmarking and benefits analysis for confident reward decisions.
                  </p>
                </div>

                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <Button
                    size="lg"
                    className="h-13 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all text-base"
                    onClick={onStartToday}
                    data-testid="button-start-hero"
                  >
                    Start Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="h-13 bg-white/[0.04] border-white/[0.1] text-slate-300 hover:bg-white/[0.08] hover:text-white rounded-xl transition-all text-base"
                    onClick={() => setShowLogin(true)}
                    data-testid="button-login-hero"
                  >
                    Log in to Dashboard
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 tracking-wide uppercase">
                  <span>UK Market Data</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>Updated Quarterly</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>Instant Reports</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="px-8 py-5 flex items-center justify-between border-t border-white/[0.04]">
          <p className="text-[11px] text-slate-600">TwentySix Reward Consultancy</p>
          <p className="text-[11px] text-slate-600">Powered by market intelligence</p>
        </footer>
      </div>
    </div>
  );
}
