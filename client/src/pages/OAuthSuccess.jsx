import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [statusMessage, setStatusMessage] = useState("Securing connection...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // Step 1: Wait briefly for a smooth transition feel
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatusMessage("Fetching Google credentials...");

        // Step 2: Request current user details from backend using HttpOnly cookies
        const res = await api.get("/auth/me");
        const user = res.data.user;

        if (!user) {
          throw new Error("No user profile received");
        }

        setStatusMessage(`Welcome back, ${user.name || "User"}! Synchronizing workspace...`);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Step 3: Write user to state & localStorage
        login(user);

        // Step 4: Redirect based on user role
        if (user.role === "business") {
          navigate("/dashboard/business", { replace: true });
        } else if (user.role === "student") {
          navigate("/dashboard/student", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("Google authentication integration error:", err);
        setError(err.response?.data?.message || "Failed to authenticate with Google");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    };

    authenticateUser();
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F3] px-4 font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="w-full max-w-md p-8 bg-white border border-[#D8D2C4] rounded-[6px] shadow-[6px_6px_0px_#1B2430] text-center relative overflow-hidden">
        {/* Subtle accent border on top */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#0F6B5C] via-[#F5C445] to-[#0F6B5C]" />

        {!error ? (
          <div className="flex flex-col items-center py-6">
            {/* Spinning & pulsing Google-colored circular loader */}
            <div className="relative w-20 h-20 mb-8">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#0F6B5C]/10 animate-ping" />
              {/* Middle track */}
              <div className="absolute inset-0 rounded-full border-4 border-[#D8D2C4]" />
              {/* Animated spinner segments */}
              <div className="absolute inset-0 rounded-full border-4 border-t-[#0F6B5C] border-r-[#F5C445] border-transparent animate-spin" />
              {/* Google icon in the center */}
              <div className="absolute inset-4 flex items-center justify-center bg-[#FAF8F3] rounded-full shadow-inner">
                <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
            </div>

            <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#0F6B5C] font-semibold mb-2">
              Authenticating
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl mb-3 text-[#1B2430]">
              Google Sign-In
            </h2>
            <p className="text-sm text-[#6B6459] transition-all duration-300 font-medium min-h-[20px]">
              {statusMessage}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6">
            {/* Error indicator */}
            <div className="w-16 h-16 bg-[#EA4335]/10 text-[#EA4335] rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>

            <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#EA4335] font-semibold mb-2">
              Authorization Failed
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl mb-3 text-[#1B2430]">
              Oops, something went wrong
            </h2>
            <p className="text-sm text-[#6B6459] mb-6 font-medium">{error}</p>
            <p className="text-xs text-[#9B9384] animate-pulse">
              Redirecting you to the sign-in screen...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OAuthSuccess;
