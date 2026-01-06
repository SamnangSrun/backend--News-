import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faCheckCircle,
  faChevronRight,
  faCheck,
  faBell,
  faInfoCircle,
  faExclamationCircle,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { request } from "../../utils/request";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotificationsPage() {
  const [requestStatus, setRequestStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch seller request status
      const sellerResponse = await request("my-seller-request");
      if (
        sellerResponse &&
        (sellerResponse.status === "disapproved" ||
          sellerResponse.status === "approved")
      ) {
        setRequestStatus(sellerResponse);
      }

      // Fetch general notifications
      const notificationsResponse = await request("notifications");
      if (notificationsResponse && Array.isArray(notificationsResponse)) {
        setNotifications(notificationsResponse);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(error.message || "Failed to load notifications");
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await request(`notifications/${notificationId}/read`, {
        method: "PUT",
      });

      // Update local state
      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter((n) => !n.is_read);

      await Promise.all(
        unreadNotifs.map((notif) =>
          request(`notifications/${notif.id}/read`, { method: "PUT" })
        )
      );

      // Update local state
      setNotifications(
        notifications.map((notif) => ({ ...notif, is_read: true }))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return {
          icon: faCheckCircle,
          color: "text-green-500",
          bg: "bg-green-100",
        };
      case "warning":
        return {
          icon: faExclamationCircle,
          color: "text-yellow-500",
          bg: "bg-yellow-100",
        };
      case "error":
        return { icon: faTimesCircle, color: "text-red-500", bg: "bg-red-100" };
      case "info":
      default:
        return {
          icon: faInfoCircle,
          color: "text-blue-500",
          bg: "bg-blue-100",
        };
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.is_read;
    if (filter === "read") return notif.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => fetchData()}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalNotifications = (requestStatus ? 1 : 0) + notifications.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faBell}
                className="h-5 w-5 text-indigo-500"
              />
              <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium flex items-center"
              >
                <FontAwesomeIcon icon={faCheckDouble} className="mr-1" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === "all"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              All ({totalNotifications})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === "unread"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === "read"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              Read ({notifications.filter((n) => n.is_read).length})
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Seller Request Notification */}
          {requestStatus && (filter === "all" || filter === "unread") && (
            <div
              className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                requestStatus.status === "approved"
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-start">
                {/* Status Icon */}
                <div
                  className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    requestStatus.status === "approved"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      requestStatus.status === "approved"
                        ? faCheckCircle
                        : faTimesCircle
                    }
                    className="h-5 w-5"
                  />
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {requestStatus.status === "approved"
                        ? "Seller Request Approved"
                        : "Seller Request Rejected"}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(requestStatus.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {requestStatus.status === "approved" ? (
                      <>
                        Congratulations! Your seller application has been
                        approved. You can now start selling on our platform.
                        <br />
                        <strong>Important:</strong> Please log out and log in
                        again to see your new seller role.
                      </>
                    ) : (
                      `Your seller application was rejected. Reason: ${
                        requestStatus.rejection_note || "No reason provided"
                      }`
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* General Notifications */}
          {filteredNotifications.length > 0
            ? filteredNotifications.map((notif) => {
                const iconConfig = getNotificationIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notif.is_read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      {/* Notification Icon */}
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${iconConfig.bg} dark:opacity-80`}
                      >
                        <FontAwesomeIcon
                          icon={iconConfig.icon}
                          className={`h-5 w-5 ${iconConfig.color}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {notif.title}
                            {!notif.is_read && (
                              <span className="ml-2 h-2 w-2 bg-blue-500 rounded-full"></span>
                            )}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notif.message}
                        </p>
                        {!notif.is_read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            : filter !== "all" && (
                <div className="px-6 py-12 text-center">
                  <FontAwesomeIcon
                    icon={faBell}
                    className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600"
                  />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No {filter} notifications
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You don't have any {filter} notifications at the moment.
                  </p>
                </div>
              )}

          {/* Empty State */}
          {totalNotifications === 0 && (
            <div className="px-6 py-12 text-center">
              <FontAwesomeIcon
                icon={faBell}
                className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600"
              />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You're all caught up! No new notifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
