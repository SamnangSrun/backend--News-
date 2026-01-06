import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faTimes,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSpinner, FaHistory } from "react-icons/fa";

import Logo from "../../Img/Admin/logo.png";

import CartIcon from "../../Img/Index/Navbar/card.png";
import signout from "../../Img/sign-out.png";
import seller from "../../Img/seller.png";
import edit from "../../Img/edit.png";
import dasbord from "../../Img/dasbord.png";

import NotificationBell from "./NotificationBell";
import { profileStore } from "../../store/Pfile_store";
import { useDarkMode } from "../../../context/DarkModeContext";
import { config } from "../../utils/config";
import { request } from "../../utils/request";

export function NavbarComponents() {
  const navigate = useNavigate();
  const { access_token, user, funLogout } = profileStore();


  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const isLoggedIn = !!access_token;
  const defaultProfilePic =
    "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
  const [profilePic, setProfilePic] = useState(defaultProfilePic);

 

  // Small ThemeToggle component
  function ThemeToggle() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    return (
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "Dark" : "Light"}
      </button>
    );
  }

  

  useEffect(() => {
    if (user?.profile_image_url) {
      setProfilePic(user.profile_image_url);
    } else {
      setProfilePic(defaultProfilePic);
    }
  }, [user?.profile_image_url]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn]);

  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await request("cart", "get");

      let items = [];
      if (Array.isArray(response)) {
        items = response;
      } else if (response?.data && Array.isArray(response.data)) {
        items = response.data;
      } else if (response?.items) {
        items = response.items;
      } else {
        throw new Error("Invalid cart data format");
      }

      setCartItems(items);
      setCartItemsCount(
        items.reduce((total, item) => total + (item.quantity || 0), 0)
      );
    } catch (error) {
      console.error("Error fetching cart items:", error);
      console.error("Failed to load cart items");
    } finally {
      setCartLoading(false);
    }
  };

  const handleLogout = () => {
    funLogout();
    toast.success("You have successfully logged out!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate("/");
  };

  const handleCategoryClick = (title) => {
    setSelectedCategory(title);
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
    setCartDropdownOpen(false);
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setDropdownOpen(false);
    setCartDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setDropdownOpen(false);
      setProfileDropdownOpen(false);
      setCartDropdownOpen(false);
    }
  };

  const toggleMobileCategories = () => {
    setMobileCategoriesOpen(!mobileCategoriesOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
        setProfileDropdownOpen(false);
        setCartDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <header className="bg-white dark:bg-[#121212] shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl  sm:px-6 ">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <NavLink to="/" className="block text-teal-600">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-32 hover:opacity-90 transition-opacity"
                />
              </NavLink>
            </div>

            <div className="flex items-center gap-6">
              {/* Theme toggle */}
              <div className="flex items-center">
                <ThemeToggle />
              </div>
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-700 hover:text-[#102249]"
                aria-label="Toggle menu"
              >
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
              </button>

              {/* Notification Bell Component */}
              {isLoggedIn && <NotificationBell />}

              {isLoggedIn ? (
                <div className="relative dropdown-container">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center text-gray-700 hover:text-[#102249] transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-gray-200 hover:border-[#102249] transition-colors"
                        onError={(e) => {
                          e.target.src = defaultProfilePic;
                        }}
                      />
                    </div>
                    <span className="hidden md:inline">{user?.name}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center p-4 border-b border-gray-100">
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.src = defaultProfilePic;
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {user?.email}
                          </p>
                          <p className="text-xs text-gray-500 capitalize mt-1">
                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full">
                              {user?.role}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="p-2">
                        <NavLink
                          to="/edit-profile"
                          className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <img src={edit} alt="Edit" className="mr-3 w-4 h-4" />
                          Edit Profile
                        </NavLink>

                       

                        {user?.role?.toLowerCase() === "admin" && (
                          <NavLink
                            to="/admin"
                            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <img
                              src={dasbord}
                              alt="Admin"
                              className="mr-3 w-4 h-4"
                            />
                            Admin Dashboard
                          </NavLink>
                        )}

                       
                      </div>

                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <img
                            src={signout}
                            alt="Logout"
                            className="mr-3 w-4 h-4"
                          />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <NavLink
                    to="/signin"
                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[#102249] hover:bg-[#0a1a3a] transition-colors shadow-sm"
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-40 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 space-y-2">
                {menuList.map((menu, index) => (
                  <NavLink
                    key={index}
                    to={menu.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800 text-[#102249]"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {menu.title}
                  </NavLink>
                ))}

                <div>
                  <button
                    onClick={toggleMobileCategories}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Categories
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`ml-2 h-3 w-3 transition-transform ${
                        mobileCategoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                      {categoriesList.map((category, index) => (
                        <NavLink
                          key={index}
                          to={category.path}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => handleCategoryClick(category.title)}
                        >
                          {category.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                {!isLoggedIn && (
                  <div className="pt-2 space-y-2 border-t border-gray-200">
                    <NavLink
                      to="/signin"
                      className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-white bg-[#102249] hover:bg-[#0a1a3a] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default NavbarComponents;
