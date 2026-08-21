import { EditIcon, SpinnerIcon } from "./SpinnerIcon";

function ProfileHeader({
  profile,
  name,
  isStudent,
  initials,
  hasProfileImage,
  uploading,
  onImageClick,
}) {
  return (
    <>
      <button
        onClick={!uploading ? onImageClick : undefined}
        disabled={uploading}
        title="Upload Profile Image"
        className={`absolute top-6 right-6 p-2 rounded-full border border-[#D8D2C4] bg-white text-[#1B2430] shadow-[2px_2px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 ${
          uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {uploading ? <SpinnerIcon /> : <EditIcon />}
      </button>

      <div className="flex items-center gap-5 mb-8">
        <div
          onClick={!uploading ? onImageClick : undefined}
          className={`relative group ${
            uploading ? "cursor-not-allowed" : "cursor-pointer"
          } w-16 h-16 rounded-full shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
        >
          {hasProfileImage ? (
            <img
              src={profile.profileImage}
              alt={name}
              className="w-16 h-16 object-cover object-center rounded-full"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#1B2430] text-[#F5C445] font-['Space_Grotesk'] font-bold text-xl">
              {initials}
            </div>
          )}

          <div
            className={`absolute inset-0 flex items-center justify-center rounded-full transition-colors duration-200 ${
              uploading ? "bg-black/50" : "bg-black/10 group-hover:bg-black/40"
            }`}
          >
            {uploading ? (
              <SpinnerIcon className="h-5 w-5 text-white" />
            ) : (
              <EditIcon className="w-5 h-5 text-white opacity-45 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </div>
        </div>

        <div>
          <h1 className="font-['Space_Grotesk'] font-bold text-2xl">{name}</h1>
          <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-[#0F6B5C]">
            {isStudent ? "Student" : "Business Owner"}
          </span>
        </div>
      </div>
    </>
  );
}

export default ProfileHeader;
