import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faArrowRight,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

function Settings() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Sync user status from backend on mount (handles hasPassword status accurately)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.user) {
          login(res.data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user data in Settings:", err);
      }
    };
    fetchUserData();
  }, []);

  // Local state for logout all devices
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const [logoutAllError, setLogoutAllError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Not available";

  const handleLogoutAllDevices = async () => {
    setShowLogoutModal(false);
    setLoggingOutAll(true);
    setLogoutAllError("");

    try {
      await api.post("/auth/logout-all");
      
      // Clear client session and redirect
      localStorage.removeItem("user");
      // Redirect to login page manually
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout all devices error:", err);
      setLogoutAllError(err.response?.data?.message || "Failed to logout of all devices.");
      setLoggingOutAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl text-[#1B2430]">
            Account Settings
          </h1>
          <p className="font-['IBM_Plex_Mono'] text-xs text-[#9B9384] tracking-wide mt-1.5 uppercase">
            Manage your credentials, security, and sessions
          </p>
        </div>

        {/* Card 1: Account Info */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 shadow-[6px_6px_0px_#1B2430]">
          <div className="flex items-center gap-3 mb-6 border-b border-[#FAF8F3] pb-4">
            <FontAwesomeIcon icon={faUser} className="text-[#0F6B5C] text-lg" />
            <h2 className="font-['Space_Grotesk'] font-bold text-xl text-[#1B2430]">
              Account Details
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                Name
              </span>
              <p className="text-[15px] font-medium">{user?.name || "N/A"}</p>
            </div>

            <div>
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                Email Address
              </span>
              <p className="text-[15px] font-medium text-[#4A473F]">{user?.email || "N/A"}</p>
            </div>

            <div>
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                Role
              </span>
              <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#0F6B5C] bg-[#E9F5F1] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-wider inline-block">
                {user?.role || "N/A"}
              </span>
            </div>

            <div>
              <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9B9384] mb-1">
                Member Since
              </span>
              <p className="text-[15px] font-medium">{formattedDate}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-[#D8D2C4]">
            <p className="text-xs text-[#9B9384] leading-relaxed">
              Email and Role are managed by administration and cannot be changed. Use the profile shortcut below to edit your display name and public credentials.
            </p>
          </div>
        </div>



        {/* Card 3: Profile Shortcut */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 shadow-[6px_6px_0px_#1B2430] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">
              Public Profile
            </h3>
            <p className="text-xs text-[#6B6459] mt-0.5">
              Manage your bio, skills, portfolio, social links, and profile image.
            </p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="font-semibold text-xs px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 flex items-center gap-2 bg-white cursor-pointer"
          >
            <span>Edit Profile</span>
            <FontAwesomeIcon icon={faArrowRight} size="xs" />
          </button>
        </div>

        {/* Card 4: Session / Device Management */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 shadow-[6px_6px_0px_#1B2430] border-l-4 border-l-[#B3452F]">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faSignOutAlt} className="text-[#B3452F] text-lg" />
            <h2 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">
              Session Management
            </h2>
          </div>

          <p className="text-xs text-[#6B6459] leading-relaxed">
            Logout of all active sessions and devices. This will invalidate all your tokens and require logging back in on all platforms.
          </p>

          {logoutAllError && (
            <div className="mt-3 text-xs font-['IBM_Plex_Mono'] text-[#B3452F]">
              {logoutAllError}
            </div>
          )}

          <button
            onClick={() => setShowLogoutModal(true)}
            disabled={loggingOutAll}
            className="mt-4 font-semibold text-xs px-4 py-2.5 rounded-[4px] border-2 border-[#B3452F] text-[#B3452F] hover:bg-[#B3452F] hover:text-[#FAF8F3] transition-colors duration-150 bg-white cursor-pointer disabled:opacity-50"
          >
            {loggingOutAll ? "Logging out all devices..." : "Logout All Devices"}
          </button>
        </div>

      </div>

      {/* Custom Neobrutalist Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-[#1B2430]/60 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430] p-7"
          >
            <div className="w-11 h-11 bg-[#FBE7E4] text-[#B3452F] border border-[#F5C2B8] rounded-[6px] flex items-center justify-center text-xl mb-5 rotate-[-2deg]">
              ⚠️
            </div>

            <h2 className="font-['Space_Grotesk'] font-bold text-xl mb-2 text-[#1B2430]">
              Logout All Devices?
            </h2>

            <p className="text-[13.5px] text-[#6B6459] mb-6 leading-relaxed">
              Are you sure you want to log out of all active sessions and devices? You will be logged out of this device immediately and will need to sign back in.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                           hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogoutAllDevices}
                className="flex-1 font-semibold text-sm px-4 py-2.5 rounded-[4px] text-white bg-[#B3452F] hover:bg-[#963725]
                           shadow-[3px_3px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[2px]
                           hover:translate-y-[2px] transition-all duration-150 cursor-pointer"
              >
                Logout All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
