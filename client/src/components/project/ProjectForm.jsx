import { useState } from "react";
import { Link } from "react-router-dom";

function ProjectForm({ onSubmit, submitting, errorMsg, cancelTo, submitLabel = "Post Project" }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        category: "",
    });
    const [skillsRequired, setSkillsRequired] = useState([]);
    const [skillInput, setSkillInput] = useState("");

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, skillsRequired });
    };

    return (
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

                <div className="flex gap-3 pt-1">
                    {cancelTo && (
                        <Link
                            to={cancelTo}
                            className="flex-1 text-center font-semibold text-sm px-4 py-3 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                         hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
                        >
                            Cancel
                        </Link>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 font-semibold text-sm px-4 py-3 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                       shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {submitting ? "Posting..." : submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProjectForm;