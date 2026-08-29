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
  faShieldHalved,
  faGlobe,
  faPhone,
  faMapMarkerAlt,
  faLink,
  faFilePdf,
  faTimesCircle,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

const AdminUserDetails = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/users/${id}`);
      if (res.data?.success && res.data?.data) {
        setUserData(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load user details. Please check the ID or try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

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

  const getRoleIconAndClass = (role) => {
    switch (role) {
      case "student":
        return {
          icon: faUserGraduate,
          text: "Student",
          badgeClass: "bg-[#0F6B5C]/10 text-[#0F6B5C] border-[#0F6B5C]/20"
        };
      case "business":
        return {
          icon: faBuilding,
          text: "Business",
          badgeClass: "bg-[#F5C445]/10 text-[#7C5A0B] border-[#F5C445]/30"
        };
      case "admin":
        return {
          icon: faShieldHalved,
          text: "Admin",
          badgeClass: "bg-[#1B2430]/10 text-[#1B2430] border-[#1B2430]/20"
        };
      default:
        return {
          icon: faShieldHalved,
          text: role,
          badgeClass: "bg-[#6B6459]/10 text-[#6B6459] border-[#6B6459]/20"
        };
    }
  };

  const renderSocialIcon = (platform) => {
    switch (platform) {
      case "github":
        return <FontAwesomeIcon icon={faGithub} className="text-gray-700" />;
      case "linkedin":
        return <FontAwesomeIcon icon={faLinkedin} className="text-blue-700" />;
      case "instagram":
        return <FontAwesomeIcon icon={faInstagram} className="text-pink-600" />;
      case "facebook":
        return <FontAwesomeIcon icon={faFacebook} className="text-blue-600" />;
      default:
        return <FontAwesomeIcon icon={faGlobe} className="text-[#0F6B5C]" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-[#D8D2C4]/40 animate-pulse rounded-[4px]" />
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-sm animate-pulse space-y-4">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-[#D8D2C4]/40" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-[#D8D2C4]/40 rounded" />
              <div className="h-4 w-32 bg-[#D8D2C4]/40 rounded" />
            </div>
          </div>
          <div className="border-t border-[#D8D2C4]/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-[#D8D2C4]/40 rounded" />
            <div className="h-10 bg-[#D8D2C4]/40 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="space-y-6">
        <Link to="/admin/users" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F6B5C] hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Users</span>
        </Link>
        <div className="p-8 text-center bg-white border border-[#D8D2C4] rounded-[6px] shadow-[4px_4px_0px_#1B2430]">
          <FontAwesomeIcon icon={faTimesCircle} className="text-[#B3452F] text-4xl mb-3" />
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">User Details Error</h3>
          <p className="font-['IBM_Plex_Sans'] text-sm text-[#6B6459] mt-1 max-w-md mx-auto">{error || "User data could not be retrieved."}</p>
          <Link
            to="/admin/users"
            className="inline-block mt-4 px-4 py-2 bg-[#1B2430] text-white rounded-[4px] text-xs font-semibold shadow-[2px_2px_0px_#0F6B5C]"
          >
            Back to Users List
          </Link>
        </div>
      </div>
    );
  }

  const { user, profile } = userData;
  const roleStyle = getRoleIconAndClass(user.role);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#1B2430] border border-[#D8D2C4] rounded-[4px] transition-colors shadow-[2px_2px_0px_#1B2430]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Users</span>
        </Link>
      </div>

      {/* Header Info Card */}
      <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430]">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          {/* Avatar/Photo */}
          <div className="w-16 h-16 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-2xl flex items-center justify-center border-2 border-[#F5C445] overflow-hidden shrink-0">
            {profile?.profileImage && profile.profileImage.startsWith("http") && !profile.profileImage.includes("unsplash.com/illustrations") ? (
              <img
                src={profile.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>

          <div className="space-y-1.5 min-w-0">
            <h2 className="font-['Space_Grotesk'] font-bold text-xl sm:text-2xl text-[#1B2430] truncate">
              {user.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B6459]">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-medium rounded border ${roleStyle.badgeClass}`}>
                <FontAwesomeIcon icon={roleStyle.icon} className="text-[10px]" />
                <span>{roleStyle.text}</span>
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faEnvelope} className="text-[11px]" />
                <span className="font-['IBM_Plex_Mono'] truncate">{user.email}</span>
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faCalendar} className="text-[11px]" />
                <span>Registered: {formatDate(user.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details Container */}
      <section className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 shadow-[4px_4px_0px_#1B2430] space-y-6">
        <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430] pb-2 border-b border-[#D8D2C4]">
          Profile Information
        </h3>

        {user.role === "admin" && (
          <div className="p-4 bg-[#FAF8F3] border border-[#D8D2C4] rounded-[4px] flex items-start gap-3">
            <FontAwesomeIcon icon={faShieldHalved} className="text-[#0F6B5C] mt-0.5 text-base" />
            <div>
              <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430]">Administrator Account</h4>
              <p className="font-['IBM_Plex_Sans'] text-xs text-[#6B6459] mt-1">
                This user has administrative privileges to configure settings, monitor users, audit projects, and moderate activities. No auxiliary developer or business profile metadata exists for this account.
              </p>
            </div>
          </div>
        )}

        {/* Student Profile Info */}
        {user.role === "student" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bio */}
            <div className="space-y-1.5 md:col-span-2">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Bio</span>
              <p className="font-['IBM_Plex_Sans'] text-sm text-[#1B2430] bg-[#FAF8F3] p-3 rounded border border-[#D8D2C4] whitespace-pre-line leading-relaxed">
                {profile?.bio || "Not provided"}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-1.5 md:col-span-2">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Skills & Expertise</span>
              <div className="flex flex-wrap gap-1.5 bg-[#FAF8F3] p-3 rounded border border-[#D8D2C4]">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-['IBM_Plex_Mono'] font-medium bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20 rounded-[3px]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#6B6459] italic">Not provided</span>
                )}
              </div>
            </div>

            {/* Portfolio Link */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Personal Portfolio</span>
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4] text-sm">
                <FontAwesomeIcon icon={faGlobe} className="text-[#0F6B5C]" />
                {profile?.portfolio ? (
                  <a href={profile.portfolio} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-medium truncate">
                    {profile.portfolio}
                  </a>
                ) : (
                  <span className="text-[#6B6459] italic">Not provided</span>
                )}
              </div>
            </div>

            {/* Resume Link */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Resume Document</span>
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4] text-sm">
                <FontAwesomeIcon icon={faFilePdf} className="text-red-700" />
                {profile?.resume ? (
                  <a href={profile.resume} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-medium truncate">
                    View Resume Document
                  </a>
                ) : (
                  <span className="text-[#6B6459] italic">Not provided</span>
                )}
              </div>
            </div>

            {/* GitHub */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">GitHub Handle</span>
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4] text-sm">
                <FontAwesomeIcon icon={faGithub} className="text-gray-800" />
                {profile?.github ? (
                  <a href={profile.github.startsWith("http") ? profile.github : `https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-medium truncate">
                    {profile.github}
                  </a>
                ) : (
                  <span className="text-[#6B6459] italic">Not provided</span>
                )}
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">LinkedIn Profile</span>
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4] text-sm">
                <FontAwesomeIcon icon={faLinkedin} className="text-blue-700" />
                {profile?.linkedIn ? (
                  <a href={profile.linkedIn.startsWith("http") ? profile.linkedIn : `https://linkedin.com/in/${profile.linkedIn}`} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-medium truncate">
                    {profile.linkedIn}
                  </a>
                ) : (
                  <span className="text-[#6B6459] italic">Not provided</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Business Profile Info */}
        {user.role === "business" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-['IBM_Plex_Sans'] text-sm">
            {/* Business Name */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Business Name</span>
              <div className="p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4] font-medium text-[#1B2430]">
                {profile?.businessName || "Not provided"}
              </div>
            </div>

            {/* Business Type */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Business Category / Type</span>
              <div className="p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4] font-medium text-[#1B2430]">
                {profile?.businessType || "Not provided"}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Company / Business Overview</span>
              <p className="p-3 bg-[#FAF8F3] rounded border border-[#D8D2C4] whitespace-pre-line leading-relaxed text-[#1B2430]">
                {profile?.description || "Not provided"}
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Contact Phone</span>
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4]">
                <FontAwesomeIcon icon={faPhone} className="text-[#6B6459]" />
                <span>{profile?.phone || "Not provided"}</span>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">HQ Address</span>
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF8F3] rounded border border-[#D8D2C4]">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#6B6459]" />
                <span className="truncate">{profile?.address || "Not provided"}</span>
              </div>
            </div>

            {/* Social Links Sub-Grid */}
            <div className="space-y-1.5 md:col-span-2">
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459] uppercase tracking-wider font-semibold block">Websites & Social Presence</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#FAF8F3] p-4 rounded border border-[#D8D2C4]">
                {/* Website */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{renderSocialIcon("website")}</span>
                  <span className="text-xs text-[#6B6459] font-medium mr-1 uppercase font-['IBM_Plex_Mono']">Website:</span>
                  {profile?.socialLinks?.website ? (
                    <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-medium truncate text-xs">
                      {profile.socialLinks.website}
                    </a>
                  ) : (
                    <span className="text-[#6B6459]/60 italic text-xs">Not provided</span>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{renderSocialIcon("linkedin")}</span>
                  <span className="text-xs text-[#6B6459] font-medium mr-1 uppercase font-['IBM_Plex_Mono']">LinkedIn:</span>
                  {profile?.socialLinks?.linkedin ? (
                    <a href={profile.socialLinks.linkedin.startsWith("http") ? profile.socialLinks.linkedin : `https://linkedin.com/company/${profile.socialLinks.linkedin}`} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-medium truncate text-xs">
                      {profile.socialLinks.linkedin}
                    </a>
                  ) : (
                    <span className="text-[#6B6459]/60 italic text-xs">Not provided</span>
                  )}
                </div>

                {/* Instagram */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{renderSocialIcon("instagram")}</span>
                  <span className="text-xs text-[#6B6459] font-medium mr-1 uppercase font-['IBM_Plex_Mono']">Instagram:</span>
                  {profile?.socialLinks?.instagram ? (
                    <a href={profile.socialLinks.instagram.startsWith("http") ? profile.socialLinks.instagram : `https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-medium truncate text-xs">
                      {profile.socialLinks.instagram}
                    </a>
                  ) : (
                    <span className="text-[#6B6459]/60 italic text-xs">Not provided</span>
                  )}
                </div>

                {/* Facebook */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{renderSocialIcon("facebook")}</span>
                  <span className="text-xs text-[#6B6459] font-medium mr-1 uppercase font-['IBM_Plex_Mono']">Facebook:</span>
                  {profile?.socialLinks?.facebook ? (
                    <a href={profile.socialLinks.facebook.startsWith("http") ? profile.socialLinks.facebook : `https://facebook.com/${profile.socialLinks.facebook}`} target="_blank" rel="noreferrer" className="text-[#0F6B5C] hover:underline font-medium truncate text-xs">
                      {profile.socialLinks.facebook}
                    </a>
                  ) : (
                    <span className="text-[#6B6459]/60 italic text-xs">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUserDetails;
