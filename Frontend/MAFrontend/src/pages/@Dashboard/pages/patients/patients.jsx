import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../../../../utils/axiosConfig";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPatient, setNewPatient] = useState({
    FName: "",
    MName: "",
    SName: "",
    PatID: "",
    DOB: "",
    city: "",
    Category: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.FName.toLowerCase().includes(searchQuery) ||
      patient.SName.toLowerCase().includes(searchQuery) ||
      patient.Category.toLowerCase().includes(searchQuery)
  );

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const addPatient = async () => {
    try {
      await axiosInstance.post('/backendapi/patient/', newPatient);
      fetchPatients();
      setNewPatient({
        FName: "",
        MName: "",
        SName: "",
        PatID: "",
        DOB: "",
        city: "",
        Category: ""
      });
      setShowAddModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding patient");
    }
  };

  const editPatient = async () => {
    try {
      await axiosInstance.post(
        `/backendapi/patient/${selectedPatient.PatID}/credentials/`,
        newPatient
      );
      fetchPatients();
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating patient");
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
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
                <td className="px-6 py-4">{patient.Category}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setNewPatient(patient);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gradient-to-br from-teal-800 to-emerald-900 text-white rounded-lg p-6 w-full max-w-md relative z-50">
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
                    className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
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
                  className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Category
                </label>
                <select
                  name="Category"
                  value={newPatient.Category}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                >
                  <option value="" className="bg-teal-800">Select a category</option>
                  <option value="Cardiovascular" className="bg-teal-800">Cardiovascular</option>
                  <option value="Respiratory" className="bg-teal-800">Respiratory</option>
                  <option value="Neurological" className="bg-teal-800">Neurological</option>
                  <option value="Gastrointestinal" className="bg-teal-800">Gastrointestinal</option>
                  <option value="Orthopedic" className="bg-teal-800">Orthopedic</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addPatient}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                  Add Patient
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Patient Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Category
                </label>
                <select
                  name="Category"
                  value={newPatient.Category}
                  onChange={handleNewPatientChange}
                  className="w-full px-3 py-2 bg-teal-900/50 border border-teal-500 text-white rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                >
                  <option value="" className="bg-teal-800">Select a category</option>
                  <option value="Cardiovascular" className="bg-teal-800">Cardiovascular</option>
                  <option value="Respiratory" className="bg-teal-800">Respiratory</option>
                  <option value="Neurological" className="bg-teal-800">Neurological</option>
                  <option value="Gastrointestinal" className="bg-teal-800">Gastrointestinal</option>
                  <option value="Orthopedic" className="bg-teal-800">Orthopedic</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={editPatient}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                  Save Changes
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

export default Patients;