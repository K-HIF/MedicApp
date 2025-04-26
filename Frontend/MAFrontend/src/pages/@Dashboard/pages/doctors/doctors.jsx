import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { EnvelopeIcon, PencilIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../../../../utils/axiosConfig";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    employee_id: "",
    email: "",
    specialization: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [verifyingDoctors, setVerifyingDoctors] = useState(new Set());

  useEffect(() => {
    fetchDoctors();
    fetchAdminDetails();
    fetchCategories();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const response = await axiosInstance.get('/backendapi/admin-details/');
      setAdminDetails(response.data);
    } catch (err) {
      console.error("Error fetching admin details:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get('/backendapi/doctors/');
      setDoctors(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error fetching doctors");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/backendapi/categories/');
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.firstName?.toLowerCase().includes(searchQuery) ||
      doctor.lastName?.toLowerCase().includes(searchQuery) ||
      doctor.employee_id?.toLowerCase().includes(searchQuery)
  );

  const handleNewDoctorChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleEditDoctorChange = (e) => {
    const { name, value } = e.target;
    setEditingDoctor({ ...editingDoctor, [name]: value });
  };

  const startEdit = (doctor) => {
    setEditingDoctor({
      ...doctor,
      firstName: doctor.user.first_name,
      lastName: doctor.user.last_name,
      email: doctor.user.email,
    });
    setShowEditModal(true);
  };

  const handleUpdateDoctor = async () => {
    setSubmitLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await axiosInstance.put('/backendapi/doctors/', {
        employee_id: editingDoctor.employee_id,
        firstName: editingDoctor.firstName,
        lastName: editingDoctor.lastName,
        email: editingDoctor.email,
        specialization: editingDoctor.specialization,
        is_active: editingDoctor.is_active
      });
      
      await fetchDoctors();
      setSuccess("Doctor updated successfully!");
      setTimeout(() => {
        setShowEditModal(false);
        setEditingDoctor(null);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating doctor");
    } finally {
      setSubmitLoading(false);
    }
  };

  const addDoctor = async () => {
    setSubmitLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await axiosInstance.post('/backendapi/register-doc/', newDoctor);
      await fetchDoctors();
      setSuccess("Doctor registered successfully! Waiting for verification.");
      setTimeout(() => {
        setNewDoctor({
          firstName: "",
          lastName: "",
          employee_id: "",
          email: "",
          specialization: "",
        });
        setShowAddModal(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding doctor");
    } finally {
      setSubmitLoading(false);
    }
  };

  const sendPasswordReset = async (employeeId, email) => {
    setSubmitLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await axiosInstance.post('/backendapi/send-email/', {
        employee_id: employeeId,
        email: email
      });
      setSuccess("Password reset email sent successfully!");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Error sending password reset email");
    } finally {
      setSubmitLoading(false);
    }
  };

  const verifyDoctor = async (doctorId) => {
    setVerifyingDoctors(prev => new Set([...prev, doctorId]));
    setError("");
    setSuccess("");
    
    try {
      await axiosInstance.post(`/backendapi/doctors/${doctorId}/verify/`);
      await fetchDoctors();
      setSuccess("Doctor verified successfully! Credentials have been sent.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Error verifying doctor");
    } finally {
      setVerifyingDoctors(prev => {
        const next = new Set(prev);
        next.delete(doctorId);
        return next;
      });
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
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Doctor Management</h2>


      {/* Search and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 w-1/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Add New Doctor
        </button>
      </div>

      {/* Doctors Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Employee ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Specialization</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{doctor.employee_id}</td>
                <td className="px-6 py-4">{`${doctor.user.first_name} ${doctor.user.last_name}`}</td>
                <td className="px-6 py-4">{doctor.user.email}</td>
                <td className="px-6 py-4">{doctor.specialization || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    doctor.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doctor.is_active ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => startEdit(doctor)}
                      className="text-gray-600 hover:text-gray-800"
                      title="Edit doctor"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    {!doctor.is_active ? (
                      <button
                        onClick={() => verifyDoctor(doctor.employee_id)}
                        disabled={verifyingDoctors.has(doctor.employee_id)}
                        className={`text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center space-x-1`}
                        title="Verify doctor"
                      >
                        {verifyingDoctors.has(doctor.employee_id) ? (
                          <>
                            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Verifying...</span>
                          </>
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => sendPasswordReset(doctor.employee_id, doctor.user.email)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Send password reset email"
                      >
                        <EnvelopeIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Doctor Modal */}
      <Dialog open={showAddModal} onClose={() => !submitLoading && setShowAddModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white rounded-lg p-6 w-full max-w-md relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Add New Doctor
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newDoctor.firstName}
                  onChange={handleNewDoctorChange}
                  className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newDoctor.lastName}
                  onChange={handleNewDoctorChange}
                  className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employee_id"
                  value={newDoctor.employee_id}
                  onChange={handleNewDoctorChange}
                  className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newDoctor.email}
                  onChange={handleNewDoctorChange}
                  className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={newDoctor.specialization || ''}
                  onChange={handleNewDoctorChange}
                  className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">Select Program</option>
                  {categories.map(program => (
                    <option key={program.id} value={program.name}>
                      {program.name}
                    </option>
                  ))}
                </select>
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
                  onClick={addDoctor}
                  disabled={submitLoading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    "Add Doctor"
                  )}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Doctor Modal */}
      <Dialog open={showEditModal} onClose={() => !submitLoading && setShowEditModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white rounded-lg p-6 w-full max-w-md relative z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Edit Doctor
            </Dialog.Title>
            {editingDoctor && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editingDoctor.firstName}
                    onChange={handleEditDoctorChange}
                    className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editingDoctor.lastName}
                    onChange={handleEditDoctorChange}
                    className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editingDoctor.email}
                    onChange={handleEditDoctorChange}
                    className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    value={editingDoctor.specialization || ''}
                    onChange={handleEditDoctorChange}
                    className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  >
                    <option value="">Select Program</option>
                    {categories.map(program => (
                      <option key={program.id} value={program.name}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Status
                  </label>
                  <select
                    name="is_active"
                    value={editingDoctor.is_active}
                    onChange={handleEditDoctorChange}
                    className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500 text-white rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  >
                    <option value={true}>Verified</option>
                    <option value={false}>Unverified</option>
                  </select>
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
                    onClick={handleUpdateDoctor}
                    disabled={submitLoading}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {submitLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      "Update Doctor"
                    )}
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Global Messages */}
      {error && !showAddModal && !showEditModal && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-fade-in">
          {error}
        </div>
      )}

      {success && !showAddModal && !showEditModal && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-fade-in">
          {success}
        </div>
      )}
    </div>
  );
};

export default Doctors;