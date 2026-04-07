import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import StudentLogin from '../pages/StudentLogin.jsx'
import EmployerLogin from '../pages/EmployerLogin.jsx'
import AdminLogin from '../pages/AdminLogin.jsx'
import OfficerLogin from '../pages/OfficerLogin.jsx'
import StudentOverviewPage from '../pages/StudentOverviewPage.jsx'
import StudentJobsPage from '../pages/StudentJobsPage.jsx'
import StudentApplicationsPage from '../pages/StudentApplicationsPage.jsx'
import EmployerDashboard from '../pages/EmployerDashboard.jsx'
import EmployerApplicationsPage from '../pages/EmployerApplicationsPage.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminUsers from '../pages/admin/Users.jsx'
import AdminJobs from '../pages/admin/Jobs.jsx'
import PlacementData from '../pages/admin/PlacementData.jsx'
import OfficerDashboard from '../pages/OfficerDashboard.jsx'
import PODashboard from '../pages/PODashboard.jsx'
import PORecords from '../pages/PORecords.jsx'
import POReports from '../pages/POReports.jsx'
import POCompanies from '../pages/POCompanies.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/employer-login" element={<EmployerLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/officer-login" element={<OfficerLogin />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentOverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentJobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentApplicationsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/student" element={<Navigate to="/dashboard" replace />} />
      <Route path="/student/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/student/jobs" element={<Navigate to="/jobs" replace />} />
      <Route path="/student/applications" element={<Navigate to="/applications" replace />} />
      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/applications"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerApplicationsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/employer" element={<Navigate to="/employer/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout title="Admin Dashboard">
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout title="Users Management">
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout title="Jobs Management">
              <AdminJobs />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/placements"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout title="Placement Data">
              <PlacementData />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/officer"
        element={
          <ProtectedRoute allowedRoles={['OFFICER']}>
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/po/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
            <PODashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/po/records"
        element={
          <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
            <PORecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/po/reports"
        element={
          <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
            <POReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/po/companies"
        element={
          <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
            <POCompanies />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
