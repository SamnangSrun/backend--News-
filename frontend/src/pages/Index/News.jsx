import React, { useState, useEffect } from "react";
import { request } from "../../utils/request";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  FaBookmark,
  FaRegBookmark,
  FaEye,
  FaCalendar,
  FaTag,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { config } from "../../utils/config";

const News = () => {
  const [newsPosts, setNewsPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savedNews, setSavedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, saved
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNewsPosts();
    fetchCategories();
    fetchSavedNews();
  }, []);

  const fetchNewsPosts = async () => {
    try {
      const response = await request("news/posts", "get");
      setNewsPosts(response.posts || response.data || response || []);
    } catch (error) {
      console.error("Error fetching news posts:", error);
      toast.error("Failed to load news posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await request("news/categories", "get");
      setCategories(response.categories || response.data || response || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSavedNews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await request("saved-news", "get");
      setSavedNews(response.saved || response || []);
    } catch (error) {
      console.error("Error fetching saved news:", error);
    }
  };

  const toggleSaveNews = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to save news");
        return;
      }

      const isSaved = savedNews.some((item) => item.news_post_id === postId);

      if (isSaved) {
        // Unsave
        await request(`saved-news/${postId}`, "delete");
        setSavedNews(savedNews.filter((item) => item.news_post_id !== postId));
        toast.success("News removed from saved");
      } else {
        // Save
        await request("saved-news", "post", { news_post_id: postId });
        fetchSavedNews(); // Refresh saved news
        toast.success("News saved successfully");
      }
    } catch (error) {
      console.error("Error toggling saved news:", error);
      toast.error("Failed to save news");
    }
  };

  const isNewsSaved = (postId) => {
    return savedNews.some((item) => item.news_post_id === postId);
  };

  // Filter news posts
  const filteredPosts = newsPosts.filter((post) => {
    // Filter by tab (all or saved)
    if (activeTab === "saved") {
      if (!isNewsSaved(post.id)) return false;
    }

    // Filter by category
    if (selectedCategory && post.category_id !== parseInt(selectedCategory)) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.category?.name?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const stripHtmlTags = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Calculate reading time based on word count
  const calculateReadingTime = (content) => {
    if (!content) return "1 min read";

    // Strip HTML tags and get plain text
    const plainText = stripHtmlTags(content);

    // Average reading speed is 200-250 words per minute
    const wordsPerMinute = 200;
    const wordCount = plainText.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return `${readingTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📰 News & Updates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with the latest news and articles
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "all"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            All News
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-6 py-3 font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === "saved"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FaBookmark className="text-sm" />
            Saved News ({savedNews.length})
            {activeTab === "saved" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory) && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Active filters:
              </span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full flex items-center gap-2">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-blue-600 dark:hover:text-blue-200"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full flex items-center gap-2">
                  Category:{" "}
                  {
                    categories.find((c) => c.id === parseInt(selectedCategory))
                      ?.name
                  }
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="hover:text-blue-600 dark:hover:text-blue-200"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {/* News Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No news found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === "saved"
                ? "You haven't saved any news yet"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                {post.images && post.images.length > 0 && (
                  <Link to={`/news/${post.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          post.images[0].startsWith("http")
                            ? post.images[0]
                            : `${config.base_url}${post.images[0]}`
                        }
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {/* Category Badge */}
                      {post.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                            {post.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <Link to={`/news/${post.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {truncateText(stripHtmlTags(post.content))}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FaCalendar />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {post.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        📖 {calculateReadingTime(post.content)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to={`/news/${post.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                    <button
                      onClick={() => toggleSaveNews(post.id)}
                      className={`p-2 rounded-full transition-colors ${
                        isNewsSaved(post.id)
                          ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          : "text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                      title={
                        isNewsSaved(post.id) ? "Remove from saved" : "Save news"
                      }
                    >
                      {isNewsSaved(post.id) ? (
                        <FaBookmark className="text-xl" />
                      ) : (
                        <FaRegBookmark className="text-xl" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
