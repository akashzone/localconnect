import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";

function CreateProject() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "",
  });
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Guard: only business owners can access this page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/create-project" } });
    } else if (user?.role !== "business") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skillsRequired.includes(skill)) {
      setSkillsRequired([...skillsRequired, skill]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Backspace" && !skillInput && skillsRequired.length > 0) {
      setSkillsRequired(skillsRequired.slice(0, -1));
    }
  };

  const removeSkill = (skill) => {
    setSkillsRequired(skillsRequired.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { title, description, budget, deadline, category } = formData;

    if (!title || !description || !budget || !deadline || !category) {
      return setErrorMsg("All fields are required");
    }
    if (Number(budget) <= 0) {
      return setErrorMsg("Budget must be greater than 0");
    }
    if (skillsRequired.length === 0) {
      return setErrorMsg("Add at least one required skill");
    }

    try {
      setSubmitting(true);
      const res = await api.post("/projects", {
        title,
        description,
        budget: Number(budget),
        deadline,
        category,
        skillsRequired,
      });

      const newProjectId = res.data?.data?._id;
      navigate(newProjectId ? `/projects/${newProjectId}` : "/my-projects");
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
          New posting
        </span>
        <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-8">
          Create a Project
        </h1>

        <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 sm:p-10 shadow-[6px_6px_0px_#1B2430]">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. E-commerce site redesign"
                className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           transition-colors"
              />
            </div>

            <div>
              <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the work, goals, and any specifics developers should know..."
                className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px] resize-none
                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           transition-colors"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                  Budget (₹)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 15000"
                  className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                             focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                             transition-colors"
                />
              </div>

              <div>
                <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                             focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                             transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Web Development"
                className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                           transition-colors"
              />
            </div>

            <div>
              <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                Required Skills
              </label>
              <div className="w-full border border-[#D8D2C4] rounded-[4px] px-3 py-2.5 flex flex-wrap items-center gap-2
                              focus-within:border-[#0F6B5C] focus-within:ring-2 focus-within:ring-[#0F6B5C]/15 transition-colors">
                {skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[12px] px-2.5 py-1 bg-[#FAF8F3] border border-[#D8D2C4] rounded-[3px] text-[#4A473F]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-[#9B9384] hover:text-[#B3452F] leading-none"
                      aria-label={`Remove ${skill}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  onBlur={addSkill}
                  placeholder={skillsRequired.length === 0 ? "e.g. React, press Enter to add" : "Add another..."}
                  className="flex-1 min-w-[120px] text-[15px] py-0.5 focus:outline-none"
                />
              </div>
              <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] mt-1.5">
                Press Enter or comma to add a skill
              </p>
            </div>

            {errorMsg && (
              <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#B3452F]">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-semibold px-6 py-3.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[4px_4px_0px_#F5C445] hover:shadow-[2px_2px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? "Posting..." : "Post Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;