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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/backendapi/categories/');
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching categories");
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
    try {
      await axiosInstance.post('/backendapi/categories/', newCategory);
      fetchCategories();
      setNewCategory({ name: "", description: "" });
      setShowAddModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding category");
    }
  };

  const editCategory = async () => {
    try {
      await axiosInstance.put(`/backendapi/categories/${selectedCategory.id}/`, newCategory);
      fetchCategories();
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating category");
    }
  };

  const deleteCategory = async () => {
    try {
      await axiosInstance.delete(`/backendapi/categories/${selectedCategory.id}/`);
      fetchCategories();
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error deleting category");
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
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Disease Categories</h2>

      {/* Search and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 w-1/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Add New Category
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

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-orange-800 to-red-900 text-white rounded-lg p-6 w-full max-w-md relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Add New Category
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Category Name
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
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addCategory}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Add Category
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-orange-800 to-red-900 text-white rounded-lg p-6 w-full max-w-md relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Edit Category
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Category Name
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
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={editCategory}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-orange-800 to-red-900 text-white rounded-lg p-6 w-full max-w-sm relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Delete Category
            </Dialog.Title>
            <p className="text-gray-200 mb-6">
              Are you sure you want to delete this category? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={deleteCategory}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Categories;