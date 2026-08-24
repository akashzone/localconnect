import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api.js";
import AcceptRejectModal from "../components/application/AcceptRejectModal";
import RequestChangesModal from "../components/application/RequestChangesModal";
import ApproveWorkModal from "../components/application/ApproveWorkModal";

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

function ApplicationRow({ app, onStatusUpdate, onReviewUpdate }) {
    const location = useLocation();
    const status = app.status?.toLowerCase() || "pending";
    const badge = statusConfig[status] || statusConfig.pending;
    const student = app.studentId || {};
    const project = app.projectId || {};

    const [modalAction, setModalAction] = useState(null); // "Accepted" | "Rejected" | null
    const [submitting, setSubmitting] = useState(false);

    const [reviewAction, setReviewAction] = useState(null); // "RequestChanges" | "ApproveWork" | null
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const confirmAction = async () => {
        setSubmitting(true);
        await onStatusUpdate(app._id, modalAction);
        setSubmitting(false);
        setModalAction(null);
    };

    const handleRequestChanges = async (message) => {
        setReviewSubmitting(true);
        try {
            const res = await api.put(`/applications/${app._id}/request-changes`, { message });
            setSuccessMsg("Request submitted");
            setTimeout(() => setSuccessMsg(""), 3000);
            onReviewUpdate(app._id, res.data.data);
            setReviewAction(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to request changes.");
        } finally {
            setReviewSubmitting(false);
        }
    };

    const handleApproveWork = async () => {
        setReviewSubmitting(true);
        try {
            const res = await api.put(`/applications/${app._id}/approve-work`);
            setSuccessMsg("Work approved");
            setTimeout(() => setSuccessMsg(""), 3000);
            onReviewUpdate(app._id, res.data.data);
            setReviewAction(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to approve work.");
        } finally {
            setReviewSubmitting(false);
        }
    };

    const latestChangeRequest = app.changeRequests && app.changeRequests.length > 0
        ? app.changeRequests[app.changeRequests.length - 1]
        : null;

    return (
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[3px_3px_0px_#D8D2C4]">
            {successMsg && (
                <div className="mb-4 bg-[#E9F5F1] text-[#0F6B5C] border border-[#0F6B5C]/25 text-xs font-['IBM_Plex_Mono'] px-3.5 py-2.5 rounded-[4px] font-semibold flex items-center gap-2">
                    <span>✓</span> {successMsg}
                </div>
            )}
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-1">
                        {student.name || "Unknown student"}
                    </h3>
                    <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384]">
                        {student.email || "—"}
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

            {app.workSubmission?.workLink && (
                <div className="mb-5 bg-[#E9F5F1] border border-[#0F6B5C]/25 rounded-[6px] p-4 shadow-[2px_2px_0px_#0F6B5C]">
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#0F6B5C] mb-1.5 font-bold">
                        Submitted Work
                    </span>
                    <p className="text-[14px] text-[#0F6B5C] font-semibold mb-2 flex items-center gap-1.5">
                        <span>🔗</span>
                        <a
                            href={app.workSubmission.workLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline break-all"
                        >
                            {app.workSubmission.workLink}
                        </a>
                    </p>
                    {app.workSubmission.remarks && (
                        <div className="text-[13px] text-[#4A473F] bg-white border border-[#0F6B5C]/10 px-3 py-2 rounded font-medium leading-relaxed">
                            <span className="text-[#9B9384] font-['IBM_Plex_Mono'] text-[9px] uppercase block tracking-wider mb-1 font-semibold">Developer Remarks</span>
                            {app.workSubmission.remarks}
                        </div>
                    )}
                    <span className="block text-[10.5px] text-[#9B9384] mt-2 font-['IBM_Plex_Mono']">
                        Submitted on {new Date(app.workSubmission.submittedAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </span>
                </div>
            )}

            {project.status === "Under Review" && app.workSubmission?.workLink && (
                <div className="mb-5 flex gap-3">
                    <button
                        onClick={() => setReviewAction("RequestChanges")}
                        className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#B3452F] text-[#B3452F]
                                   hover:bg-[#B3452F] hover:text-white transition-colors duration-150 bg-white cursor-pointer"
                    >
                        Request Changes
                    </button>
                    <button
                        onClick={() => setReviewAction("ApproveWork")}
                        className="font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#0F6B5C] text-white
                                   shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:bg-[#0c574a]
                                   transition-all duration-150 cursor-pointer"
                    >
                        Approve Work
                    </button>
                </div>
            )}

            {latestChangeRequest && latestChangeRequest.status === "Pending" && (
                <div className="mb-5 bg-[#FBE7E4] border border-[#B3452F]/25 rounded-[6px] p-4 shadow-[2px_2px_0px_#B3452F]">
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#B3452F] mb-1.5 font-bold">
                        Changes Requested by You
                    </span>
                    <p className="text-[14px] text-[#4A473F] leading-relaxed italic mb-2">
                        "{latestChangeRequest.message}"
                    </p>
                    <span className="block text-[10.5px] text-[#9B9384] font-['IBM_Plex_Mono']">
                        Requested on {new Date(latestChangeRequest.requestedAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </span>
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                <Link
                    to={`/profile/student/${student._id}`}
                    state={{ from: location }}
                    className="inline-block font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                       hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
                >
                    View Profile
                </Link>

                {status === "pending" && (
                    <>
                        <button
                            onClick={() => setModalAction("Accepted")}
                            className="font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#0F6B5C] text-white
                                        hover:shadow-[1px_1px_0px_#1B2430]  hover:bg-[#0c574a] hover:border-[#0c574a] hover:text-white
                                       transition-all duration-150"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => setModalAction("Rejected")}
                            className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#B3452F] text-[#B3452F]
                                       hover:bg-[#B3452F] hover:text-white transition-colors duration-150"
                        >
                            Reject
                        </button>
                    </>
                )}
            </div>

            {modalAction && (
                <AcceptRejectModal
                    applicationName={student.name || "This student"}
                    action={modalAction}
                    onConfirm={confirmAction}
                    onCancel={() => setModalAction(null)}
                    submitting={submitting}
                />
            )}

            {reviewAction === "RequestChanges" && (
                <RequestChangesModal
                    onConfirm={handleRequestChanges}
                    onCancel={() => setReviewAction(null)}
                    submitting={reviewSubmitting}
                />
            )}

            {reviewAction === "ApproveWork" && (
                <ApproveWorkModal
                    onConfirm={handleApproveWork}
                    onCancel={() => setReviewAction(null)}
                    submitting={reviewSubmitting}
                />
            )}
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

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            const res = await api.put(`/applications/${applicationId}/status`, { status: newStatus });

            // Accepting one application auto-rejects all other pending applications
            // for the same project (per the backend's updateMany) — reflect that locally
            // instead of just updating the one row, so the list stays accurate without a refetch.
            const acceptedApp = applications.find((a) => a._id === applicationId);
            const acceptedProjectId =
                typeof acceptedApp?.projectId === "object" ? acceptedApp.projectId?._id : acceptedApp?.projectId;

            setApplications((prev) =>
                prev.map((app) => {
                    if (app._id === applicationId) {
                        return { ...app, status: newStatus };
                    }
                    const appProjectId = typeof app.projectId === "object" ? app.projectId?._id : app.projectId;
                    if (
                        newStatus === "Accepted" &&
                        appProjectId === acceptedProjectId &&
                        app.status?.toLowerCase() === "pending"
                    ) {
                        return { ...app, status: "Rejected" };
                    }
                    return app;
                })
            );
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Failed to update application status");
        }
    };

    const handleReviewUpdate = (applicationId, updatedApp) => {
        setApplications((prev) =>
            prev.map((app) => (app._id === applicationId ? updatedApp : app))
        );
    };

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
            app.studentId?.name?.toLowerCase().includes(term) ||
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
                                <FontAwesomeIcon icon={faSearch} />
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
                            <ApplicationRow 
                                key={app._id} 
                                app={app} 
                                onStatusUpdate={handleStatusUpdate} 
                                onReviewUpdate={handleReviewUpdate} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BusinessApplications;