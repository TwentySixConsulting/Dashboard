import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Edit3,
  Info,
} from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";
import { signup, submitRoles } from "@/lib/auth";

interface SignupProps {
  onComplete: () => void;
  onBack: () => void;
}

interface RoleEntry {
  roleTitle: string;
  currentSalary: string;
  experienceLevel: string;
  functionFamily: string;
}

const emptyRole: RoleEntry = {
  roleTitle: "",
  currentSalary: "",
  experienceLevel: "",
  functionFamily: "",
};

const experienceLevels = [
  "Entry or Foundation",
  "Early and Developing",
  "Mid to Senior",
  "Experts, Strategists & Leaders",
];

const industries = [
  "Technology / SaaS",
  "Financial Services",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail / E-commerce",
  "Professional Services",
  "Media / Entertainment",
  "Non-Profit / Charity",
  "Energy / Utilities",
  "Construction / Property",
  "Transport / Logistics",
  "Public Sector",
  "Other",
];

export function Signup({ onComplete, onBack }: SignupProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organisationName: "",
    industry: "",
    numberOfEmployees: "",
    numberOfRoles: "",
  });

  const [roles, setRoles] = useState<RoleEntry[]>([{ ...emptyRole }]);
  const [roleEntryMode, setRoleEntryMode] = useState<"choose" | "online" | "download" | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateRole = (idx: number, field: keyof RoleEntry, value: string) => {
    setRoles((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const addRole = () => {
    setRoles((prev) => [...prev, { ...emptyRole }]);
  };

  const removeRole = (idx: number) => {
    if (roles.length > 1) {
      setRoles((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const downloadTemplate = () => {
    const headers = "Role Title,Current FTE Salary,Experience Level,Function/Job Family";
    const exampleRows = [
      "Data Analyst,35000,Entry or Foundation,Data & Analytics",
      "Software Engineer,55000,Mid to Senior,Technology",
      "Finance Director,87000,Experts Strategists & Leaders,Finance",
    ];
    const csv = [headers, ...exampleRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "twentysix-role-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        organisationName: formData.organisationName.trim(),
        industry: formData.industry,
        numberOfEmployees: parseInt(formData.numberOfEmployees),
        numberOfRoles: parseInt(formData.numberOfRoles),
      });

      if (roleEntryMode === "online") {
        const validRoles = roles.filter(
          (r) => r.roleTitle && r.currentSalary && r.experienceLevel && r.functionFamily
        );
        if (validRoles.length > 0) {
          await submitRoles(
            validRoles.map((r) => ({
              roleTitle: r.roleTitle,
              currentSalary: parseInt(r.currentSalary.replace(/[^0-9]/g, "")),
              experienceLevel: r.experienceLevel,
              functionFamily: r.functionFamily,
            }))
          );
        }
      }

      onComplete();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid =
    formData.firstName && formData.lastName && formData.email && formData.password.length >= 6;

  const isStep2Valid =
    formData.organisationName && formData.industry && formData.numberOfEmployees && formData.numberOfRoles;

  const hasValidRoles = roles.some(
    (r) => r.roleTitle && r.currentSalary && r.experienceLevel && r.functionFamily
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-1.5 rounded-full transition-all ${
                  s <= step ? "bg-indigo-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h1 className="font-display font-bold text-2xl text-slate-800">Create your account</h1>
                <p className="text-sm text-slate-400 mt-2">Step 1 of 3 - Your details</p>
              </div>

              <Card className="p-6 shadow-lg border-slate-100">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-600 text-sm">First name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder="John"
                        className="h-11"
                        data-testid="input-firstName"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-600 text-sm">Last name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder="Smith"
                        className="h-11"
                        data-testid="input-lastName"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-slate-600 text-sm">Email address</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="you@company.com"
                      className="h-11"
                      data-testid="input-signup-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-slate-600 text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="At least 6 characters"
                        className="h-11 pr-10"
                        data-testid="input-signup-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">Minimum 6 characters</p>
                  </div>
                </div>
              </Card>

              <Button
                className="w-full h-11 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                disabled={!isStep1Valid}
                onClick={() => { setError(""); setStep(2); }}
                data-testid="button-next-step1"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h1 className="font-display font-bold text-2xl text-slate-800">About your organisation</h1>
                <p className="text-sm text-slate-400 mt-2">Step 2 of 3 - Organisation details</p>
              </div>

              <Card className="p-6 shadow-lg border-slate-100">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName" className="text-slate-600 text-sm">Organisation name</Label>
                    <Input
                      id="orgName"
                      value={formData.organisationName}
                      onChange={(e) => updateField("organisationName", e.target.value)}
                      placeholder="Your Company Ltd"
                      className="h-11"
                      data-testid="input-orgName"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 text-sm">Industry</Label>
                    <Select value={formData.industry} onValueChange={(v) => updateField("industry", v)}>
                      <SelectTrigger className="h-11" data-testid="select-industry">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numEmployees" className="text-slate-600 text-sm">Number of employees</Label>
                      <Input
                        id="numEmployees"
                        type="number"
                        value={formData.numberOfEmployees}
                        onChange={(e) => updateField("numberOfEmployees", e.target.value)}
                        placeholder="e.g. 50"
                        className="h-11"
                        min="1"
                        data-testid="input-numEmployees"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numRoles" className="text-slate-600 text-sm">Roles to assess</Label>
                      <Input
                        id="numRoles"
                        type="number"
                        value={formData.numberOfRoles}
                        onChange={(e) => updateField("numberOfRoles", e.target.value)}
                        placeholder="e.g. 10"
                        className="h-11"
                        min="1"
                        data-testid="input-numRoles"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="h-11" onClick={() => setStep(1)} data-testid="button-back-step2">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  className="flex-1 h-11 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                  disabled={!isStep2Valid}
                  onClick={() => { setError(""); setStep(3); }}
                  data-testid="button-next-step2"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h1 className="font-display font-bold text-2xl text-slate-800">Add your roles</h1>
                <p className="text-sm text-slate-400 mt-2">Step 3 of 3 - Role information</p>
              </div>

              <Card className="p-6 shadow-lg border-slate-100">
                <div className="mb-5">
                  <h3 className="font-display font-bold text-slate-700 mb-2">What we need for each role</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    To benchmark your roles accurately, we need four pieces of information for each position:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Role Title", desc: "The job title, e.g. Data Analyst, Finance Director" },
                      { title: "Current FTE Salary", desc: "The full-time equivalent annual salary in GBP" },
                      { title: "Experience Level", desc: "The seniority bracket the role falls into" },
                      { title: "Function / Job Family", desc: "The department or function, e.g. Technology, Finance" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-lg p-3">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <p className="text-sm text-slate-500 mb-4">How would you like to provide your role information?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setRoleEntryMode("online")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        roleEntryMode === "online"
                          ? "border-indigo-500 bg-indigo-50/50"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                      data-testid="button-entry-online"
                    >
                      <Edit3 className={`w-5 h-5 mb-2 ${roleEntryMode === "online" ? "text-indigo-500" : "text-slate-400"}`} />
                      <p className="font-medium text-sm text-slate-700">Fill in online</p>
                      <p className="text-xs text-slate-400 mt-1">Enter your roles directly here</p>
                    </button>
                    <button
                      onClick={() => {
                        setRoleEntryMode("download");
                        downloadTemplate();
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        roleEntryMode === "download"
                          ? "border-indigo-500 bg-indigo-50/50"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                      data-testid="button-entry-download"
                    >
                      <FileSpreadsheet className={`w-5 h-5 mb-2 ${roleEntryMode === "download" ? "text-indigo-500" : "text-slate-400"}`} />
                      <p className="font-medium text-sm text-slate-700">Download template</p>
                      <p className="text-xs text-slate-400 mt-1">Fill in a CSV and send it to us</p>
                    </button>
                  </div>
                </div>
              </Card>

              {roleEntryMode === "online" && (
                <Card className="p-6 shadow-lg border-slate-100" data-testid="roles-form">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-slate-700">Your roles</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addRole}
                      className="gap-1.5 text-xs"
                      data-testid="button-add-role"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add role
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {roles.map((role, idx) => (
                      <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 relative" data-testid={`role-entry-${idx}`}>
                        {roles.length > 1 && (
                          <button
                            onClick={() => removeRole(idx)}
                            className="absolute top-3 right-3 text-slate-300 hover:text-red-400 transition-colors"
                            data-testid={`button-remove-role-${idx}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Role {idx + 1}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500">Role Title</Label>
                            <Input
                              value={role.roleTitle}
                              onChange={(e) => updateRole(idx, "roleTitle", e.target.value)}
                              placeholder="e.g. Data Analyst"
                              className="h-10 text-sm"
                              data-testid={`input-roleTitle-${idx}`}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500">Current FTE Salary (GBP)</Label>
                            <Input
                              value={role.currentSalary}
                              onChange={(e) => updateRole(idx, "currentSalary", e.target.value)}
                              placeholder="e.g. 35000"
                              type="number"
                              className="h-10 text-sm"
                              data-testid={`input-salary-${idx}`}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500">Experience Level</Label>
                            <Select
                              value={role.experienceLevel}
                              onValueChange={(v) => updateRole(idx, "experienceLevel", v)}
                            >
                              <SelectTrigger className="h-10 text-sm" data-testid={`select-experience-${idx}`}>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                {experienceLevels.map((level) => (
                                  <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500">Function / Job Family</Label>
                            <Input
                              value={role.functionFamily}
                              onChange={(e) => updateRole(idx, "functionFamily", e.target.value)}
                              placeholder="e.g. Data & Analytics"
                              className="h-10 text-sm"
                              data-testid={`input-function-${idx}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {roleEntryMode === "download" && (
                <Card className="p-6 shadow-lg border-slate-100 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-slate-700 mb-2">Template downloaded</h3>
                  <p className="text-sm text-slate-400 mb-4 max-w-sm mx-auto">
                    Fill in your role details in the CSV template and send it to us. We'll populate your dashboard once received.
                  </p>
                  <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2" data-testid="button-download-again">
                    <Download className="w-4 h-4" /> Download again
                  </Button>
                </Card>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="h-11" onClick={() => setStep(2)} data-testid="button-back-step3">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  className="flex-1 h-11 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                  disabled={loading || (!roleEntryMode)}
                  onClick={handleSignup}
                  data-testid="button-create-account"
                >
                  {loading ? "Creating account..." : (
                    roleEntryMode === "online" && hasValidRoles
                      ? "Create Account & Submit Roles"
                      : "Create Account"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
