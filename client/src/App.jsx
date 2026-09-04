import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EntryRegistration from './pages/EntryRegistration'
import MyPass from './pages/MyPass'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Security from './pages/Security'
import SecurityLogin from './pages/SecurityLogin'
import Admin from './pages/admin/Admin'
import AdminRegistrations from './pages/admin/AdminRegistrations'
import AdminEvents from './pages/admin/AdminEvents'
import AdminUsers from './pages/admin/AdminUsers'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Protected: any logged-in user */}
        <Route path="entry-registration" element={
          <ProtectedRoute><EntryRegistration /></ProtectedRoute>
        } />
        <Route path="my-pass" element={
          <ProtectedRoute><MyPass /></ProtectedRoute>
        } />
        <Route path="events" element={
          <ProtectedRoute><Events /></ProtectedRoute>
        } />
        <Route path="events/:eventId" element={
          <ProtectedRoute><EventDetail /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Security: separate login page + protected scanner */}
      <Route path="/security/login" element={<SecurityLogin />} />
      <Route path="/security" element={
        <ProtectedRoute allowedRoles={['security', 'admin']}>
          <Security />
        </ProtectedRoute>
      } />

      {/* Admin: protected with admin-only layout */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Admin />} />
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  )
}

export default App
