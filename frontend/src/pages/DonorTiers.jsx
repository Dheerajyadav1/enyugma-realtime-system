import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";

const tiers = [
    {
        key: "supporter",
        name: "Supporter",
        price: "₹500",
        period: "Year",
        dotColor: "bg-[var(--unnati-accent)]",
        description: "Supports learning materials & grassroots outreach efforts.",
        benefits: [
            "Digital Appreciation Certificate",
            "Semester-wise Newsletter Copy",
            "Periodic Work Updates",
        ],
    },
    {
        key: "impact_contributor",
        name: "Impact Contributor",
        price: "₹1,000",
        period: "Year",
        dotColor: "bg-[var(--unnati-primary)]",
        popular: true,
        description:
            "Supports one structured session under DigiXplore / NETRITVA / AKSHAR.",
        benefits: [
            "All Supporter Benefits",
            "Name in Annual Impact Acknowledgment List",
            "Name on Unnati Digital Donor Wall",
            "Detailed Semester Impact Summary",
        ],
    },
    {
        key: "education_patron",
        name: "Education Patron",
        price: "₹1,500",
        period: "Year",
        dotColor: "bg-[var(--unnati-primary-dark)]",
        description:
            "Contributes towards structured learning resources for a student batch.",
        benefits: [
            "All Contributor Benefits",
            "Invitation to Major Unnati Events",
            "Personalized Annual Impact Report",
            "Opportunity to Support a Specific Program Area",
            "Featured Acknowledgment in Annual Magazine",
        ],
    },
];

export default function DonorTiers() {
    const location = useLocation();
    const navigate = useNavigate();
    const registrationId = location.state?.registrationId;
    const donorName = location.state?.name;
    const [selectedTier, setSelectedTier] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    async function handleSelectTier(tierKey) {
        if (!registrationId) {
            setSelectedTier(tierKey);
            return;
        }

        setSaving(true);
        setSelectedTier(tierKey);
        try {
            await api.patch(`/register/${registrationId}/donor-tier`, {
                donor_tier: tierKey,
            });
            toast.success("Contribution tier selected!", {
                style: {
                    background: "var(--unnati-primary-dark)",
                    color: "#fff",
                    borderRadius: "12px",
                },
            });
            setShowWelcome(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 3500);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to save tier");
        } finally {
            setSaving(false);
        }
    }

    // Welcome overlay after tier selection
    if (showWelcome) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
                <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-unnati-gradient flex items-center justify-center animate-checkmark shadow-lg mb-5">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--unnati-text)] mb-2">
                        Welcome {donorName} to Unnati Society!
                    </h2>
                    <p className="text-[var(--unnati-text-muted)] mb-1">
                        Your contribution tier has been saved.
                    </p>
                    <p className="text-sm text-[var(--unnati-text-muted)]">
                        Redirecting you to the live dashboard…
                    </p>
                    <div className="mt-5">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-unnati-gradient rounded-full animate-progress" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-unnati-gradient shadow-md mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-unnati-gradient">
                    Annual Impact Contribution
                </h1>
                <p className="text-[var(--unnati-text-muted)] mt-2 max-w-lg mx-auto">
                    {donorName
                        ? `Thank you, ${donorName}! Please choose a contribution tier below.`
                        : "Choose a tier that resonates with you and help Unnati Society make a lasting impact."}
                </p>
            </div>

            {/* Tier cards — identical design for all three */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {tiers.map((tier, i) => {
                    const isSelected = selectedTier === tier.key;
                    return (
                        <div
                            key={tier.key}
                            className={`relative glass-card rounded-2xl p-6 flex flex-col
                transition-all duration-300 animate-slide-up
                ${isSelected
                                    ? "ring-2 ring-[var(--unnati-primary)]/40 shadow-xl scale-[1.02]"
                                    : "hover:shadow-lg hover:-translate-y-1"
                                }`}
                            style={{ animationDelay: `${(i + 1) * 150}ms` }}
                        >
                            {/* Popular badge */}
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 rounded-full text-xs font-bold text-white bg-unnati-gradient shadow-md uppercase tracking-wide">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Tier heading */}
                            <div className="flex items-center gap-2 mb-3 mt-1">
                                <span className={`w-3 h-3 rounded-full ${tier.dotColor}`} />
                                <h3 className="text-lg font-bold text-[var(--unnati-text)]">
                                    {tier.name}
                                </h3>
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                                <span className="text-3xl font-extrabold text-unnati-gradient">
                                    {tier.price}
                                </span>
                                <span className="text-sm text-[var(--unnati-text-muted)] ml-1">
                                    / {tier.period}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-[var(--unnati-text-muted)] mb-5 leading-relaxed">
                                {tier.description}
                            </p>

                            {/* Benefits */}
                            <div className="flex-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-[var(--unnati-text)] mb-3">
                                    You Will Receive
                                </p>
                                <ul className="space-y-2.5">
                                    {tier.benefits.map((b) => (
                                        <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--unnati-text)]">
                                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--unnati-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA — same style for all */}
                            <div className="mt-6">
                                <button
                                    onClick={() => handleSelectTier(tier.key)}
                                    disabled={saving}
                                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isSelected
                                            ? "text-white bg-unnati-gradient shadow-md"
                                            : "text-white bg-unnati-gradient shadow-md hover:shadow-lg hover:shadow-[var(--unnati-primary)]/20 active:scale-[0.98]"
                                        }`}
                                >
                                    {isSelected && saving
                                        ? "Saving…"
                                        : `Choose ${tier.name}`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info for non-registered visitors */}
            {!registrationId && (
                <div className="text-center mt-10 space-y-3">
                    <p className="text-sm text-[var(--unnati-text-muted)]">
                        Please register first to select a contribution tier.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--unnati-primary)] hover:underline"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Go to Registration
                    </Link>
                </div>
            )}
        </div>
    );
}
