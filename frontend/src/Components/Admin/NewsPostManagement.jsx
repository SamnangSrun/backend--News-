import React, { useState, useEffect } from "react";
import { request } from "../../utils/request";
import { config } from "../../utils/config";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaEye, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Newspaper,Edit3, Eye,ChevronRight  , Trash2 } from "lucide-react";

const NewsPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category_id: "",
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await request("admin/news/categories", "get");
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.category_id)
        params.append("category_id", filters.category_id);

      const response = await request(`admin/news/posts?${params}`, "get");
      setPosts(response.data || response);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await request(`admin/news/posts/${id}`, "delete");
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await request(`admin/news/posts/${id}`, "put", { status: newStatus });
      toast.success(`Post ${newStatus} successfully`);
      fetchPosts();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      draft: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      published:
        "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
      archived: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6  dark:bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage News Posts
          </h1>
          <Link
      to="/admin/news-posts/create"
      className="flex items-center gap-2 rounded-full border border-gray-800 
                 text-gray-800 dark:text-white px-4 py-2 font-medium
                 hover:bg-[#1D3E69] hover:text-white dark:hover:bg-[#1D3E69]
                 focus:outline-none focus:ring-2 focus:ring-[#1D3E69]
                 transition-all duration-200"
    >
      Add News
      <ChevronRight className="w-4 h-4" />
    </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 mb-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category_id}
              onChange={(e) =>
                setFilters({ ...filters, category_id: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-12 text-center shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No posts found
            </p>
            <Link
              to="/admin/news-posts/create"
              className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md border border-gray-200 dark:border-[#3a3a3a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3  text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[#3a3a3a]">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50  dark:hover:bg-[#1a1a1a]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.images && post.images.length > 0 && (
                            <img
                              src={
                                post.images[0]?.startsWith("http")
                                  ? post.images[0]
                                  : `${config.base_url}${post.images[0]}`
                              }
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              by {post.author?.name || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {post.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {post.views_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center  justify-end gap-2">
                          

                          {/* Edit */}
                          
                       <Link
  to={`/admin/news-posts/edit/${post.id}`}
  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-black 
   text-green-600 hover:bg-green-200 hover:text-green-800 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800 dark:hover:text-green-300 transition"
  title="Edit post"
>
  <Edit3 size={18} />
</Link>


                          

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-red-200 border-black  text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete post"
                          >
                            <Trash2 size={18} />
                          </button>`
                          
                          {/* Status Toggle */}
                          <select
                            value={post.status}
                            onChange={(e) => handleStatusChange(post.id, e.target.value)}
                            className="text-xs px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700
                                      bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100
                                      focus:ring-2 focus:ring-green-500 focus:border-green-500
                                      transition  duration-200 cursor-pointer shadow-sm hover:shadow-md"
                          >
                            <option value="draft" className="bg-white dark:bg-[#1f1f1f]">
                              Draft
                            </option>
                            <option value="published" className="bg-white dark:bg-[#1f1f1f]">
                              Published
                            </option>
                            <option value="archived" className="bg-white dark:bg-[#1f1f1f]">
                              Archived
                            </option>
                          </select>
`
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

export default NewsPostManagement;
