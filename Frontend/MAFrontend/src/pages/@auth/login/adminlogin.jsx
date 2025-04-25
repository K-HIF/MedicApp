import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ALogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  
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

      const contentType = response.headers.get("Content-Type");
      const responseBody = await response.text();

      if (response.ok) {
        const { access, refresh } = JSON.parse(responseBody);
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        navigate("/dashboard");
      } else {
        let errorMessage = "Error logging in";
        if (contentType && contentType.includes("application/json")) {
          const result = JSON.parse(responseBody);
          errorMessage = result.error || errorMessage;
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forgot-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      if (response.ok) {
        setForgotMessage("A new password has been sent to your email.");
      } else {
        const result = await response.json();
        setForgotError(result.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setForgotError("Failed to reset password.");
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
      
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/homepage.webp"
          alt="Hospital Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-blue-600/20 " />
      </div>

      
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
            Please enter your employee ID and password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your employee ID"
                required
              />
            </div>

            {/* Password Input */}
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

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Enhanced Sign In Button */}
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
        </div>
      </div>

      
      {showForgotPassword && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <h2 className="text-white text-lg font-semibold mb-4">
              Reset Your Password
            </h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="forgot-email"
                  className="block text-gray-400 mb-2"
                >
                  Enter your registered email
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-300 ease-in-out"
              >
                Submit
              </button>
            </form>
            {forgotMessage && <p className="mt-4 text-green-500">{forgotMessage}</p>}
            {forgotError && <p className="mt-4 text-red-500">{forgotError}</p>}
            <button
              onClick={() => setShowForgotPassword(false)}
              className="mt-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ALogin;