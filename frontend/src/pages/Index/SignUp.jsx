import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate, NavLink } from 'react-router-dom';
import { MdArrowBack, MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { profileStore } from '../../store/Pfile_store';
import { request } from '../../utils/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import phonefull from '@/Img/login/containerfull.png'; 
 

const SignUp = () => {
  const { funSetAccessToken, funSetUser, funSetPermission } = profileStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onFinish = async () => {
    setIsLoading(true);
    setErrorMessage('');

    // Basic validation
    if (formData.password !== formData.password_confirmation) {
      setErrorMessage("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await request("sign-up", "post", formData);

      if (res && !res.error) {
        // If the API returns token and user data directly after signup
        if (res.access_token) {
          funSetAccessToken(res.access_token);
          funSetUser(res.user);
          funSetPermission(res.permission);
        }

        toast.success("Account created successfully!");

        setTimeout(() => {
          // Redirect to signin or dashboard based on your flow
          if (res.access_token) {
            navigate("/admin/news-posts");
          } else {
            navigate("/signin");
          }
        }, 1500);
      } else {
        setErrorMessage(res.error || "Failed to create account. Please try again.");
        toast.error("Sign up failed");
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      setErrorMessage("An error occurred. Please try again later.");
      toast.error("An error occurred while creating account.");
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleError = () => {
    console.error("Google sign up failed");
    setErrorMessage("Google sign up failed. Try again.");
    toast.error("Google sign up failed.");
  };

  return (
    <div className="  bg-gradient-to-br flex items-center justify-center ">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-8 md:p-10 lg:p-12 mx-auto md:mx-0">
       

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-[#102249] mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 text-base lg:text-lg">
              Sign up to get started with your account
            </p>
          </div>
           

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => {
            e.preventDefault();
            onFinish();
          }}>
            {/* Name Input */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 ">
                Full Name
              </label>
              <div className="relative ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPerson className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#102249] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#102249] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#102249] focus:border-transparent transition-all duration-200"
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 ">Must be at least 8 characters long</p>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-8">
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#102249] focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-4 bg-gradient-to-r from-[#102249] to-blue-900 text-white font-semibold rounded-xl hover:from-blue-900 hover:to-[#102249] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#102249] focus:ring-offset-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-5 text-center">
            <p className="text-gray-600 text-base">
              Already have an account?{" "}
              <NavLink 
                to="/signin" 
                className="text-[#102249] hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign in
              </NavLink>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0 md:ml-12 lg:ml-16">
          <div className="relative max-w-2xl">
            <img 
              src={phonefull} 
              alt="Books" 
              className="w-full max-w-2xl rounded-2xl flex transform hover:scale-105 transition-transform duration-500" 
            />
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;