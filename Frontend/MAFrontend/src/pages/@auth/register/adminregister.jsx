import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [finalSubmitLoading, setFinalSubmitLoading] = useState(false);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // First verify the admin credentials
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/backendapi/verify-admin/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: formData.employee_id,
            email: formData.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowPasswordModal(true);
      } else {
        
        setError(data.error || "Invalid admin credentials");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error verifying credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFinalSubmitLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/backendapi/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate("/master");
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error during registration");
    } finally {
      setLoading(false);
      setFinalSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/homepage.webp"
          alt="Hospital Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-blue-600/20" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8 lg:px-24 overflow-y-auto">
        <div className="mb-8 animate-fade-in">
          <img
            src="/logo1.png"
            alt="MedicApp Logo"
            className="h-16 w-auto"
          />
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Admin Registration
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Please verify your credentials
          </p>

          <form onSubmit={showPasswordModal ? handleFinalSubmit : handleInitialSubmit} className="space-y-6">
            <div>
              <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your employee ID"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                       text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 
                       transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Verify Credentials</span>
                  <svg
                    className="w-5 h-5 ml-2 -mr-1 transition-transform duration-300 transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>

            {error && (
              <div className="text-red-500 text-sm text-center animate-shake">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center z-30">
          {/* Blurred background overlay */}
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-md"></div>
          
          <div className="relative bg-gradient-to-br from-blue-800 to-indigo-900 p-8 rounded-xl w-96 shadow-2xl transform transition-all">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Set Your Password
            </h2>
            <form onSubmit={handleFinalSubmit}>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  placeholder="Enter your new password"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={finalSubmitLoading}
                  className="flex-1 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-semibold py-3 px-4 rounded-lg 
                           transition-all duration-300 transform hover:scale-105 hover:shadow-lg 
                           active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {finalSubmitLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Granting access...</span>
                    </div>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={finalSubmitLoading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg 
                           transition-all duration-300 transform hover:scale-105
                           active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegister;