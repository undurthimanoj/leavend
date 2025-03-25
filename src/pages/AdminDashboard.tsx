import React, { useState, useEffect } from "react";

interface LeaveApplication {
  _id: string;
  name: string;
  email: string;
  course: string;
  subject: string;
  reason: string;
  date: string;
  status?: string;
}

interface AdminCredentials {
  username: string;
  password: string;
}

export const AdminDashboard: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<AdminCredentials>({
    username: "",
    password: "",
  });
  const [authError, setAuthError] = useState<string>("");

  // Application state
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [customDate, setCustomDate] = useState<string>("");
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);

  // Handle authentication input changes
  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle sign-in form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      // Mock authentication with custom credentials
      if (credentials.username === "leaveletter" && credentials.password === "leaveletter@2025") {
        setIsAuthenticated(true);
        localStorage.setItem("adminAuth", "true");
      } else {
        throw new Error("Invalid credentials");
      }

      // Comment out the API call since we're using mock authentication
      // const response = await fetch("http://localhost:5000/api/admin/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(credentials),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error("Invalid credentials");
      // }
      // setIsAuthenticated(true);
      // localStorage.setItem("adminAuth", "true");
    } catch (err) {
      setAuthError((err as Error).message);
    }
  };

  // Handle sign out with page refresh
  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    // Add page refresh after sign out
    window.location.reload();
  };

  // Check for existing authentication
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("adminAuth") === "true";
      setIsAuthenticated(isAuth);
    };
    checkAuth();
  }, []);

  // Fetch applications data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/leave-applications");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: LeaveApplication[] = await response.json();
        setApplications(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [isAuthenticated]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:5000/api/leave-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filterByDate = (date: string) => {
    const today = new Date();
    const applicationDate = new Date(date);

    if (dateFilter === "Today") return applicationDate.toDateString() === today.toDateString();
    if (dateFilter === "This Week") {
      const weekStart = new Date();
      weekStart.setDate(today.getDate() - today.getDay());
      return applicationDate >= weekStart && applicationDate <= today;
    }
    if (dateFilter === "Custom" && customDate) {
      return applicationDate.toDateString() === new Date(customDate).toDateString();
    }
    return true;
  };

  const filteredApplications = applications.filter(
    (app) =>
      (app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
      filterByDate(app.date)
  );

  // Render sign-in form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Sign In</h1>
          {authError && <p className="text-red-500 text-center mb-4">{authError}</p>}
          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleAuthInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleAuthInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render dashboard if authenticated
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Sign Out
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name, email, subject, reason..."
            className="p-2 border rounded-md w-1/3"
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          <div className="flex items-center space-x-4">
            <select
              className="p-2 border rounded-md"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="Custom">Custom Date</option>
            </select>
            {dateFilter === "Custom" && (
              <input
                type="date"
                className="p-2 border rounded-md"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                autoComplete="off"
              />
            )}
          </div>
        </div>

        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Leave Applications</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Subject</th>
                  <th className="border px-4 py-2">Reason</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="text-center">
                    <td className="border px-4 py-2">{new Date(app.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{app.name}</td>
                    <td className="border px-4 py-2">{app.email}</td>
                    <td className="border px-4 py-2">{app.subject}</td>
                    <td className="border px-4 py-2">
                      {app.reason.length > 40 ? `${app.reason.substring(0, 40)}...` : app.reason}
                    </td>
                    <td
                      className={`border px-4 py-2 font-semibold ${
                        app.status === "Approved"
                          ? "text-green-500"
                          : app.status === "Not Approved"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {app.status || "Pending"}
                    </td>
                    <td className="border px-4 py-2 flex justify-center space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700"
                        onClick={() => updateStatus(app._id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                        onClick={() => updateStatus(app._id, "Not Approved")}
                      >
                        Not Approve
                      </button>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                        onClick={() => setSelectedApplication(app)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedApplication && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Application Details</h2>
            <p><strong>Name:</strong> {selectedApplication.name}</p>
            <p><strong>Email:</strong> {selectedApplication.email}</p>
            <p><strong>Course:</strong> {selectedApplication.course}</p>
            <p><strong>Subject:</strong> {selectedApplication.subject}</p>
            <p><strong>Reason:</strong> {selectedApplication.reason}</p>
            <p><strong>Date:</strong> {new Date(selectedApplication.date).toLocaleDateString()}</p>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-700"
              onClick={() => setSelectedApplication(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};