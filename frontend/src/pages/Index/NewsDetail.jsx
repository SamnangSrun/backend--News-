import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { request } from "../../utils/request";
import { toast } from "react-toastify";
import {
  FaBookmark,
  FaRegBookmark,
  FaEye,
  FaCalendar,
  FaUser,
  FaArrowLeft,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaCopy,
} from "react-icons/fa";
import { config } from "../../utils/config";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsPost, setNewsPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchNewsDetail();
    checkIfSaved();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      const response = await request(`news/posts/${id}`, "get");
      setNewsPost(response.post || response.data || response);

      // Fetch related posts from the same category
      if (
        response.post?.category_id ||
        response.category_id ||
        response.data?.category_id
      ) {
        const catId =
          response.post?.category_id ||
          response.category_id ||
          response.data?.category_id;
        fetchRelatedPosts(catId);
      }
    } catch (error) {
      console.error("Error fetching news detail:", error);
      toast.error("Failed to load news");
      navigate("/news");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (categoryId) => {
    try {
      const response = await request(
        `news/posts?category_id=${categoryId}`,
        "get"
      );
      const posts = response.posts || response.data || response || [];
      // Exclude current post and limit to 3
      setRelatedPosts(
        posts.filter((post) => post.id !== parseInt(id)).slice(0, 3)
      );
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  const checkIfSaved = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await request("saved-news", "get");
      const saved = response.saved || response || [];
      setIsSaved(saved.some((item) => item.news_post_id === parseInt(id)));
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const toggleSaveNews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to save news");
        return;
      }

      if (isSaved) {
        await request(`saved-news/${id}`, "delete");
        setIsSaved(false);
        toast.success("News removed from saved");
      } else {
        await request("saved-news", "post", { news_post_id: id });
        setIsSaved(true);
        toast.success("News saved successfully");
      }
    } catch (error) {
      console.error("Error toggling saved news:", error);
      toast.error("Failed to save news");
    }
  };

  // Calculate reading time based on word count
  const calculateReadingTime = (content) => {
    if (!content) return "1 min read";

    // Strip HTML tags and get plain text
    const stripHtmlTags = (html) => {
      if (!html) return "";
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const plainText = stripHtmlTags(content);

    // Average reading speed is 200-250 words per minute
    const wordsPerMinute = 200;
    const wordCount = plainText.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return `${readingTime} min read`;
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = newsPost?.title || "News Article";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        } catch (error) {
          toast.error("Failed to copy link");
        }
        break;
    }

    // Track share
    try {
      await request(`news/posts/${id}/share`, "post");
    } catch (error) {
      console.error("Error tracking share:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!newsPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            News not found
          </h2>
          <Link
            to="/news"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <FaArrowLeft />
          Back to News
        </Link>

        {/* Article Header */}
        <article className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          {/* Category Badge */}
          {newsPost.category && (
            <div className="px-6 pt-6">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                {newsPost.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="px-6 pt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {newsPost.title}
            </h1>
          </div>

          {/* Meta Info */}
          <div className="px-6 pb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaUser />
              <span>By {newsPost.user?.name || "Admin"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar />
              <span>
                {new Date(newsPost.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye />
              <span>{newsPost.views || 0} views</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📖</span>
              <span>{calculateReadingTime(newsPost.content)}</span>
            </div>
          </div>

          {/* Featured Image */}
          {newsPost.images && newsPost.images.length > 0 && (
            <div className="w-full">
              <img
                src={
                  newsPost.images[0].startsWith("http")
                    ? newsPost.images[0]
                    : `${config.base_url}${newsPost.images[0]}`
                }
                alt={newsPost.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Actions Bar */}
          <div className="px-6 py-4 border-t border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Share:
              </span>
              <button
                onClick={() => handleShare("facebook")}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                title="Share on Facebook"
              >
                <FaFacebook className="text-xl" />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-full transition-colors"
                title="Share on Twitter"
              >
                <FaTwitter className="text-xl" />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="p-2 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                title="Share on LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Copy Link"
              >
                <FaCopy className="text-xl" />
              </button>
            </div>

            <button
              onClick={toggleSaveNews}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSaved
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: newsPost.content }}
            />
          </div>

          {/* Additional Images */}
          {newsPost.images && newsPost.images.length > 1 && (
            <div className="px-6 pb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {newsPost.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={
                      image.startsWith("http")
                        ? image
                        : `${config.base_url}${image}`
                    }
                    alt={`${newsPost.title} - Image ${index + 2}`}
                    className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/news/${post.id}`}
                  className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {post.images && post.images.length > 0 && (
                    <img
                      src={
                        post.images[0].startsWith("http")
                          ? post.images[0]
                          : `${config.base_url}${post.images[0]}`
                      }
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-2">
                      <FaCalendar />
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
