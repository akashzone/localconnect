import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0">

                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">
                        LocalConnect
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">

                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Users
                    </NavLink>

                    <NavLink
                        to="/admin/projects"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Projects
                    </NavLink>

                    <NavLink
                        to="/admin/applications"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Applications
                    </NavLink>

                    <NavLink
                        to="/admin/submissions"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Work Submissions
                    </NavLink>

                    <NavLink
                        to="/admin/reviews"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Reviews
                    </NavLink>

                    <NavLink
                        to="/admin/reports"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Reports
                    </NavLink>

                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1">

                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Admin Panel
                    </h2>

                    <div className="text-sm text-gray-600">
                        Admin
                    </div>

                </header>

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>

            </main>

        </div>
    );
};

export default AdminLayout;