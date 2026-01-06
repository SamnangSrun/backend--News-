import React, { useState, useEffect } from "react";
import { request } from "../../utils/request";
import { toast } from "react-toastify";
import { User, Trash2, Users, UserCheck, UserX } from "lucide-react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaBan,
  FaUserShield,
  FaUser,
} from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, [filters]);

  const fetchStatistics = async () => {
    try {
      const response = await request("admin/users/statistics", "get");
      setStats(response);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.role) params.append("role", filters.role);

      const response = await request(`admin/users?${params}`, "get");
      console.log("Users response:", response); // Debug
      const usersData = response.data || response.users || response;
      console.log("Users data:", usersData); // Debug
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      await request(`admin/users/${userId}/role`, "put", { role: newRole });
      toast.success("User role updated successfully");
      fetchUsers();
      fetchStatistics();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await request(`admin/users/${userId}`, "delete");
      toast.success("User deleted successfully");
      fetchUsers();
      fetchStatistics();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and roles
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-200 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {stats.total_users}
                  </p>
                </div>
                <FaUser
                  size={32}
                  className="text-blue-600 dark:text-blue-300 opacity-50"
                />
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-200 text-sm font-medium">
                    Admin Users
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {stats.admin_count}
                  </p>
                </div>
                <FaUserShield
                  size={32}
                  className="text-green-600 dark:text-green-300 opacity-50"
                />
              </div>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-200 text-sm font-medium">
                    Regular Users
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {stats.user_count}
                  </p>
                </div>
                <FaUser
                  size={32}
                  className="text-purple-600 dark:text-purple-300 opacity-50"
                />
              </div>
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 dark:text-yellow-200 text-sm font-medium">
                    New (7 days)
                  </p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {stats.recent_users}
                  </p>
                </div>
                <FaUser
                  size={32}
                  className="text-yellow-600 dark:text-yellow-300 opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 mb-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-12 text-center shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No users found
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md border border-gray-200 dark:border-[#3a3a3a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3   text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[#3a3a3a]">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profile_image_url ? (
                            <img
                              src={user.profile_image_url}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                              onError={(e) => {
                                console.error(
                                  "Image load error for user:",
                                  user.name,
                                  user.profile_image_url
                                );
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.style.display = "none";
                                e.target.parentElement
                                  .querySelector(".fallback-avatar")
                                  ?.style.setProperty(
                                    "display",
                                    "flex",
                                    "important"
                                  );
                              }}
                              onLoad={() => {
                                console.log(
                                  "Image loaded successfully:",
                                  user.profile_image_url
                                );
                              }}
                            />
                          ) : null}
                          <div
                            className={`fallback-avatar w-10 h-10 rounded-full flex items-center justify-center ${
                              user.profile_image_url
                                ? "hidden bg-gradient-to-br from-blue-500 to-purple-600"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          >
                            {user.profile_image_url ? (
                              <span className="text-white font-bold text-lg">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            ) : (
                              <FaUser className="text-gray-600 dark:text-gray-300" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>

                          {/* Change Role */}
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="text-xs px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700
                                      bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100
                                      focus:ring-2 focus:ring-green-500 focus:border-green-500
                                      transition  duration-200 cursor-pointer shadow-sm hover:shadow-md"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
