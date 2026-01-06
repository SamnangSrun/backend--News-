import React, { useState, useEffect } from "react";
import { request } from "../../utils/request";
import { toast } from "react-toastify";
import { FaExclamationTriangle, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const NewsReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    reason: "",
  });

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.reason) params.append("reason", filters.reason);

      const response = await request(`admin/news/reports?${params}`, "get");
      setReports(response.data || response);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await request(`admin/news/reports/${reportId}/status`, "put", {
        status: newStatus,
      });
      toast.success(`Report marked as ${newStatus}`);
      fetchReports();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await request(`admin/news/reports/${reportId}`, "delete");
      toast.success("Report deleted successfully");
      fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      resolved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      dismissed:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getReasonBadge = (reason) => {
    const styles = {
      spam: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      misleading:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      inappropriate:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      copyright:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${styles[reason]}`}
      >
        {reason.charAt(0).toUpperCase() + reason.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            News Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage reported news posts
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 mb-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>

            {/* Reason Filter */}
            <select
              value={filters.reason}
              onChange={(e) =>
                setFilters({ ...filters, reason: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Reasons</option>
              <option value="spam">Spam</option>
              <option value="misleading">Misleading</option>
              <option value="inappropriate">Inappropriate</option>
              <option value="copyright">Copyright</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-12 text-center shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <FaExclamationTriangle className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No reports found
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md border border-gray-200 dark:border-[#3a3a3a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      News Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[#3a3a3a]">
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            to={`/news/${report.news_post?.slug}`}
                            target="_blank"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline line-clamp-2"
                          >
                            {report.news_post?.title || "Deleted Post"}
                          </Link>
                          {report.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {report.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {report.user?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {report.user?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getReasonBadge(report.reason)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Post */}
                          {report.news_post && (
                            <Link
                              to={`/news/${report.news_post.slug}`}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View post"
                            >
                              <FaEye size={16} />
                            </Link>
                          )}

                          {/* Status Dropdown */}
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusChange(report.id, e.target.value)
                            }
                            className="text-xs px-2 py-1 border border-gray-300 dark:border-[#3a3a3a] rounded bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                          </select>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete report"
                          >
                            <FaTimes size={16} />
                          </button>
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

export default NewsReportsManagement;
