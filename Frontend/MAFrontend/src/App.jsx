import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './pages/@protect/ProtectedRoute';
import ALogin from "./pages/@auth/login/adminlogin";
import Login from "./pages/@auth/login/login";
import Register from "./pages/@auth/register/register";
import AdminRegister from "./pages/@auth/register/adminregister";
import Dashboard from "./pages/@Dashboard/dashboard";
import AdminDashboard from "./pages/@Dashboard/adminDashboard";
import Categories from "./pages/@Dashboard/pages/categories/categories";
import Patients from "./pages/@Dashboard/pages/patients/patients";
import Doctors from "./pages/@Dashboard/pages/doctors/doctors";
import AdminOverview from "./pages/@Dashboard/pages/overview/AdminOverview";
import DashboardOverview from "./pages/@Dashboard/pages/overview/DashboardOverview";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/master" element={<ALogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Admin Dashboard Routes - Only accessible by admin */}
        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminDashboard />} />}
        >
          <Route index element={<AdminOverview />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="categories" element={<Categories />} />
          <Route path="patients" element={<Patients />} />
        </Route>

        {/* Normal Dashboard Routes - Accessible by all authenticated users */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        >
          <Route index element={<DashboardOverview />} />
          <Route path="patients" element={<Patients />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
