import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/backendapi/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error logging in. Please try again.");
    } finally {
      setLoading(false);
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
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Please sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
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

          <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;