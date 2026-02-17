import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const roles = ["mentor", "volunteer", "donor"];

export default function RegistrationForm({ onSubmit }) {
  const navigate = useNavigate();
  const topRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    occupation: "",
    registered_by: "",
    role: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [welcomeData, setWelcomeData] = useState(null);

  function validate() {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(formData.phone)) errs.phone = "Enter a valid 10-digit number";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.registered_by.trim()) errs.registered_by = "This field is required";
    if (!formData.role) errs.role = "Select a role";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(field, value) {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await onSubmit(formData);
    setIsSubmitting(false);

    if (result) {
      setWelcomeData({
        name: formData.name,
        role: formData.role,
        id: result.id,
      });
      setFormData({
        name: "", email: "", phone: "", city: "",
        occupation: "", registered_by: "", role: "", notes: "",
      });
      setErrors({});
      // Scroll to top so user sees welcome banner
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleWelcomeDismiss() {
    const data = welcomeData;
    setWelcomeData(null);
    if (data?.role === "donor") {
      navigate("/donor-tiers", { state: { registrationId: data.id, name: data.name } });
    } else {
      navigate("/dashboard");
    }
  }

  // Auto-redirect after welcome message
  const welcomeTimerRef = useState(null);
  if (welcomeData && !welcomeTimerRef[0]) {
    const delay = welcomeData.role === "donor" ? 2500 : 3000;
    welcomeTimerRef[0] = setTimeout(() => {
      handleWelcomeDismiss();
    }, delay);
  }
  if (!welcomeData && welcomeTimerRef[0]) {
    welcomeTimerRef[0] = null;
  }

  /* ── Field config ── */
  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Enter your full name", required: true },
    { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com", required: true },
    { key: "phone", label: "Contact Number", type: "tel", placeholder: "10-digit mobile number", required: true },
    { key: "city", label: "City of Residence", type: "text", placeholder: "e.g. Bhagalpur", required: true },
    { key: "occupation", label: "Occupation", type: "text", placeholder: "e.g. Student, Engineer", required: false },
    { key: "registered_by", label: "Registered By", type: "text", placeholder: "Who referred / enrolled you?", required: true },
  ];

  return (
    <div className="py-6" ref={topRef}>
      <div className="relative w-full max-w-xl mx-auto animate-fade-in">

        {/* ── Welcome banner (shown at top after registration) ── */}
        {welcomeData && (
          <div className="mb-6 glass-card rounded-2xl p-6 text-center animate-slide-up shadow-lg border border-[var(--unnati-primary)]/20">
            <div className="w-14 h-14 mx-auto rounded-full bg-unnati-gradient flex items-center justify-center animate-checkmark shadow-md mb-3">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--unnati-text)] mb-1">
              Welcome {welcomeData.name} to Unnati Society!
            </h3>
            <p className="text-sm text-[var(--unnati-text-muted)] mb-1">
              Registered as{" "}
              <span className="font-semibold capitalize text-[var(--unnati-primary)]">
                {welcomeData.role}
              </span>
            </p>
            <p className="text-xs text-[var(--unnati-text-muted)] mb-3">
              {welcomeData.role === "donor"
                ? "Redirecting to contribution tiers…"
                : "Redirecting to dashboard…"}
            </p>
            <div className="w-40 mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-unnati-gradient rounded-full animate-progress" />
            </div>
          </div>
        )}

        {/* decorations */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-[var(--unnati-primary)] opacity-[0.06] rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[var(--unnati-accent)] opacity-[0.09] rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* card */}
        <div className="relative glass-card rounded-2xl p-8 sm:p-10">

          {/* header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-unnati-gradient shadow-md mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-unnati-gradient">
              Event Registration
            </h2>
            <p className="text-sm text-[var(--unnati-text-muted)] mt-1">
              Revolutionizing Present, Transforming Future
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* text fields */}
            {fields.map((f, i) => (
              <div key={f.key} className="animate-slide-up" style={{ animationDelay: `${(i + 1) * 60}ms` }}>
                <label className="block text-sm font-semibold text-[var(--unnati-text)] mb-1.5">
                  {f.label} {f.required && <span className="text-[var(--unnati-red)]">*</span>}
                </label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={formData[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border text-sm
                    transition-all duration-200 focus:outline-none focus:ring-2
                    ${errors[f.key]
                      ? "border-[var(--unnati-red)] focus:ring-[var(--unnati-red)]/30"
                      : "border-gray-200 focus:ring-[var(--unnati-primary)]/30 focus:border-[var(--unnati-primary)]"
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed`}
                />
                {errors[f.key] && (
                  <p className="text-xs text-[var(--unnati-red)] mt-1 animate-shake">{errors[f.key]}</p>
                )}
              </div>
            ))}

            {/* Role select */}
            <div className="animate-slide-up" style={{ animationDelay: `${(fields.length + 1) * 60}ms` }}>
              <label className="block text-sm font-semibold text-[var(--unnati-text)] mb-1.5">
                Role <span className="text-[var(--unnati-red)]">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border text-sm
                  transition-all duration-200 focus:outline-none focus:ring-2 appearance-none
                  ${errors.role
                    ? "border-[var(--unnati-red)] focus:ring-[var(--unnati-red)]/30"
                    : "border-gray-200 focus:ring-[var(--unnati-primary)]/30 focus:border-[var(--unnati-primary)]"
                  }
                  disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <option value="">Select your role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-xs text-[var(--unnati-red)] mt-1 animate-shake">{errors.role}</p>
              )}
              {formData.role === "donor" && (
                <p className="text-xs text-[var(--unnati-primary)] mt-1.5 font-medium">
                  You'll be able to choose a contribution tier after registration.
                </p>
              )}
            </div>

            {/* Notes textarea */}
            <div className="animate-slide-up" style={{ animationDelay: `${(fields.length + 2) * 60}ms` }}>
              <label className="block text-sm font-semibold text-[var(--unnati-text)] mb-1.5">
                Notes <span className="text-xs font-normal text-[var(--unnati-text-muted)]">(optional)</span>
              </label>
              <textarea
                placeholder="Any additional information you'd like to share"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                disabled={isSubmitting}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 text-sm
                  transition-all duration-200 focus:outline-none focus:ring-2
                  focus:ring-[var(--unnati-primary)]/30 focus:border-[var(--unnati-primary)]
                  disabled:opacity-40 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-3 animate-slide-up" style={{ animationDelay: `${(fields.length + 3) * 60}ms` }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm
                  bg-unnati-gradient shadow-md
                  hover:shadow-lg hover:shadow-[var(--unnati-primary)]/20
                  active:scale-[0.98] transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  "Register Now"
                )}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
}
