import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../../../../utils/axiosConfig";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Clear success/error messages when modals are closed
    if (!showAddModal && !showEditModal && !showDeleteModal) {
      setError("");
      setSuccess("");
    }
  }, [showAddModal, showEditModal, showDeleteModal]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/backendapi/categories/');
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching health programs");
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery) ||
      category.description.toLowerCase().includes(searchQuery)
  );

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const addCategory = async () => {
    setSubmitLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await axiosInstance.post('/backendapi/categories/', newCategory);
      await fetchCategories();
      setSuccess("Category added successfully!");
      setTimeout(() => {
        setNewCategory({ name: "", description: "" });
        setShowAddModal(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding category");
    } finally {
      setSubmitLoading(false);
    }
  };

  const editCategory = async () => {
    setSubmitLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await axiosInstance.put(`/backendapi/categories/${selectedCategory.id}/`, newCategory);
      await fetchCategories();
      setSuccess("Category updated successfully!");
      setTimeout(() => {
        setShowEditModal(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating category");
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteCategory = async () => {
    setSubmitLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await axiosInstance.delete(`/backendapi/categories/${selectedCategory.id}/`);
      await fetchCategories();
      setSuccess("Category deleted successfully!");
      setTimeout(() => {
        setShowDeleteModal(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Error deleting category");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Health Programs</h2>

      {/* Search and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search programs..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 w-1/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Add New Program
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {category.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setNewCategory(category);
                    setShowEditModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Add Program Modal */}
      <Dialog open={showAddModal} onClose={() => !submitLoading && setShowAddModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-orange-800 to-red-900 text-white rounded-lg p-6 w-full max-w-md relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Add New Program
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Program Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleNewCategoryChange}
                  className="w-full px-3 py-2 bg-orange-900/50 border border-orange-500 text-white rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleNewCategoryChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-orange-900/50 border border-orange-500 text-white rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => !submitLoading && setShowAddModal(false)}
                  disabled={submitLoading}
                  className="px-4 py-2 text-gray-300 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addCategory}
                  disabled={submitLoading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    "Add Program"
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 text-red-500 text-sm text-center animate-shake">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 text-green-500 text-sm text-center animate-fade-in">
                  {success}
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Program Modal */}
      <Dialog open={showEditModal} onClose={() => !submitLoading && setShowEditModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-orange-800 to-red-900 text-white rounded-lg p-6 w-full max-w-md relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Edit Program
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Program Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleNewCategoryChange}
                  className="w-full px-3 py-2 bg-orange-900/50 border border-orange-500 text-white rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleNewCategoryChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-orange-900/50 border border-orange-500 text-white rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => !submitLoading && setShowEditModal(false)}
                  disabled={submitLoading}
                  className="px-4 py-2 text-gray-300 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editCategory}
                  disabled={submitLoading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 text-red-500 text-sm text-center animate-shake">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 text-green-500 text-sm text-center animate-fade-in">
                  {success}
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Program Modal */}
      <Dialog open={showDeleteModal} onClose={() => !submitLoading && setShowDeleteModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-orange-800 to-red-900 text-white rounded-lg p-6 w-full max-w-sm relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Delete Program
            </Dialog.Title>
            <p className="text-gray-200 mb-6">
              Are you sure you want to delete this program? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => !submitLoading && setShowDeleteModal(false)}
                disabled={submitLoading}
                className="px-4 py-2 text-gray-300 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteCategory}
                disabled={submitLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center space-x-2"
              >
                {submitLoading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 text-red-500 text-sm text-center animate-shake">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 text-green-500 text-sm text-center animate-fade-in">
                {success}
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Global Messages */}
      {error && !showAddModal && !showEditModal && !showDeleteModal && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-fade-in">
          {error}
        </div>
      )}

      {success && !showAddModal && !showEditModal && !showDeleteModal && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-fade-in">
          {success}
        </div>
      )}
    </div>
  );
};

export default Categories;