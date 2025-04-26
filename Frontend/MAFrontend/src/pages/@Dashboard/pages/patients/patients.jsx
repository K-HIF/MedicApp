import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../../../../utils/axiosConfig";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newPatient, setNewPatient] = useState({
    FName: "",
    MName: "",
    SName: "",
    PatID: "",
    DOB: "",
    city: "",
    category_ids: []
  });

  useEffect(() => {
    fetchPatients();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!showAddModal && !showEditModal) {
      setError("");
      setSuccess("");
    }
  }, [showAddModal, showEditModal]);

  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get('/backendapi/patient/');
      setPatients(response.data.patients);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error fetching patients");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/backendapi/categories/');
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error fetching categories");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.FName?.toLowerCase().includes(searchQuery) ||
      patient.SName?.toLowerCase().includes(searchQuery) ||
      patient.categories?.some(cat => cat.name.toLowerCase().includes(searchQuery))
  );

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category_ids') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
      setNewPatient(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      setNewPatient(prev => ({ ...prev, [name]: value }));
    }
  };

  const addPatient = async () => {
    try {
      setSubmitLoading(true);
      setError("");
      
      // Validate required fields
      if (!newPatient.FName || !newPatient.MName || !newPatient.SName || !newPatient.PatID || !newPatient.DOB || !newPatient.city) {
        setError("All fields are required");
        setSubmitLoading(false);
        return;
      }

      await axiosInstance.post('/backendapi/patient/', newPatient);
      await fetchPatients();
      
      setSuccess("Patient added successfully!");
      setTimeout(() => {
        setNewPatient({
          FName: "",
          MName: "",
          SName: "",
          PatID: "",
          DOB: "",
          city: "",
          category_ids: []
        });
        setShowAddModal(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding patient");
    } finally {
      setSubmitLoading(false);
    }
  };

  const editPatient = async () => {
    try {
      setSubmitLoading(true);
      setError("");
      
      await axiosInstance.post(
        `/backendapi/patient/${selectedPatient.PatID}/credentials/`,
        newPatient
      );
      await fetchPatients();
      
      setSuccess("Patient updated successfully!");
      setTimeout(() => {
        setShowEditModal(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating patient");
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
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Patient Management</h2>

      {/* Search and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 w-1/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Add New Patient
        </button>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Age</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Programs</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{patient.PatID}</td>
                <td className="px-6 py-4">{`${patient.FName} ${patient.MName} ${patient.SName}`}</td>
                <td className="px-6 py-4">{patient.Age}</td>
                <td className="px-6 py-4">{patient.city}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {patient.categories.map((category) => (
                      <span
                        key={category.id}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setNewPatient({
                        ...patient,
                        category_ids: patient.categories.map(c => c.id)
                      });
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit patient"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      <Dialog open={showAddModal} onClose={() => !submitLoading && setShowAddModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-md relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Add New Patient
            </Dialog.Title>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="FName"
                    value={newPatient.FName}
                    onChange={handleNewPatientChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="MName"
                    value={newPatient.MName}
                    onChange={handleNewPatientChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="SName"
                  value={newPatient.SName}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  name="PatID"
                  value={newPatient.PatID}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="DOB"
                  value={newPatient.DOB}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={newPatient.city}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Programs
                </label>
                <select
                  multiple
                  name="category_ids"
                  value={newPatient.category_ids}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent min-h-[120px]"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="py-1">
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">Hold Ctrl/Cmd to select multiple programs</p>
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
                  onClick={addPatient}
                  disabled={submitLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    "Add Patient"
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

      {/* Edit Patient Modal */}
      <Dialog open={showEditModal} onClose={() => !submitLoading && setShowEditModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-teal-800 to-emerald-900 text-white rounded-lg p-6 w-full max-w-md relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Edit Patient
            </Dialog.Title>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="FName"
                    value={newPatient.FName}
                    onChange={handleNewPatientChange}
                    className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="MName"
                    value={newPatient.MName}
                    onChange={handleNewPatientChange}
                    className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="SName"
                  value={newPatient.SName}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="DOB"
                  value={newPatient.DOB}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={newPatient.city}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Programs
                </label>
                <select
                  multiple
                  name="category_ids"
                  value={newPatient.category_ids}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent min-h-[120px]"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="py-1">
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">Hold Ctrl/Cmd to select multiple programs</p>
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
                  onClick={editPatient}
                  disabled={submitLoading}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 flex items-center space-x-2"
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

      {/* Global Error Message */}
      {error && !showAddModal && !showEditModal && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-fade-in">
          {error}
        </div>
      )}

      {/* Global Success Message */}
      {success && !showAddModal && !showEditModal && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-fade-in">
          {success}
        </div>
      )}
    </div>
  );
};

export default Patients;