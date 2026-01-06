import React, { useState, useEffect } from "react";
import { request } from "../../utils/request";
import { toast } from "react-toastify";
import { FaBell, FaTimes, FaPaperPlane } from "react-icons/fa";
import { Bell, BellOff, BellRing, Send, ArrowLeft } from "lucide-react";

const NotificationManagement = () => {
  const [users, setUsers] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    send_to_all: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    fetchUsers();
    fetchSentNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await request("admin/users", "get");
      // Ensure users is always an array
      const usersData = response.users || response.data || response;
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Set to empty array on error
      toast.error("Failed to load users");
    }
  };

  const fetchSentNotifications = async () => {
    try {
      const response = await request("admin/notifications/sent", "get");
      const notificationsData =
        response.notifications || response.data || response;
      setSentNotifications(
        Array.isArray(notificationsData) ? notificationsData : []
      );
    } catch (error) {
      console.error("Error fetching sent notifications:", error);
      setSentNotifications([]);
      // Don't show error toast here as it might not be critical
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.send_to_all && !formData.user_id) {
      toast.error("Please select a user or choose to send to all users");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    try {
      setLoading(true);
      const response = await request("admin/notifications", "post", formData);
      toast.success(response.message || "Notification sent successfully");
      setShowModal(false);
      resetForm();
      fetchSentNotifications(); // Refresh the sent notifications list
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(
        error.response?.data?.message || "Failed to send notification"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: "",
      send_to_all: false,
      message: "",
      type: "info",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="p-6  dark:bg-[#121212] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Send Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Send notifications to users
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2  text-black border border-black  px-6 py-3 rounded-lg hover:bg-[#1D3E69] hover:text-white transition-colors"
          >
            <BellRing /> New Notification
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <div className="flex gap-3">
            <BellRing className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-blue-900 dark:text-blue-200 font-semibold mb-2">
                How to use notifications
              </h3>
              <ul className="text-blue-800 dark:text-blue-300 text-sm space-y-1">
                <li>
                  • Send notifications to individual users or all users at once
                </li>
                <li>
                  • Users will see notifications in their notification dropdown
                </li>
                <li>
                  • Choose notification type (info, success, warning, error) for
                  proper styling
                </li>
                <li>• Keep messages clear and concise</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Admin Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Regular Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {users.filter((u) => u.role === "user").length}
              </p>
            </div>
          </div>
        </div>

        {/* Sent Notifications History */}
        <div className="mt-8 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md border border-gray-200 dark:border-[#3a3a3a] p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Send className="text-blue-600" />
            Sent Notifications History
          </h2>

          {sentNotifications.length === 0 ? (
            <div className="text-center py-12">
              <BellOff className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500 dark:text-gray-400">
                No notifications sent yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Your sent notifications will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-200 dark:border-[#3a3a3a] rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            notification.type === "info"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : notification.type === "success"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : notification.type === "warning"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {notification.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <BellRing size={14} />
                          {notification.sent_to_all ? (
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              Sent to All Users
                            </span>
                          ) : (
                            <span>
                              Sent to: {notification.user?.name || "User"} (
                              {notification.user?.email || "N/A"})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Send Notification
              </h2>
              <button
                onClick={closeModal}
                className="flex items-center gap-2 rounded-full border border-gray-800 
                               text-gray-800 dark:text-white px-4 py-2 font-medium
                               hover:bg-[#1D3E69] hover:text-white dark:hover:bg-[#1D3E69]
                               focus:outline-none focus:ring-2 focus:ring-[#1D3E69]
                               transition-all duration-200"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Send to All Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="send_to_all"
                  checked={formData.send_to_all}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                  Send to all users
                </label>
              </div>

              {/* User Selection */}
              {!formData.send_to_all && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Select User *
                  </label>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    required={!formData.send_to_all}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a user...</option>
                    {Array.isArray(users) &&
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.role}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Notification Type */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Notification Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info (Blue)</option>
                  <option value="success">Success (Green)</option>
                  <option value="warning">Warning (Yellow)</option>
                  <option value="error">Error (Red)</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your notification message..."
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.message.length} characters
                </p>
              </div>

              {/* Preview */}
              {formData.message && (
                <div className="border border-gray-300 dark:border-[#3a3a3a] rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Preview:
                  </p>
                  <div
                    className={`p-3 rounded-lg ${
                      formData.type === "info"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200"
                        : formData.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200"
                        : formData.type === "warning"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-200"
                        : "bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200"
                    }`}
                  >
                    {formData.message}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-black  dark:bg-[#3a3a3a] text-black dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 hover:text-white dark:hover:bg-[#4a4a4a] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1D3E69] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Send />
                  {loading ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
