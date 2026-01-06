import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { HelpCircle, Flag, BellRing, Send ,Settings ,Newspaper, Tag, User,  UserCheck,Home   } from "lucide-react";
// Import your images

import setting from "../../Img/Admin/setting.png";
import spp from "../../Img/Admin/spp.png";
import post from "../../Img/Admin/post.png";
import notication from "../../Img/notification.png";

// Reusable Dropdown Component
const Dropdown = ({ title, imgSrc, links }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="mb-1 dark:bg-[#212121]">
      <div
        className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg  cursor-pointer transition-colors duration-200"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={title}
      >
        <div className="flex items-center">
          <img src={imgSrc} alt={title} className="mr-3 h-5 w-5" />
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="h-3 w-3 text-gray-500"
        />
      </div>
      {isOpen && (
        <ul id={title} className="ml-8 mt-1 space-y-1">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                {link.imgSrc && (
                  <img
                    src={link.imgSrc}
                    alt={link.label}
                    className="mr-3 h-4 w-4"
                  />
                )}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main Sidebar Component
const Sidebar = () => {
  return (
    <div className="w-64 h-screen fixed left-0 top-0 dark:bg-[#121212] bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* Logo/Branding would go here */}

      {/* Navigation Items */}
      <div className="flex-grow overflow-y-auto">
        {/* Home Link */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-red-400  dark:bg-red-400 text-white font-medium"
                : "hover:bg-red-400 text-white"
            }`
          }
        >
          <Home  />
          <span className="ml-5">Dashboard</span>
        </NavLink>
    
        {/* User Management Link */}
        <NavLink
          to="/admin/news-posts"
          className={({ isActive }) =>
            `flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 font-medium"
                : "hover:bg-gray-100 hover:dark:bg-blue-950 text-gray-700"
            }`
          }
        >
         <Newspaper/>
          <span className="font-medium dark:text-white ml-5">News  </span>
        </NavLink>
        <NavLink
          to="/admin/news-categories"
          className={({ isActive }) =>
            `flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 font-medium"
                : "hover:bg-gray-100 hover:dark:bg-blue-950 text-gray-700"
            }`
          }
        >
          <Tag/>
          <span className="font-medium ml-5">Categories </span>
        </NavLink>
        {/* User Management Link */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 font-medium"
                : "hover:bg-gray-100 hover:dark:bg-blue-950 text-gray-700"
            }`
          }
        >
          <UserCheck/>
           <span className="font-medium ml-5">User </span>
        </NavLink>

        {/* Notifications Link */}
        <NavLink
          to="/admin/notifications"
          className={({ isActive }) =>
            `flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 font-medium"
                : "hover:bg-gray-100 hover:dark:bg-blue-950 text-gray-700"
            }`
          }
        >
          <BellRing/>
          <span className="font-medium ml-5"> Notifications</span>
        </NavLink>

        {/* News Reports Link */}
        <NavLink
          to="/admin/news-reports"
          className={({ isActive }) =>
            `flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 font-medium"
                : "hover:bg-gray-100 hover:dark:bg-blue-950 text-gray-700"
            }`
          }
        >
          <Flag />
          <span className="font-medium ml-5">News Reports</span>
        </NavLink>

      
      </div>

      {/* Bottom Section - Support and Settings */}
      <div className=" pt-2 border-t border-gray-200">
        <NavLink
          to="/admin/support"
          className={({ isActive }) =>
            `flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 font-medium"
                : "hover:bg-gray-100 hover:dark:bg-blue-950 text-gray-700"
            }`
          }
        >
          <HelpCircle />
          <span className="ml-5">Support</span>
        </NavLink>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 font-medium"
                : "hover:bg-gray-100 hover:dark:bg-blue-950 text-gray-700"
            }`
          }
        >
          <Settings />
          <span className="ml-5">Settings</span>
        </NavLink>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
        >
          <img src={setting} alt="Settings" className="mr-3 h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
