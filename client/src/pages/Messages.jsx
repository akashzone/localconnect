import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";

function Messages() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch applications based on user role
        const endpoint = user?.role === "business" ? "/applications/business" : "/applications/my";
        const res = await api.get(endpoint);
        
        const apps = user?.role === "business" ? res.data.applications : res.data.data;
        
        // Filter for accepted applications since chat is only available for accepted ones
        // Exclude conversations where the project status is "Completed"
        const acceptedApps = (apps || []).filter(
          (app) => app.status?.toLowerCase() === "accepted" && app.projectId?.status?.toLowerCase() !== "completed"
        );

        setConversations(acceptedApps);
      } catch (err) {
        console.error("Failed to load chat inbox:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchConversations();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center font-['IBM_Plex_Sans'] text-[#1B2430]">
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center font-['IBM_Plex_Sans'] text-[#1B2430]">
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">Failed to load conversations.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
          Communications
        </span>
        <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-8">
          Messages
        </h1>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-[#D8D2C4] rounded-[6px] bg-white">
            <span className="text-4xl mb-3">💬</span>
            <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459] mb-1 font-semibold">
              No active conversations.
            </p>
            <p className="text-xs text-[#9B9384] max-w-xs mx-auto">
              Conversations will appear here once an application status is marked as Accepted.
            </p>
            <Link
              to={user?.role === "business" ? "/dashboard/business" : "/projects"}
              className="mt-6 inline-block font-semibold text-sm px-5 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[1px_1px_0px_#D8D2C4] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150 border-2 border-[#1B2430]"
            >
              {user?.role === "business" ? "Manage Applications" : "Browse Projects"}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => {
              const isStudent = user?.role !== "business";
              const partnerName = isStudent
                ? conv.projectId?.businessProfile?.businessName || conv.projectId?.businessProfile?.companyName || "Business Owner"
                : conv.studentId?.name || "Student Developer";
              const partnerRole = isStudent ? "Client / Owner" : "Student Developer";
              const projectTitle = conv.projectId?.title || "Unknown Project";

              return (
                <div
                  key={conv._id}
                  className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 shadow-[3px_3px_0px_#D8D2C4] flex items-center justify-between gap-4 flex-wrap hover:shadow-[5px_5px_0px_#1B2430] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200"
                >
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#E9F5F1] text-[#0F6B5C] font-semibold">
                      {partnerRole}
                    </span>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg mt-2 mb-1">
                      {partnerName}
                    </h3>
                    <p className="text-xs text-[#6B6459]">
                      Project: <span className="text-[#1B2430] font-semibold">{projectTitle}</span>
                    </p>
                  </div>
                  <Link
                    to={`/chat/${conv._id}`}
                    className="inline-block font-semibold text-sm px-5 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                               shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[1px_1px_0px_#D8D2C4] hover:translate-x-[1px] hover:translate-y-[1px]
                               transition-all border-2 border-[#1B2430]"
                  >
                    Open Chat →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
