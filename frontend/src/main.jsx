import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DarkModeProvider } from "../context/DarkModeContext";
import SignIn from "./pages/Index/SignIn.jsx";
import SignUp from "./pages/Index/SignUp.jsx";
import NotFound from "./pages/Index/NotFound.jsx";
import EditProfileForm from "./pages/Index/Edit.jsx";

//index
import MainLayout from "./Layout/MainLayout.jsx";
import Notifications from ".//Components/Index/Notifications.jsx";
import News from ".//pages/Index/News.jsx";
import NewsDetail from ".//pages/Index/NewsDetail.jsx";
import AdminLayout from "./Layout/AdminLayout.jsx";

// News components
import NewsCategoryManagement from "./Components/Admin/NewsCategoryManagement.jsx";
import NewsPostManagement from "./Components/Admin/NewsPostManagement.jsx";
import CreateEditNewsPost from "./Components/Admin/CreateEditNewsPost.jsx";
import UserManagement from "./Components/Admin/UserManagement.jsx";
import NotificationManagement from "./Components/Admin/NotificationManagement.jsx";
import NewsReportsManagement from "./Components/Admin/NewsReportsManagement.jsx";

// Define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { path: "/edit-profile", element: <EditProfileForm /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/news", element: <News /> },
      { path: "/news/:id", element: <NewsDetail /> },
      { path: "*", element: <NotFound /> }, 
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />, 
    children: [
    
      // News routes
      { path: "/admin/news-categories", element: <NewsCategoryManagement /> },
      { path: "/admin/news-posts", element: <NewsPostManagement /> },
      { path: "/admin/news-posts/create", element: <CreateEditNewsPost /> },
      { path: "/admin/news-posts/edit/:id", element: <CreateEditNewsPost /> },

      // User and notification management
      { path: "/admin/users", element: <UserManagement /> },
      { path: "/admin/notifications", element: <NotificationManagement /> },
      { path: "/admin/news-reports", element: <NewsReportsManagement /> },
      
    ],
  },

  { path: "/signin", element: <SignIn /> }, 
  { path: "/signup", element: <SignUp /> }, 
]);


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </React.StrictMode>
);
