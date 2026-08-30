function LinkValue({ value, label }) {
  if (!value) {
    return <p className="text-[14.5px] text-[#9B9384] italic">Not set</p>;
  }

  const href = value.startsWith("http") ? value : `https://${value}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[14px] text-[#0F6B5C] font-semibold hover:underline"
    >
      View {label}
    </a>
  );
}

export function StudentViewSection({
  profile,
}) {
  return (
    <div className="space-y-6">
      <div>
        <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-2">
          Skills
        </span>

        {profile.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
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

      <div className="border-t border-dashed border-[#D8D2C4] pt-6 grid sm:grid-cols-4 gap-6">
        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            GitHub
          </span>
          <LinkValue value={profile.github} label="GitHub" />
        </div>

        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            LinkedIn
          </span>
          <LinkValue value={profile.linkedIn} label="LinkedIn" />
        </div>

        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            Portfolio
          </span>
          <LinkValue value={profile.portfolio} label="Portfolio" />
        </div>

        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            Resume
          </span>
          <LinkValue value={profile.resume} label="Resume" />
        </div>
      </div>
    </div>
  );
}

export function BusinessViewSection({ profile, socialLinkFields }) {
  return (
    <>
      <div className="border-t border-dashed border-[#D8D2C4] pt-6 grid sm:grid-cols-2 gap-6">
        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            Business Type
          </span>
          <p className="text-[14.5px] text-[#4A473F]">
            {profile.businessType || (
              <span className="text-[#9B9384] italic">Not set</span>
            )}
          </p>
        </div>

        <div>
          <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
            Phone
          </span>
          <p className="text-[14.5px] text-[#4A473F]">
            {profile.phone || (
              <span className="text-[#9B9384] italic">Not set</span>
            )}
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-[#D8D2C4] pt-6">
        <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
          Address
        </span>
        <p className="text-[14.5px] text-[#4A473F]">
          {profile.address || (
            <span className="text-[#9B9384] italic">Not set</span>
          )}
        </p>
      </div>

      <div className="border-t border-dashed border-[#D8D2C4] pt-6">
        <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
          Description
        </span>
        <p className="text-[14.5px] text-[#4A473F] leading-relaxed">
          {profile.description || (
            <span className="text-[#9B9384] italic">Not set</span>
          )}
        </p>
      </div>

      <div className="border-t border-dashed border-[#D8D2C4] pt-6 grid sm:grid-cols-2 gap-6">
        {socialLinkFields.map(({ key, label }) => (
          <div key={key}>
            <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
              {label}
            </span>
            <LinkValue value={profile.socialLinks?.[key]} label={label} />
          </div>
        ))}
      </div>
    </>
  );
}
