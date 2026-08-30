import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faCalendar,
  faBuilding,
  faUserGraduate,
  faGlobe,
  faMapMarkerAlt,
  faTimesCircle,
  faCircleCheck,
  faBriefcase,
  faQuoteLeft,
  faFilePdf,
  faClipboardList
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const AdminReviewDetails = () => {
  const { id } = useParams();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviewDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/reviews/${id}`);
      if (res.data?.success && res.data?.data) {
        setReviewData(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to fetch review details");
      }
    } catch (err) {
      console.error("Error fetching review details:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load review details. Please check the ID or try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviewDetails();
  }, [fetchReviewDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatBudget = (value) => {
    if (value === undefined || value === null) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1 text-[#F5C445]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-xl">
            {i < rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-[#D8D2C4]/40 rounded-[4px]" />
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 space-y-4">
          <div className="h-8 w-1/3 bg-[#D8D2C4]/40 rounded" />
          <div className="h-4 w-1/4 bg-[#D8D2C4]/40 rounded" />
          <div className="h-20 bg-[#D8D2C4]/40 rounded" />
        </div>
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="space-y-6">
        <Link to="/admin/reviews" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F6B5C] hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Reviews</span>
        </Link>
        <div className="p-8 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <FontAwesomeIcon icon={faTimesCircle} className="text-[#B3452F] text-4xl mb-3" />
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">Review Details Error</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1 max-w-md mx-auto">{error || "Review details could not be retrieved."}</p>
          <Link
            to="/admin/reviews"
            className="inline-block mt-4 px-4 py-2 bg-[#1B2430] text-white rounded-[4px] text-xs font-semibold shadow-[2px_2px_0px_#0F6B5C]"
          >
            Back to Reviews List
          </Link>
        </div>
      </div>
    );
  }

  const {
    studentId,
    businessOwnerId,
    projectId,
    reviewerRole,
    stars,
    description,
    createdAt,
    studentProfile,
    businessProfile,
    application
  } = reviewData;

  const isStudentReviewer = reviewerRole === "student";

  // Identify Reviewer details
  const reviewerUser = isStudentReviewer ? studentId : businessOwnerId;
  const reviewerProfile = isStudentReviewer ? studentProfile : businessProfile;
  const reviewerRoleLabel = isStudentReviewer ? "Student Developer" : "Business Client";

  // Identify Reviewed details
  const reviewedUser = isStudentReviewer ? businessOwnerId : studentId;
  const reviewedProfile = isStudentReviewer ? businessProfile : studentProfile;
  const reviewedRoleLabel = isStudentReviewer ? "Business Client" : "Student Developer";

  return (
    <div className="space-y-6 font-['IBM_Plex_Sans'] text-sm text-[#1B2430]">
      {/* Back Button */}
      <div>
        <Link
          to="/admin/reviews"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#1B2430] border border-[#D8D2C4] rounded-[4px] transition-colors shadow-[2px_2px_0px_#1B2430]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Reviews</span>
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section (2/3 width) - Review feedback content & related project context */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Details Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C4]/60">
              <div className="flex items-center gap-2">
                <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-wider bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 px-2 py-0.5 rounded-[3px]">
                  Feedback
                </span>
                <h2 className="font-['Space_Grotesk'] font-bold text-xl text-[#1B2430] block">
                  Review & Comments
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-[#FAF8F3] border border-[#D8D2C4] rounded-[3px]">
                {renderStars(stars)}
              </span>
            </div>

            {/* Stars & Creation Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4]">
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Direction</span>
                <span className="font-semibold text-[#1B2430] block mt-1">
                  {isStudentReviewer ? "Student → Business Owner" : "Business Owner → Student"}
                </span>
              </div>
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] uppercase tracking-wider font-semibold block">Submitted Date</span>
                <span className="font-semibold text-[#1B2430] block mt-1 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCalendar} className="text-xs text-[#6B6459]" />
                  <span>{formatDate(createdAt)}</span>
                </span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Comment Description</span>
              <div className="relative font-['IBM_Plex_Sans'] text-sm text-[#1B2430] leading-relaxed bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4] flex items-start gap-3">
                <FontAwesomeIcon icon={faQuoteLeft} className="text-[#0F6B5C]/20 text-3xl mt-1 shrink-0" />
                <p className="whitespace-pre-line pt-1">{description || "Not provided"}</p>
              </div>
            </div>
          </section>

          {/* Project Context Card */}
          {projectId && (
            <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C4]/60">
                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] flex items-center gap-2">
                  <FontAwesomeIcon icon={faBriefcase} className="text-xs text-[#0F6B5C]" />
                  <span>Project Context</span>
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-[3px] border uppercase tracking-wider bg-indigo-50 text-indigo-700 border-indigo-200/60 font-semibold">
                  {projectId.status || "—"}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-[#1B2430] text-base">{projectId.title}</h4>
                  <span className="text-[10px] font-['IBM_Plex_Mono'] text-[#6B6459] block mt-0.5 uppercase">Category: {projectId.category || "Uncategorized"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F3] p-3 rounded border border-[#D8D2C4] text-xs">
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] block uppercase">Budget Amount</span>
                    <span className="font-bold text-[#0F6B5C] text-sm">{formatBudget(projectId.budget)}</span>
                  </div>
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] block uppercase">Target Deadline</span>
                    <span className="font-semibold block mt-0.5">{formatDate(projectId.deadline).split(" at")[0]}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6B6459] leading-relaxed p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]/60 line-clamp-3">
                  {projectId.description}
                </p>

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/admin/projects/${projectId._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#1B2430] hover:text-white border border-[#D8D2C4] rounded-[4px] text-xs font-semibold text-[#1B2430] transition-colors cursor-pointer"
                  >
                    <span>View Project</span>
                    <FontAwesomeIcon icon={faArrowLeft} className="rotate-180 text-[10px]" />
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Section (1/3 width) - Reviewer, Reviewed User & Application details */}
        <div className="space-y-6">
          {/* Reviewer Details Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[4px_4px_0px_#1B2430] space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-md text-[#1B2430] pb-2 border-b border-[#D8D2C4] flex items-center gap-2">
              {isStudentReviewer ? (
                <FontAwesomeIcon icon={faUserGraduate} className="text-xs text-[#0F6B5C]" />
              ) : (
                <FontAwesomeIcon icon={faBuilding} className="text-xs text-[#0F6B5C]" />
              )}
              <span>Reviewer: {reviewerRoleLabel}</span>
            </h3>

            {reviewerUser ? (
              <div className="space-y-3.5 text-xs text-[#1B2430]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center border border-[#F5C445] shrink-0">
                    {reviewerUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1B2430] truncate">{reviewerUser.name}</h4>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] block truncate">{reviewerUser.email}</span>
                  </div>
                </div>

                {reviewerProfile ? (
                  <div className="space-y-3 bg-[#FAF8F3] p-3.5 rounded border border-[#D8D2C4] leading-relaxed">
                    {isStudentReviewer ? (
                      // Student Reviewer Details
                      <>
                        <div>
                          <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Developer Bio</span>
                          <p className="text-xs text-[#6B6459] mt-0.5 line-clamp-3">{reviewerProfile.bio || "Not provided"}</p>
                        </div>
                        <div className="pt-2.5 border-t border-[#D8D2C4]/60 flex flex-col gap-1.5 font-semibold">
                          {reviewerProfile.github && (
                            <a href={reviewerProfile.github.startsWith("http") ? reviewerProfile.github : `https://github.com/${reviewerProfile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                              <FontAwesomeIcon icon={faGithub} className="text-[10px]" />
                              <span>GitHub Profile</span>
                            </a>
                          )}
                          {reviewerProfile.linkedIn && (
                            <a href={reviewerProfile.linkedIn.startsWith("http") ? reviewerProfile.linkedIn : `https://linkedin.com/in/${reviewerProfile.linkedIn}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                              <FontAwesomeIcon icon={faLinkedin} className="text-[10px]" />
                              <span>LinkedIn Connect</span>
                            </a>
                          )}
                        </div>
                      </>
                    ) : (
                      // Business Reviewer Details
                      <>
                        <div>
                          <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Business Name</span>
                          <span className="font-bold text-[#1B2430]">{reviewerProfile.businessName || "Not provided"}</span>
                        </div>
                        <div>
                          <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Category/Type</span>
                          <span>{reviewerProfile.businessType || "Not provided"}</span>
                        </div>
                        <div className="pt-2.5 border-t border-[#D8D2C4]/60 flex flex-col gap-1.5 font-semibold">
                          {reviewerProfile.socialLinks?.website && (
                            <a href={reviewerProfile.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                              <FontAwesomeIcon icon={faGlobe} className="text-[10px]" />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#6B6459] italic p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]">No reviewer profile registered.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#6B6459] italic">Reviewer user details are missing.</p>
            )}
          </section>

          {/* Reviewed User Details Card */}
          <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[4px_4px_0px_#1B2430] space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-md text-[#1B2430] pb-2 border-b border-[#D8D2C4] flex items-center gap-2">
              {!isStudentReviewer ? (
                <FontAwesomeIcon icon={faUserGraduate} className="text-xs text-[#0F6B5C]" />
              ) : (
                <FontAwesomeIcon icon={faBuilding} className="text-xs text-[#0F6B5C]" />
              )}
              <span>Reviewed: {reviewedRoleLabel}</span>
            </h3>

            {reviewedUser ? (
              <div className="space-y-3.5 text-xs text-[#1B2430]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center border border-[#F5C445] shrink-0">
                    {reviewedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1B2430] truncate">{reviewedUser.name}</h4>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] block truncate">{reviewedUser.email}</span>
                  </div>
                </div>

                {reviewedProfile ? (
                  <div className="space-y-3 bg-[#FAF8F3] p-3.5 rounded border border-[#D8D2C4] leading-relaxed">
                    {!isStudentReviewer ? (
                      // Student Reviewed Details
                      <>
                        <div>
                          <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Developer Bio</span>
                          <p className="text-xs text-[#6B6459] mt-0.5 line-clamp-3">{reviewedProfile.bio || "Not provided"}</p>
                        </div>
                        <div className="pt-2.5 border-t border-[#D8D2C4]/60 flex flex-col gap-1.5 font-semibold">
                          {reviewedProfile.github && (
                            <a href={reviewedProfile.github.startsWith("http") ? reviewedProfile.github : `https://github.com/${reviewedProfile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                              <FontAwesomeIcon icon={faGithub} className="text-[10px]" />
                              <span>GitHub Profile</span>
                            </a>
                          )}
                          {reviewedProfile.linkedIn && (
                            <a href={reviewedProfile.linkedIn.startsWith("http") ? reviewedProfile.linkedIn : `https://linkedin.com/in/${reviewedProfile.linkedIn}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                              <FontAwesomeIcon icon={faLinkedin} className="text-[10px]" />
                              <span>LinkedIn Connect</span>
                            </a>
                          )}
                        </div>
                      </>
                    ) : (
                      // Business Reviewed Details
                      <>
                        <div>
                          <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Business Name</span>
                          <span className="font-bold text-[#1B2430]">{reviewedProfile.businessName || "Not provided"}</span>
                        </div>
                        <div>
                          <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Category/Type</span>
                          <span>{reviewedProfile.businessType || "Not provided"}</span>
                        </div>
                        <div className="pt-2.5 border-t border-[#D8D2C4]/60 flex flex-col gap-1.5 font-semibold">
                          {reviewedProfile.socialLinks?.website && (
                            <a href={reviewedProfile.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0F6B5C] hover:underline">
                              <FontAwesomeIcon icon={faGlobe} className="text-[10px]" />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#6B6459] italic p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4]">No reviewed profile registered.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#6B6459] italic">Reviewed user details are missing.</p>
            )}
          </section>

          {/* Related Application Proposal Context */}
          {application && (
            <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[4px_4px_0px_#1B2430] space-y-4">
              <h3 className="font-['Space_Grotesk'] font-bold text-md text-[#1B2430] pb-2 border-b border-[#D8D2C4] flex items-center gap-2">
                <FontAwesomeIcon icon={faClipboardList} className="text-xs text-[#0F6B5C]" />
                <span>Proposal Context</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">Application Status:</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-[3px] border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200/60">
                    {application.status || "—"}
                  </span>
                </div>
                {application.coverLetter && (
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#6B6459] uppercase tracking-wider block font-semibold">Cover Letter</span>
                    <p className="text-xs text-[#6B6459] line-clamp-3 leading-relaxed bg-[#FAF8F3] p-2.5 rounded border border-[#D8D2C4]/60 mt-1">{application.coverLetter}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-[#D8D2C4]/60 text-right">
                  <Link
                    to={`/admin/applications/${application._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#1B2430] hover:text-white border border-[#D8D2C4] rounded-[4px] text-xs font-semibold text-[#1B2430] transition-colors cursor-pointer"
                  >
                    <span>View Application</span>
                    <FontAwesomeIcon icon={faArrowLeft} className="rotate-180 text-[10px]" />
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminReviewDetails;
