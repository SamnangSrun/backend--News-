import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../../utils/request";
import { config } from "../../utils/config";
import { toast } from "react-toastify";
import { Newspaper,Edit3, Eye,ArrowLeft,ArrowUp,ArrowDown ,Save, CheckCircle, Trash2 ,Plus, FileText, Image } from "lucide-react";
import {
  FaPlus,
  FaTimes,
  FaImage,
  FaAlignLeft,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaSave,
  FaEye,
} from "react-icons/fa";

const CreateEditNewsPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    excerpt: "",
    status: "draft",
  });

  const [contentBlocks, setContentBlocks] = useState([
    { id: Date.now(), type: "text", content: "" },
  ]);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await request("admin/news/categories", "get");
      setCategories(response.filter((cat) => cat.is_active));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await request(`admin/news/posts/${id}`, "get");

      setFormData({
        title: response.title,
        category_id: response.category_id,
        excerpt: response.excerpt || "",
        status: response.status,
      });

      // Parse content blocks from existing post
      if (response.content || response.images) {
        const blocks = [];

        // If there's content, add it as text block
        if (response.content) {
          blocks.push({
            id: Date.now(),
            type: "text",
            content: response.content,
          });
        }

        // Add image blocks for each image
        if (response.images && response.images.length > 0) {
          response.images.forEach((imageUrl, index) => {
            blocks.push({
              id: Date.now() + index + 1,
              type: "image",
              imageUrl: imageUrl,
              file: null,
            });
          });
        }

        if (blocks.length > 0) {
          setContentBlocks(blocks);
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTextBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      {
        id: Date.now(),
        type: "text",
        content: "",
      },
    ]);
  };

  const addImageBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      {
        id: Date.now(),
        type: "image",
        file: null,
        preview: null,
      },
    ]);
  };

  const updateTextBlock = (id, content) => {
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const updateImageBlock = (id, file) => {
    const preview = URL.createObjectURL(file);
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === id ? { ...block, file, preview } : block
      )
    );
  };

  const deleteBlock = (id) => {
    if (contentBlocks.length === 1) {
      toast.warning("You must have at least one content block");
      return;
    }
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
  };

  const moveBlockUp = (index) => {
    if (index === 0) return;
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[index - 1]] = [
      newBlocks[index - 1],
      newBlocks[index],
    ];
    setContentBlocks(newBlocks);
  };

  const moveBlockDown = (index) => {
    if (index === contentBlocks.length - 1) return;
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[index + 1]] = [
      newBlocks[index + 1],
      newBlocks[index],
    ];
    setContentBlocks(newBlocks);
  };

  const handleSubmit = async (e, saveStatus = formData.status) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category_id", formData.category_id);
    data.append("excerpt", formData.excerpt);
    data.append("status", saveStatus);

    // Combine all text blocks into content
    const textContent = contentBlocks
      .filter((block) => block.type === "text" && block.content.trim())
      .map((block) => block.content)
      .join("\n\n");

    if (textContent) {
      data.append("content", textContent);
    }

    // Add all image files
    contentBlocks
      .filter((block) => block.type === "image" && block.file)
      .forEach((block, index) => {
        data.append(`images[${index}]`, block.file);
      });

    try {
      setLoading(true);

      if (isEditMode) {
        await request(`admin/news/posts/${id}`, "post", data);
        toast.success("Post updated successfully");
      } else {
        await request("admin/news/posts", "post", data);
        toast.success("Post created successfully");
      }

      navigate("/admin/news-posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(error.response?.data?.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const renderBlock = (block, index) => {
    if (block.type === "text") {
      return (
        <div className="bg-white dark:bg-[#121212] p-4 rounded-lg border-2 border-gray-200 dark:border-[#3a3a3a]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Newspaper />
              <span className="text-sm font-medium">Text Content</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveBlockUp(index)}
                disabled={index === 0}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
              >
                <ArrowUp />
              </button>
              <button
                type="button"
                onClick={() => moveBlockDown(index)}
                disabled={index === contentBlocks.length - 1}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
              >
                <ArrowDown />
              </button>
              <button
                type="button"
                onClick={() => deleteBlock(block.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 />
              </button>
            </div>
          </div>
          <textarea
            value={block.content}
            onChange={(e) => updateTextBlock(block.id, e.target.value)}
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your content here..."
          />
        </div>
      );
    }

    if (block.type === "image") {
      return (
        <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg border-2 border-gray-200 dark:border-[#3a3a3a]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Image />
              <span className="text-sm font-medium">Image</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveBlockUp(index)}
                disabled={index === 0}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
              >
                <ArrowUp />
              </button>
              <button
                type="button"
                onClick={() => moveBlockDown(index)}
                disabled={index === contentBlocks.length - 1}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
              >
                <ArrowDown />
              </button>
              <button
                type="button"
                onClick={() => deleteBlock(block.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 />
              </button>
            </div>
          </div>

          {block.preview || block.imageUrl ? (
            <div className="relative">
              <img
                src={
                  block.preview ||
                  (block.imageUrl?.startsWith("http")
                    ? block.imageUrl
                    : `${config.base_url}${block.imageUrl}`)
                }
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    if (e.target.files[0]) {
                      updateImageBlock(block.id, e.target.files[0]);
                    }
                  };
                  input.click();
                }}
                className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
              >
                Change Image
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-[#3a3a3a] rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <Image size={48} className="text-gray-400 mb-2" />
              <span className="text-gray-600 dark:text-gray-400">
                Click to upload image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    updateImageBlock(block.id, e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          )}
        </div>
      );
    }

    return null;
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#1a1a1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Preview Mode
            </h2>
            <button
              onClick={() => setPreviewMode(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Exit Preview
            </button>
          </div>

          <article className="bg-white dark:bg-[#2a2a2a] rounded-lg p-8 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {formData.title || "Untitled Post"}
            </h1>

            {formData.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 italic">
                {formData.excerpt}
              </p>
            )}

            <div className="space-y-6">
              {contentBlocks.map((block) => {
                if (block.type === "text" && block.content) {
                  return (
                    <div
                      key={block.id}
                      className="prose dark:prose-invert max-w-none"
                    >
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {block.content}
                      </p>
                    </div>
                  );
                }
                if (
                  block.type === "image" &&
                  (block.preview || block.imageUrl)
                ) {
                  return (
                    <img
                      key={block.id}
                      src={
                        block.preview ||
                        (block.imageUrl?.startsWith("http")
                          ? block.imageUrl
                          : `${config.base_url}${block.imageUrl}`)
                      }
                      alt="Content"
                      className="w-full rounded-lg"
                    />
                  );
                }
                return null;
              })}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6  dark:bg-[#121212] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit News Post" : "Create News Post"}
          </h1>
             <button
      onClick={() => navigate("/admin/news-posts")}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Post Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Excerpt (Optional)
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of the post"
                />
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Content Blocks
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addTextBlock}
                  className="flex items-center gap-2 border border-black   text-black px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-white text-sm"
                >
                  <FileText /> Add Text
                </button>
                <button
                  type="button"
                  onClick={addImageBlock}
                  className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded-lg hover:bg-green-500 hover:text-white text-sm"
                >
                  <Image /> Add Image
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {contentBlocks.map((block, index) => (
                <div key={block.id}>{renderBlock(block, index)}</div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="flex items-center gap-2 border-black border hover:text-white text-black px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
            >
              <Eye /> Preview
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={loading}
              className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              <Save /> Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition-colors disabled:opacity-50"
            >
              <CheckCircle />{" "}
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Post"
                : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditNewsPost;
