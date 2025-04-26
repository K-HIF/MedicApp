import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../../../../utils/axiosConfig";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    employee_id: "",
    email: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

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

  const addDoctor = async () => {
    try {
      await axiosInstance.post('/backendapi/register-doc/', newDoctor);
      fetchDoctors();
      setNewDoctor({
        firstName: "",
        lastName: "",
        employee_id: "",
        email: "",
      });
      setShowAddModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding doctor");
    }
  };

  const sendPasswordReset = async (employeeId, email) => {
    try {
      await axiosInstance.post('/backendapi/send-email/', {
        employee_id: employeeId,
        email: email
      });
      setError("Password reset email sent successfully");
    } catch (err) {
      setError(err.response?.data?.detail || "Error sending password reset email");
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{doctor.employee_id}</td>
                <td className="px-6 py-4">{`${doctor.firstName} ${doctor.lastName}`}</td>
                <td className="px-6 py-4">{doctor.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => sendPasswordReset(doctor.employee_id, doctor.email)}
                      className="text-gray-600 hover:text-gray-800"
                      title="Send password reset email"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Doctor Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
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
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addDoctor}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Add Doctor
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Doctors;