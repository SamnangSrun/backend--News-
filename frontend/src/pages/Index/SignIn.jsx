import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate, NavLink } from 'react-router-dom';
import { MdArrowBack, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { profileStore } from '../../store/Pfile_store';
import { request } from '../../utils/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Phone from '@/Img/login/container.jpg'; 


const SignIn = () => {
  const { funSetAccessToken, funSetUser, funSetPermission } = profileStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    setErrorMessage('');

    const params = {
      email: values.username,
      password: values.password,
    };

    try {
      const res = await request("sign-in", "post", params);

      if (res && !res.error) {
        funSetAccessToken(res.access_token);
        funSetUser(res.user);
        funSetPermission(res.permission);

        toast.success("Login successful!");

        const roleRaw = res.user?.role;
        const role = typeof roleRaw === 'string'
          ? roleRaw.toLowerCase()
          : roleRaw?.name?.toLowerCase();

        setTimeout(() => {
          navigate("/admin/news-posts");
        }, 1500);
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
        toast.error("Login failed: Invalid credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An error occurred. Please try again later.");
      toast.error("An error occurred while logging in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    toast.success("Google login successful!");
    
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  const handleError = () => {
    console.error("Google login failed");
    setErrorMessage("Google login failed. Try again.");
    toast.error("Google login failed.");
  };

  return (

    
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
        
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
        <div className="w-full md:w-1/2 max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl  p-8 md:p-10 lg:p-12 mx-auto md:mx-0">
          {/* Back Button */}
          <div className="mb-6">
            
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#102249] mb-3">
              Sign in
            </h2>
            <p className="text-gray-600 text-base lg:text-lg">
              Please login to continue to your account.
            </p>
          </div>

        

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500 font-medium">or continue with email</span>
            <div className="flex-grow border-t border-gray-300"></div>
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
            onFinish({ username: email, password });
          }}>
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#102249] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#102249] focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-8">
              <NavLink 
                to="/forgot-password" 
                className="text-sm text-[#102249] hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Forgot your password?
              </NavLink>
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
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-base">
              Don't have an account?{" "}
              <NavLink 
                to="/signup" 
                className="text-[#102249] hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
              >
                Create account
              </NavLink>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0 md:ml-12 lg:ml-16">
          <div className="relative max-w-2xl">
            <img 
              src={Phone} 
              alt="Books" 
              className="w-full max-w-2xl rounded-2xl flex transform hover:scale-105 transition-transform duration-500" 
            />
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24  rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;