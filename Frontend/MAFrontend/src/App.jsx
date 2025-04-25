import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './pages/@protect/ProtectedRoute';
import ALogin from "./pages/@auth/login/adminlogin";
import Login from "./pages/@auth/login/login";
import Register from "./pages/@auth/register/register";
import AdminRegister from "./pages/@auth/register/adminregister";
//import Dashboard from "./pages/@Dashboard/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/master" element={<ALogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Protect these routes */}
        {/* 
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route
            path="/dashboard/patients"
            element={<patients />}
          />
          <Route path="/dashboard/categories" element={<categories />} />
          <Route
            path="/dashboard/doctors"
            element={<doctors />}
          />
          <
          
        </Route>*/}
      </Routes>
    </Router>
  );
}

export default App;
