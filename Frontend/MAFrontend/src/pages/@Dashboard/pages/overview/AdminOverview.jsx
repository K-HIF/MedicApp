import React, { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../../../../utils/axiosConfig';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalCategories: 0,
    patientsByCategory: {},
    recentPatients: [],
    doctorStats: {
      active: 0
    }
  });
  const [adminDetails, setAdminDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsResponse, doctorsStatsResponse, categoriesResponse, adminResponse] = await Promise.all([
          axiosInstance.get('/backendapi/patient/'),
          axiosInstance.get('/backendapi/doctors/stats/'),
          axiosInstance.get('/backendapi/categories/'),
          axiosInstance.get('/backendapi/admin-details/')
        ]);

        const patients = patientsResponse.data.patients;
        const doctorStats = doctorsStatsResponse.data;
        const categories = categoriesResponse.data;
        
        setAdminDetails(adminResponse.data);
        setEditedEmail(adminResponse.data.email);

        // Calculate patients per category using the categories array
        const categoryCount = {};
        categories.forEach(category => {
          categoryCount[category.name] = 0;
        });

        patients.forEach(patient => {
          patient.categories.forEach(category => {
            if (categoryCount.hasOwnProperty(category.name)) {
              categoryCount[category.name]++;
            }
          });
        });

        // Sort patients by created_at date and take the 5 most recent
        const sortedPatients = [...patients].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 5);

        setStats({
          totalPatients: patients.length,
          totalDoctors: doctorStats.total_doctors,
          totalCategories: categories.length,
          patientsByCategory: categoryCount,
          recentPatients: sortedPatients,
          doctorStats: {
            active: doctorStats.active_doctors
          }
        });
        setLoading(false);
      } catch (error) {
        setError("Error fetching dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateEmail = async () => {
    try {
      await axiosInstance.put('/backendapi/admin-details/', {
        email: editedEmail
      });
      setAdminDetails({ ...adminDetails, email: editedEmail });
      setIsEditing(false);
      setSuccess("Email updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating email");
      setTimeout(() => setError(""), 3000);
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
    <div className="p-8">
      
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Doctors</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalDoctors}</p>
          <p className="text-sm text-gray-500 mt-1">Active: {stats.doctorStats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Programs</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
        </div>
      </div>

      {/* Program Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Patients by Program</h2>
        <div className="space-y-4">
          {Object.entries(stats.patientsByCategory).map(([category, count]) => (
            <div key={category} className="relative">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-sm font-medium text-gray-700">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(count / stats.totalPatients) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${patient.FName} ${patient.MName} ${patient.SName}`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {patient.categories.map(category => (
                        <span 
                          key={category.id} 
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.Age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default AdminOverview;