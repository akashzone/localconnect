import { useEffect, useState, useContext } from "react";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";

function Profile() {
    const { user } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [editing, setEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const isStudent = user?.role === "student";
    // Flagged above: backend expects "businessOwner", rest of the app uses "business".
    // Using both here so the page still renders correctly regardless of which is actually true.
    const isBusiness = user?.role === "business" || user?.role === "businessOwner";

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await api.get("/profile");
                setProfile(res.data.profile);
                setFieldValue(
                    isStudent ? res.data.profile?.bio || "" : res.data.profile?.businessName || ""
                );
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isStudent]);

    const handleSave = async () => {
        setSaving(true);
        setSaveError("");
        try {
            const res = await api.put("/profile", {
                bio: isStudent ? fieldValue : undefined,
                businessName: isBusiness ? fieldValue : undefined,
            });
            setProfile(res.data.profile);
            setEditing(false);
        } catch (err) {
            console.log(err);
            setSaveError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
                <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
                <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">Failed to load profile.</p>
            </div>
        );
    }

    const name = profile.userId?.name;
    const email = profile.userId?.email;
    const role = profile.userId?.role;
    const initials = name
        ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    return (
        <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430]">

                    {/* Header */}
                    <div className="flex items-center gap-5 mb-8">
                        <div
                            className="w-16 h-16 flex items-center justify-center rounded-[6px] bg-[#1B2430] text-[#F5C445]
                         font-['Space_Grotesk'] font-bold text-xl rotate-[-2deg] shadow-[3px_3px_0px_#F5C445]"
                        >
                            {initials}
                        </div>
                        <div>
                            <h1 className="font-['Space_Grotesk'] font-bold text-2xl">{name}</h1>
                            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-[#0F6B5C]">
                                {isStudent ? "Developer" : "Business Owner"}
                            </span>
                        </div>
                    </div>

                    {/* Email + role */}
                    <div className="grid sm:grid-cols-2 gap-6 border-t border-dashed border-[#D8D2C4] pt-6 mb-6">
                        <div>
                            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                                Email
                            </span>
                            <p className="text-[15px]">{email}</p>
                        </div>

                        <div>
                            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                                Role
                            </span>
                            <p className="text-[15px] capitalize">{role}</p>
                        </div>
                    </div>

                    {/* Bio / Business name — editable field */}
                    <div className="border-t border-dashed border-[#D8D2C4] pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384]">
                                {isStudent ? "Bio" : "Business Name"}
                            </span>

                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="font-['IBM_Plex_Mono'] text-[11px] text-[#0F6B5C] hover:underline"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {!editing ? (
                            <p className="text-[14.5px] text-[#4A473F] leading-relaxed">
                                {isStudent ? profile.bio : profile.businessName || "Not set yet."}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {isStudent ? (
                                    <textarea
                                        value={fieldValue}
                                        onChange={(e) => setFieldValue(e.target.value)}
                                        rows={4}
                                        placeholder="Tell businesses a bit about yourself..."
                                        className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[14.5px] resize-none
                               focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                               transition-colors"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={fieldValue}
                                        onChange={(e) => setFieldValue(e.target.value)}
                                        placeholder="Your business name"
                                        className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[14.5px]
                               focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                               transition-colors"
                                    />
                                )}

                                {saveError && (
                                    <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#B3452F]">{saveError}</p>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            setFieldValue(isStudent ? profile.bio || "" : profile.businessName || "");
                                            setSaveError("");
                                        }}
                                        className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                               hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                               shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                               transition-all duration-150 disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;