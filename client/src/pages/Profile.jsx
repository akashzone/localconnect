import { useEffect, useRef, useState, useContext } from "react";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import ImageCropperModal from "../components/profile/ImageCropperModal";
import RatingSummary from "../components/review/RatingSummary";
import ReviewList from "../components/review/ReviewList";
import {
    TextInput,
    TextArea,
} from "../components/project/FormFields";
import {
    StudentViewSection,
    BusinessViewSection,
} from "../components/profile/ProfileViewSections";
import {
    INITIAL_FORM_DATA,
    profileToFormData,
    getProfileSaveData,
    getInitials,
    hasValidProfileImage,
    socialLinkFields,
} from "../utils/profileDataUtils";
import {
    getCroppedImg,
    validateProfileImage,
    validateResume,
} from "../utils/imageUtils";
import {
    ProfileLoadingState,
    ProfileErrorState,
} from "../components/profile/ProfileStates";

function Profile() {
    const { user, profile, setProfile } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const fileInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const isStudent = user?.role === "student";
    const isBusiness =
        user?.role === "business" || user?.role === "businessOwner";

    useEffect(() => {
        const fetchReviews = async () => {
            if (!user?._id) return;
            try {
                setLoadingReviews(true);
                let res;
                if (isStudent) {
                    res = await api.get("/review/my");
                } else {
                    res = await api.get(`/review/business/${user._id}`);
                }
                setReviews(res.data.reviews || []);
                setAverageRating(res.data.averageRating || 0);
                setTotalReviews(res.data.totalReviews || 0);
            } catch (err) {
                console.error("Failed to fetch reviews for current user:", err);
            } finally {
                setLoadingReviews(false);
            }
        };

        if (!loading && profile) {
            fetchReviews();
        }
    }, [user?._id, isStudent, loading, profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");

            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationError = validateProfileImage(file);

        if (validationError) {
            alert(validationError);
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setImageSrc(reader.result);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setIsCropperOpen(true);
        };

        reader.readAsDataURL(file);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCloseCropper = () => {
        setIsCropperOpen(false);
        setImageSrc(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSaveCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setUploading(true);

        try {
            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );

            if (!croppedBlob) {
                throw new Error("Failed to crop image");
            }

            const croppedFile = new File([croppedBlob], "cropped-profile.jpg", {
                type: "image/jpeg",
            });

            const formDataObj = new FormData();
            formDataObj.append("profileImage", croppedFile);

            const res = await api.post("/upload/profile-image", formDataObj);
            const secureUrl = res.data.response?.secure_url;

            if (secureUrl) {
                setProfile((prev) => ({
                    ...prev,
                    profileImage: secureUrl,
                }));

                setIsCropperOpen(false);
                setImageSrc(null);
            } else {
                alert("Failed to retrieve upload URL from response.");
            }
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to upload image. Please try again."
            );
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const triggerResumeInput = () => {
        resumeInputRef.current?.click();
    };

    const handleResumeChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationError = validateResume(file);

        if (validationError) {
            alert(validationError);
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append("resume", file);

        setUploadingResume(true);

        try {
            const res = await api.post("/upload/resume", formDataObj);
            const secureUrl = res.data.response?.secure_url;

            if (secureUrl) {
                setProfile((prev) => ({
                    ...prev,
                    resume: secureUrl,
                }));
            } else {
                alert("Failed to retrieve upload URL from response.");
            }
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to upload resume. Please try again."
            );
        } finally {
            setUploadingResume(false);

            if (resumeInputRef.current) {
                resumeInputRef.current.value = "";
            }
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(false);

                const res = await api.get("/profile");
                const prof = res.data.profile;

                setProfile(prof);
                setFormData(profileToFormData(prof));
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isStudent, setProfile]);

    const handleSave = async () => {
        setSaving(true);
        setSaveError("");

        try {
            const dataToSave = getProfileSaveData(formData, isStudent);

            const res = await api.put("/profile", dataToSave);

            setProfile(res.data.profile);
            setEditing(false);
        } catch (err) {
            console.log(err);
            setSaveError(
                err.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData(profileToFormData(profile));
        setSaveError("");
    };

    if (loading) return <ProfileLoadingState />;
    if (error || !profile) return <ProfileErrorState />;

    const name = profile.userId?.name;
    const email = profile.userId?.email;
    const role = profile.userId?.role;
    const initials = getInitials(name);
    const hasProfileImage = hasValidProfileImage(profile.profileImage);

    return (
        <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
            <div className="max-w-2xl mx-auto">
                <div className="relative bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430]">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <ProfileHeader
                        profile={profile}
                        name={name}
                        isStudent={isStudent}
                        initials={initials}
                        hasProfileImage={hasProfileImage}
                        uploading={uploading}
                        onImageClick={triggerFileInput}
                    />

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

                    <div className="border-t border-dashed border-[#D8D2C4] pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384]">
                                {isStudent
                                    ? "Bio"
                                    : editing
                                        ? "Business Details"
                                        : "Business Name"}
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
                            <div className="space-y-6">
                                <p className="text-[14.5px] text-[#4A473F] leading-relaxed">
                                    {isStudent
                                        ? profile.bio || "No bio set yet."
                                        : profile.businessName || "Not set yet."}
                                </p>

                                {isStudent && (
                                    <StudentViewSection
                                        profile={profile}
                                        resumeInputRef={resumeInputRef}
                                        uploadingResume={uploadingResume}
                                        onResumeChange={handleResumeChange}
                                        onTriggerResume={triggerResumeInput}
                                    />
                                )}

                                {isBusiness && (
                                    <BusinessViewSection
                                        profile={profile}
                                        socialLinkFields={socialLinkFields}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {isStudent ? (
                                    <div className="space-y-4">
                                        <TextArea
                                            label=""
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Tell businesses a bit about yourself..."
                                        />

                                        <TextInput
                                            label="Skills (comma-separated)"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            placeholder="e.g. React, Node.js, Python, Tailwind"
                                        />

                                        <div className="grid sm:grid-cols-4 gap-4">
                                            <TextInput
                                                label="GitHub URL"
                                                name="github"
                                                value={formData.github}
                                                onChange={handleChange}
                                                placeholder="github.com/username"
                                            />

                                            <TextInput
                                                label="LinkedIn URL"
                                                name="linkedIn"
                                                value={formData.linkedIn}
                                                onChange={handleChange}
                                                placeholder="linkedin.com/in/username"
                                            />

                                            <TextInput
                                                label="Portfolio URL"
                                                name="portfolio"
                                                value={formData.portfolio}
                                                onChange={handleChange}
                                                placeholder="yourportfolio.com"
                                            />

                                            <TextInput
                                                label="Resume URL"
                                                name="resume"
                                                value={formData.resume}
                                                onChange={handleChange}
                                                placeholder="drive.google.com/..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <TextInput
                                                label="Business Name"
                                                name="businessName"
                                                value={formData.businessName}
                                                onChange={handleChange}
                                                placeholder="Your business name"
                                            />

                                            <TextInput
                                                label="Business Type"
                                                name="businessType"
                                                value={formData.businessType}
                                                onChange={handleChange}
                                                placeholder="e.g. Restaurant, Retail, Agency"
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <TextInput
                                                label="Phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="e.g. +91 98765 43210"
                                            />

                                            <TextInput
                                                label="Address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="Street, city, state"
                                            />
                                        </div>

                                        <TextArea
                                            label="Description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Tell developers a bit about your business..."
                                        />

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {socialLinkFields.map(({ key, label }) => (
                                                <TextInput
                                                    key={key}
                                                    label={label}
                                                    name={`socialLinks.${key}`}
                                                    value={formData.socialLinks[key]}
                                                    onChange={handleChange}
                                                    placeholder={`${label.toLowerCase()}.com/yourbusiness`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {saveError && (
                                    <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#B3452F]">
                                        {saveError}
                                    </p>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleCancel}
                                        className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3] shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!editing && (
                    <div className="mt-8 bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430]">
                        <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-6 text-[#1B2430]">
                            Reviews & Feedback
                        </h3>
                        {loadingReviews ? (
                            <p className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">Loading reviews...</p>
                        ) : (
                            <div className="space-y-6">
                                <RatingSummary averageRating={averageRating} totalReviews={totalReviews} />
                                <ReviewList reviews={reviews} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isCropperOpen && (
                <ImageCropperModal
                    imageSrc={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    uploading={uploading}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onClose={handleCloseCropper}
                    onSave={handleSaveCroppedImage}
                />
            )}
        </div>
    );
}

export default Profile;

