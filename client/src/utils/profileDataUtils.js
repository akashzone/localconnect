export const INITIAL_FORM_DATA = {
  bio: "",
  businessName: "",
  businessType: "",
  description: "",
  phone: "",
  address: "",
  socialLinks: {
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  },
  github: "",
  linkedIn: "",
  portfolio: "",
  resume: "",
  skills: "",
};

export function profileToFormData(profile) {
  return {
    bio: profile?.bio || "",
    businessName: profile?.businessName || "",
    businessType: profile?.businessType || "",
    description: profile?.description || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    socialLinks: {
      website: profile?.socialLinks?.website || "",
      instagram: profile?.socialLinks?.instagram || "",
      facebook: profile?.socialLinks?.facebook || "",
      linkedin: profile?.socialLinks?.linkedin || "",
    },
    github: profile?.github || "",
    linkedIn: profile?.linkedIn || "",
    portfolio: profile?.portfolio || "",
    resume: profile?.resume || "",
    skills: profile?.skills ? profile.skills.join(", ") : "",
  };
}

export function getProfileSaveData(formData, isStudent) {
  if (isStudent) {
    return {
      bio: formData.bio,
      github: formData.github,
      linkedIn: formData.linkedIn,
      portfolio: formData.portfolio,
      resume: formData.resume,
      skills: formData.skills,
    };
  }

  return {
    businessName: formData.businessName,
    businessType: formData.businessType,
    description: formData.description,
    phone: formData.phone,
    address: formData.address,
    socialLinks: formData.socialLinks,
  };
}

export function getInitials(name) {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";
}

export function hasValidProfileImage(profileImage) {
  return (
    profileImage &&
    profileImage.startsWith("http") &&
    !profileImage.includes("unsplash.com/illustrations")
  );
}

export const socialLinkFields = [
  { key: "website", label: "Website" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
];
