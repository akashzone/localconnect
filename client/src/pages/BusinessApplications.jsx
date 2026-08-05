import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/api.js";

const statusConfig = {
    pending: { label: "Pending", dot: "🟡", classes: "bg-[#FDF3D6] text-[#8A6D1D]" },
    accepted: { label: "Accepted", dot: "🟢", classes: "bg-[#E9F5F1] text-[#0F6B5C]" },
    rejected: { label: "Rejected", dot: "🔴", classes: "bg-[#FBE7E4] text-[#B3452F]" },
    withdrawn: { label: "Withdrawn", dot: "⚪", classes: "bg-[#EAEAEA] text-[#4A473F]" },
};

const filterTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
    { key: "withdrawn", label: "Withdrawn" },
];

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "—";

function ApplicationRow({ app }) {
    const location = useLocation();
    const status = app.status?.toLowerCase() || "pending";
    const badge = statusConfig[status] || statusConfig.pending;
    const developer = app.developerId || {};
    const project = app.projectId || {};

    return (
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[3px_3px_0px_#D8D2C4]">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-1">
                        {developer.name || "Unknown developer"}
                    </h3>
                    <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384]">
                        {developer.email || "—"}
                    </p>
                </div>

                <span
                    className={`shrink-0 font-['IBM_Plex_Mono'] text-[11px] font-medium px-3 py-1.5 rounded-[3px] whitespace-nowrap ${badge.classes}`}
                >
                    {badge.dot} {badge.label}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-dashed border-[#D8D2C4] py-4 mb-4">
                <div className="col-span-2 sm:col-span-1">
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                        Project
                    </span>
                    <Link
                        to={`/projects/${project._id}`}
                        state={{ from: location }}
                        className="font-medium text-sm text-[#0F6B5C] hover:underline"
                    >
                        {project.title || "—"}
                    </Link>
                </div>

                <div>
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                        Budget
                    </span>
                    <span className="font-['Space_Grotesk'] font-bold text-[#0F6B5C]">
                        ₹{project.budget?.toLocaleString("en-IN") ?? "—"}
                    </span>
                </div>

                <div>
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                        Duration
                    </span>
                    <span className="font-medium text-sm">{app.estimatedDuration || "—"}</span>
                </div>

                <div>
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                        Applied
                    </span>
                    <span className="font-medium text-sm">{formatDate(app.createdAt)}</span>
                </div>
            </div>

            {app.coverLetter && (
                <div className="mb-5">
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1.5">
                        Cover Letter
                    </span>
                    <p className="text-[14px] text-[#4A473F] leading-relaxed">
                        {app.coverLetter}
                    </p>
                </div>
            )}

            <Link
                to={`/projects/${project._id}`}
                state={{ from: location }}
                className="inline-block font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                   hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
            >
                View Project
            </Link>
        </div>
    );
}

function BusinessApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await api.get("/applications/business");
                setApplications(res.data.applications || []);
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const counts = applications.reduce(
        (acc, app) => {
            const status = app.status?.toLowerCase() || "pending";
            acc.all += 1;
            if (acc[status] !== undefined) acc[status] += 1;
            return acc;
        },
        { all: 0, pending: 0, accepted: 0, rejected: 0, withdrawn: 0 }
    );

    const visibleApplications = applications.filter((app) => {
        const status = app.status?.toLowerCase() || "pending";
        const matchesFilter = activeFilter === "all" || status === activeFilter;

        const term = searchTerm.trim().toLowerCase();
        const matchesSearch =
            !term ||
            app.developerId?.name?.toLowerCase().includes(term) ||
            app.projectId?.title?.toLowerCase().includes(term);

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
            <div className="max-w-4xl mx-auto px-6 py-14">
                <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
                    Across all your projects
                </span>
                <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-6">
                    Applications
                </h1>

                {/* Filter + search */}
                {!loading && !error && applications.length > 0 && (
                    <>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {filterTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveFilter(tab.key)}
                                    className={`font-['IBM_Plex_Mono'] text-[12px] px-3.5 py-2 rounded-[4px] border transition-colors duration-150 ${activeFilter === tab.key
                                            ? "bg-[#1B2430] border-[#1B2430] text-[#FAF8F3]"
                                            : "border-[#D8D2C4] text-[#6B6459] hover:border-[#1B2430] hover:text-[#1B2430]"
                                        }`}
                                >
                                    {tab.label} ({counts[tab.key]})
                                </button>
                            ))}
                        </div>

                        <div className="relative mb-10">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B9384] text-sm pointer-events-none">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by developer or project title..."
                                className="w-full border border-[#D8D2C4] rounded-[4px] pl-10 pr-3.5 py-2.5 text-[14.5px]
                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           transition-colors"
                            />
                        </div>
                    </>
                )}

                {loading && (
                    <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] text-center py-16">
                        Loading applications...
                    </p>
                )}

                {!loading && error && (
                    <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F] text-center py-16">
                        Failed to fetch applications.
                    </p>
                )}

                {!loading && !error && applications.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-[#D8D2C4] rounded-[6px]">
                        <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] mb-1">
                            No applications yet.
                        </p>
                        <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#9B9384]">
                            Share your projects or wait for developers to apply.
                        </p>
                    </div>
                )}

                {!loading && !error && applications.length > 0 && visibleApplications.length === 0 && (
                    <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] text-center py-16">
                        No applications match your filters.
                    </p>
                )}

                {!loading && !error && visibleApplications.length > 0 && (
                    <div className="space-y-5">
                        {visibleApplications.map((app) => (
                            <ApplicationRow key={app._id} app={app} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BusinessApplications;