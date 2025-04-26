import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../utils/axiosConfig';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    patientsByCategory: {},
    recentPatients: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsResponse = await axiosInstance.get('/backendapi/patient/');
        const patients = patientsResponse.data.patients;

        const categoryCount = patients.reduce((acc, patient) => {
          acc[patient.Category] = (acc[patient.Category] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalPatients: patients.length,
          patientsByCategory: categoryCount,
          recentPatients: patients.slice(-5)
        });
        setLoading(false);
      } catch (error) {
        setError("Error fetching patient data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Patient Categories</h3>
          <p className="text-3xl font-bold text-gray-900">{Object.keys(stats.patientsByCategory).length}</p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">My Patients by Category</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">{patient.Category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.Age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;