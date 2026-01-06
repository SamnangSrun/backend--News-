import React, { useState, useEffect } from "react";
import { request } from "../../utils/request";
import { config } from "../../utils/config";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { Newspaper,Edit3, Eye,ChevronRight  , Trash2 ,ArrowLeft } from "lucide-react";

const NewsCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    icon: null,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await request("admin/news/categories", "get");
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      icon: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("url", formData.url);
    data.append("description", formData.description);
    data.append("is_active", formData.is_active ? "1" : "0");

    if (formData.icon) {
      data.append("icon", formData.icon);
    }

    try {
      setLoading(true);
      if (editingCategory) {
        await request(
          `admin/news/categories/${editingCategory.id}`,
          "post",
          data
        );
        toast.success("Category updated successfully");
      } else {
        await request("admin/news/categories", "post", data);
        toast.success("Category created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      url: category.url || "",
      description: category.description || "",
      icon: null,
      is_active: category.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await request(`admin/news/categories/${id}`, "delete");
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      description: "",
      icon: null,
      is_active: true,
    });
    setEditingCategory(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="p-6  dark:bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            News Categories
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className=" flex items-center gap-2 rounded-full border border-gray-800 
                 text-gray-800 dark:text-white px-4 py-2 font-medium
                 hover:bg-[#1D3E69] hover:text-white dark:hover:bg-[#1D3E69]
                 focus:outline-none focus:ring-2 focus:ring-[#1D3E69]
                 transition-all duration-200"
          >
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {loading && !showModal ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-[#2a2a2a] rounded-lg p-6 shadow-md border border-gray-200 dark:border-[#3a3a3a]"
              >
                {/* Icon */}
                {category.icon && (
                  <img
                    src={`${config.base_url}${category.icon}`}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Category Info */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {category.published_posts_count || 0} posts
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-blue-100 text-blue-600 dark:text-blue-600  px-3 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 bg-red-100 text-red-600 dark:text-red-600  px-3 py-2 rounded-lg hover:bg-red-200  transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                 
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                 
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Category Icon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
                />
                {editingCategory?.icon && (
                  <div className="mt-2">
                    <img
                      src={`${config.base_url}${editingCategory.icon}`}
                      alt="Current icon"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded-full text-blue-600 border-gray-300  focus:ring-blue-500"
                />
                <label className="ml-2 text-gray-700 dark:text-gray-300">
                  Active (visible to users)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1  dark:bg-[#3a3a3a] border dark:border-none border-black text-black dark:text-gray-300  px-6 py-3 rounded-lg hover:bg-gray-300 hover:text-white dark:hover:bg-[#4a4a4a] transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1D3E69] text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
                
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCategoryManagement;
