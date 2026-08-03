import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";
import EditProjectForm from "../components/project/EditProjectForm";

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Guard: only business owners can access this page
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/${id}/edit-project` } });
        } else if (user?.role !== "business") {
            navigate("/");
        }
    }, [isAuthenticated, user, navigate, id]);

    // Fetch the existing project to pre-fill the form
    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setFetchError(false);
                const res = await api.get(`/projects/${id}`);
                setProject(res.data.data);
            } catch (err) {
                console.log(err);
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user?.role === "business") {
            fetchProject();
        }
    }, [id, isAuthenticated, user]);

    const handleSubmit = async (formValues) => {
        setErrorMsg("");

        const { title, description, budget, deadline, category, status, skillsRequired } = formValues;

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
            await api.put(`/projects/${id}`, {
                title,
                description,
                budget: Number(budget),
                deadline,
                category,
                status,
                skillsRequired,
            });

            navigate(`/projects/${id}`);
        } catch (err) {
            console.log(err);
            setErrorMsg(err.response?.data?.message || "Failed to update project");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
                <p className="font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
                    Loading project...
                </p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
                <p className="font-['IBM_Plex_Mono'] text-sm text-[#B3452F]">
                    Failed to load project.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] px-4 py-16">
            <div className="max-w-2xl mx-auto">

                <Link
                    to={`/projects/${id}`}
                    className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C] hover:underline mb-6"
                >
                    ← Back to project
                </Link>

                <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
                    Editing
                </span>
                <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-8">
                    Edit Project
                </h1>

                <EditProjectForm
                    initialData={project}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    errorMsg={errorMsg}
                    cancelTo={`/projects/${id}`}
                />
            </div>
        </div>
    );
}

export default EditProject;