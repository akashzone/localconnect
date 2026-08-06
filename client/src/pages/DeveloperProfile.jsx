import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import api from "../api/api.js";

function DeveloperProfile() {
    const { developerId } = useParams();
    const location = useLocation();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(false);

                const res = await api.get(`/profile/developer/${developerId}`);

                setProfile(res.data.profile);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [developerId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
                <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
                    Loading profile...
                </p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
                <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">
                    Failed to load profile.
                </p>
            </div>
        );
    }

    const u = profile.userId || {};

    const { name, email } = u;

    const {
        bio,
        skills = [],
        github,
        linkedIn,
        portfolio,
        resume,
    } = profile;

    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "?";

    const linkFields = [
        { label: "GitHub", url: github },
        { label: "LinkedIn", url: linkedIn },
        { label: "Portfolio", url: portfolio },
    ];

    return (
        <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
            <div className="max-w-2xl mx-auto">
                <Link
                    to={
                        location.state?.from
                            ? location.state.from.pathname +
                            (location.state.from.search || "")
                            : "/applications/business"
                    }
                    className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C] hover:underline mb-8"
                >
                    ← Back to applications
                </Link>

                <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430]">
                    {/* Header */}
                    <div className="flex items-center gap-5 mb-8">
                        <div
                            className="w-16 h-16 flex items-center justify-center rounded-[6px]
              bg-[#1B2430] text-[#F5C445]
              font-['Space_Grotesk'] font-bold text-xl rotate-[-2deg]
              shadow-[3px_3px_0px_#F5C445]"
                        >
                            {initials}
                        </div>

                        <div>
                            <h1 className="font-['Space_Grotesk'] font-bold text-2xl">
                                {name}
                            </h1>

                            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-[#0F6B5C]">
                                Developer
                            </span>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="border-t border-dashed border-[#D8D2C4] pt-6 mb-6">
                        <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                            Email
                        </span>

                        <p className="text-[15px]">{email}</p>
                    </div>

                    {/* Bio */}
                    {bio && (
                        <div className="border-t border-dashed border-[#D8D2C4] pt-6 mb-6">
                            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
                                Bio
                            </span>

                            <p className="text-[14.5px] text-[#4A473F] leading-relaxed">
                                {bio}
                            </p>
                        </div>
                    )}

                    {/* Skills */}
                    <div className="border-t border-dashed border-[#D8D2C4] pt-6 mb-6">
                        <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
                            Skills
                        </span>

                        {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="font-['IBM_Plex_Mono'] text-xs font-semibold px-2.5 py-1 bg-[#1B2430]/5 text-[#1B2430] border border-[#D8D2C4] rounded-[4px]"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[14.5px] text-[#9B9384] italic">
                                No skills listed yet.
                            </p>
                        )}
                    </div>

                    {/* Links */}
                    <div className="border-t border-dashed border-[#D8D2C4] pt-6 grid sm:grid-cols-3 gap-6 mb-6">
                        {linkFields.map(({ label, url }) => (
                            <div key={label}>
                                <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                                    {label}
                                </span>

                                {url ? (
                                    <a
                                        href={url.startsWith("http") ? url : `https://${url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[14px] text-[#0F6B5C] font-semibold hover:underline"
                                    >
                                        View {label}
                                    </a>
                                ) : (
                                    <p className="text-[14.5px] text-[#9B9384] italic">
                                        Not set
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Resume */}
                    <div className="border-t border-dashed border-[#D8D2C4] pt-6">
                        <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
                            Resume
                        </span>

                        {resume ? (
                            <a
                                href={resume.startsWith("http") ? resume : `https://${resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block font-semibold text-sm px-5 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                shadow-[3px_3px_0px_#F5C445]
                hover:shadow-[1px_1px_0px_#F5C445]
                hover:translate-x-[2px]
                hover:translate-y-[2px]
                transition-all duration-150"
                            >
                                View Resume
                            </a>
                        ) : (
                            <p className="text-[14.5px] text-[#9B9384] italic">
                                Not uploaded
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeveloperProfile;