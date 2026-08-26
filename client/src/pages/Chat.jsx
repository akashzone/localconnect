import { useEffect, useState, useRef, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperPlane, faCircle } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket/socket";

function Chat() {
  const { applicationId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(socket.connected);

  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch application metadata & message history
  useEffect(() => {
    let active = true;

    const fetchChatData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch application details
        const appRes = await api.get(`/applications/${applicationId}`);
        if (!active) return;
        setApplication(appRes.data.data);

        // Fetch message history
        const msgRes = await api.get(`/applications/${applicationId}/messages`);
        if (!active) return;
        setMessages(msgRes.data.messages || []);
      } catch (err) {
        console.error("Failed to load chat data:", err);
        if (active) {
          setError(err.response?.data?.message || "Failed to load chat details. Please verify your permissions.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchChatData();

    return () => {
      active = false;
    };
  }, [applicationId]);

  // Socket.IO Integration
  useEffect(() => {
    // Join chat room when socket is connected & application is loaded
    const joinChatRoom = () => {
      console.log(`Socket joining chat room for application: ${applicationId}`);
      socket.emit("joinChat", applicationId);
    };

    const handleConnect = () => {
      setSocketConnected(true);
      joinChatRoom();
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleChatJoined = (data) => {
      console.log("Successfully joined Socket room:", data);
      setSocketConnected(true);
    };

    const handleNewMessage = (newMessage) => {
      if (newMessage.applicationId === applicationId) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
    };

    const handleChatError = (err) => {
      console.error("Socket chat error:", err);
      setError(err.message || "A socket communication error occurred.");
    };

    // Event listeners registration
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("chatJoined", handleChatJoined);
    socket.on("newMessage", handleNewMessage);
    socket.on("chatError", handleChatError);

    // If socket is already connected, join room directly
    if (socket.connected) {
      setSocketConnected(true);
      joinChatRoom();
    } else {
      socket.connect();
    }

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chatJoined", handleChatJoined);
      socket.off("newMessage", handleNewMessage);
      socket.off("chatError", handleChatError);
    };
  }, [applicationId]);

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    socket.emit("sendMessage", {
      applicationId,
      message: messageInput.trim(),
    });

    setMessageInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center font-['IBM_Plex_Sans'] text-[#1B2430]">
        <div className="w-8 h-8 border-4 border-[#0F6B5C] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">Opening secure chat connection...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-6 font-['IBM_Plex_Sans'] text-[#1B2430]">
        <div className="max-w-md w-full bg-white border border-[#D8D2C4] rounded-[6px] p-8 shadow-[5px_5px_0px_#B3452F] text-center">
          <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F] mb-6 font-semibold">
            ⚠️ {error || "Failed to load chat."}
          </p>
          <button
            onClick={() => navigate(user?.role === "business" ? "/applications/business" : "/my-applications")}
            className="font-semibold text-sm px-6 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3] hover:bg-[#2c3746] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Determine chat partner identity
  const isCurrentUserStudent = user?.role !== "business";
  const partnerName = isCurrentUserStudent
    ? application.projectId?.businessProfile?.businessName || application.projectId?.businessProfile?.companyName || "Business Owner"
    : application.studentId?.name || "Student Developer";
  const partnerRole = isCurrentUserStudent ? "Client / Business Owner" : "Student Developer";
  const projectTitle = application.projectId?.title || "Project Space";

  const backLink = isCurrentUserStudent ? "/my-applications" : "/applications/business";

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs text-[#6B6459] hover:text-[#1B2430] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Applications
          </Link>
        </div>

        {/* Chat Card */}
        <div className="bg-white border border-[#D8D2C4] rounded-[6px] shadow-[5px_5px_0px_#1B2430] h-[calc(100vh-190px)] min-h-[480px] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#D8D2C4] bg-white rounded-t-[6px] flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-['Space_Grotesk'] font-bold text-lg leading-tight flex items-center gap-2 flex-wrap">
                {partnerName}
                <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase font-normal tracking-wider px-2 py-0.5 rounded-[3px] bg-[#E9F5F1] text-[#0F6B5C]">
                  {partnerRole}
                </span>
              </h2>
              <p className="text-xs text-[#6B6459] mt-0.5 font-medium">
                Project: <span className="text-[#1B2430] font-semibold">{projectTitle}</span>
              </p>
            </div>

            {/* Connection Status Dot */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-['IBM_Plex_Mono'] font-medium ${
                socketConnected ? "text-[#0F6B5C]" : "text-[#B3452F]"
              }`}>
                {socketConnected ? "Connected" : "Reconnecting..."}
              </span>
              <FontAwesomeIcon
                icon={faCircle}
                className={`text-[9px] animate-pulse ${
                  socketConnected ? "text-[#0F6B5C]" : "text-[#B3452F]"
                }`}
              />
            </div>
          </div>

          {/* Messages Panel */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#FAF8F3]/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <span className="text-3xl mb-2">💬</span>
                <p className="font-['IBM_Plex_Mono'] text-xs text-[#9B9384] font-medium uppercase tracking-wider">
                  No messages yet
                </p>
                <p className="text-sm text-[#6B6459] mt-1">
                  Start the conversation by typing a message below.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSentByMe = msg.senderId === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-[6px] p-3.5 ${
                        isSentByMe
                          ? "bg-[#0F6B5C] text-white rounded-tr-none shadow-[2px_2px_0px_#1B2430]"
                          : "bg-white border border-[#D8D2C4] text-[#1B2430] rounded-tl-none shadow-[2px_2px_0px_#D8D2C4]"
                      }`}
                    >
                      <p className="text-[14px] leading-relaxed break-words">{msg.message}</p>
                      <span
                        className={`block text-[9px] font-['IBM_Plex_Mono'] mt-1.5 text-right ${
                          isSentByMe ? "text-[#FAF8F3]/75" : "text-[#9B9384]"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-[#D8D2C4] bg-white rounded-b-[6px] flex items-center gap-3"
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-[#D8D2C4] rounded-[4px] px-4 py-3 text-sm
                         focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                         transition-all"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-5 py-3 rounded-[4px] bg-[#1B2430] text-[#FAF8F3] font-semibold text-sm
                         flex items-center gap-2 hover:bg-[#2c3746] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Send</span>
              <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
