export function ProfileLoadingState() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
      <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
        Loading profile...
      </p>
    </div>
  );
}

export function ProfileErrorState() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
      <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">
        Failed to load profile.
      </p>
    </div>
  );
}
