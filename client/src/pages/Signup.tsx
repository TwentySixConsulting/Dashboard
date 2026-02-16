import { useState, useRef } from "react";
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
  Upload,
  AlertCircle,
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

export function Signup({ onComplete, onBack }: SignupProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organisationName: "",
    industry: "",
    numberOfEmployees: "",
    numberOfRoles: "",
  });

  const [roles, setRoles] = useState<RoleEntry[]>([{ ...emptyRole }]);
  const [roleEntryMode, setRoleEntryMode] = useState<"online" | "upload" | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

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
    const link = document.createElement("a");
    link.href = "/api/template/roles";
    link.download = "twentysix-role-template.xlsx";
    link.click();
  };

  const parseCSV = (text: string): RoleEntry[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];
    const parsed: RoleEntry[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      if (cols.length >= 4 && cols[0]) {
        parsed.push({
          roleTitle: cols[0],
          currentSalary: cols[1].replace(/[^0-9]/g, ""),
          experienceLevel: cols[2],
          functionFamily: cols[3],
        });
      }
    }
    return parsed;
  };

  const parseXLSX = async (file: File): Promise<RoleEntry[]> => {
    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) return [];
    const parsed: RoleEntry[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const roleTitle = String(row.getCell(1).value || "").trim();
      const salary = String(row.getCell(2).value || "").trim().replace(/[^0-9]/g, "");
      const experience = String(row.getCell(3).value || "").trim();
      const func = String(row.getCell(4).value || "").trim();
      if (roleTitle) {
        parsed.push({
          roleTitle,
          currentSalary: salary,
          experienceLevel: experience,
          functionFamily: func,
        });
      }
    });
    return parsed;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    try {
      let parsed: RoleEntry[];
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        parsed = await parseXLSX(file);
      } else {
        const text = await file.text();
        parsed = parseCSV(text);
      }

      if (parsed.length === 0) {
        setError("No valid roles found in the file. Please check the format matches the template.");
        return;
      }
      setRoles(parsed);
      setError("");
    } catch {
      setError("Could not read the file. Please make sure it's a valid Excel or CSV file.");
    }
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
        industry: formData.industry.trim(),
        numberOfEmployees: parseInt(formData.numberOfEmployees),
        numberOfRoles: parseInt(formData.numberOfRoles),
      });

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

      onComplete();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isStep1Valid =
    formData.firstName && formData.lastName && formData.email && formData.password.length >= 6 && passwordsMatch && formData.confirmPassword;

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
            <div className="mb-6 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-600 text-sm">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="Re-enter your password"
                      className={`h-11 ${formData.confirmPassword && !passwordsMatch ? 'border-red-300 focus-visible:ring-red-400' : ''}`}
                      data-testid="input-confirm-password"
                    />
                    {formData.confirmPassword && !passwordsMatch && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Passwords do not match
                      </p>
                    )}
                    {formData.confirmPassword && passwordsMatch && (
                      <p className="text-xs text-emerald-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Passwords match
                      </p>
                    )}
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
                    <Label htmlFor="industry" className="text-slate-600 text-sm">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      placeholder="e.g. Technology, Financial Services, Healthcare"
                      className="h-11"
                      data-testid="input-industry"
                    />
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
                      onClick={() => { setRoleEntryMode("online"); setUploadedFileName(""); }}
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
                      onClick={() => { setRoleEntryMode("upload"); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        roleEntryMode === "upload"
                          ? "border-indigo-500 bg-indigo-50/50"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                      data-testid="button-entry-upload"
                    >
                      <FileSpreadsheet className={`w-5 h-5 mb-2 ${roleEntryMode === "upload" ? "text-indigo-500" : "text-slate-400"}`} />
                      <p className="font-medium text-sm text-slate-700">Download & upload template</p>
                      <p className="text-xs text-slate-400 mt-1">Fill in a CSV template and upload it</p>
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

              {roleEntryMode === "upload" && (
                <Card className="p-6 shadow-lg border-slate-100" data-testid="upload-section">
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-display font-bold text-slate-700 mb-2">Step 1: Download the template</h3>
                      <p className="text-sm text-slate-400 mb-3">
                        Download the CSV template below. It has four columns: Role Title, Current FTE Salary, Experience Level, and Function/Job Family. Fill in one role per row.
                      </p>
                      <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2" data-testid="button-download-template">
                        <Download className="w-4 h-4" /> Download template
                      </Button>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <h3 className="font-display font-bold text-slate-700 mb-2">Step 2: Upload your completed file</h3>
                      <p className="text-sm text-slate-400 mb-3">
                        Once you've filled in your roles, upload the completed CSV file here.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        data-testid="input-file-upload"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                        data-testid="button-upload-area"
                      >
                        <Upload className="w-8 h-8 text-slate-300 mx-auto mb-3 group-hover:text-indigo-400 transition-colors" />
                        <p className="text-sm font-medium text-slate-600">Click to upload your CSV file</p>
                        <p className="text-xs text-slate-400 mt-1">Accepts .csv files</p>
                      </button>

                      {uploadedFileName && (
                        <div className="mt-4 bg-emerald-50 rounded-lg p-4 flex items-start gap-3 border border-emerald-100">
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-emerald-700">File uploaded: {uploadedFileName}</p>
                            <p className="text-xs text-emerald-500 mt-1">
                              {roles.filter(r => r.roleTitle && r.currentSalary).length} role{roles.filter(r => r.roleTitle && r.currentSalary).length !== 1 ? 's' : ''} found
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {uploadedFileName && hasValidRoles && (
                      <div className="border-t border-slate-100 pt-5">
                        <h3 className="font-display font-bold text-slate-700 mb-3">Roles preview</h3>
                        <div className="overflow-x-auto rounded-lg border border-slate-100">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Role Title</th>
                                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Salary</th>
                                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Experience</th>
                                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Function</th>
                              </tr>
                            </thead>
                            <tbody>
                              {roles.filter(r => r.roleTitle).map((role, i) => (
                                <tr key={i} className="border-t border-slate-50">
                                  <td className="px-3 py-2 text-slate-700">{role.roleTitle}</td>
                                  <td className="px-3 py-2 text-slate-600">{role.currentSalary ? `£${parseInt(role.currentSalary).toLocaleString()}` : '-'}</td>
                                  <td className="px-3 py-2 text-slate-600">{role.experienceLevel || '-'}</td>
                                  <td className="px-3 py-2 text-slate-600">{role.functionFamily || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="h-11" onClick={() => setStep(2)} data-testid="button-back-step3">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  className="flex-1 h-11 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                  disabled={loading || !roleEntryMode || !hasValidRoles}
                  onClick={handleSignup}
                  data-testid="button-create-account"
                >
                  {loading ? "Creating account..." : "Create Account & Submit Roles"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
