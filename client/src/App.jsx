import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Particles from './components/ui/Particles'

// Lazy loaded pages
const EntryRegistration = lazy(() => import('./pages/EntryRegistration'))
const MyPass = lazy(() => import('./pages/MyPass'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Schedule = lazy(() => import('./pages/Schedule'))
const Announcements = lazy(() => import('./pages/Announcements'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Security = lazy(() => import('./pages/Security'))
const SecurityLogin = lazy(() => import('./pages/SecurityLogin'))
const Admin = lazy(() => import('./pages/admin/Admin'))
const AdminRegistrations = lazy(() => import('./pages/admin/AdminRegistrations'))
const AdminEventRegistrations = lazy(() => import('./pages/admin/AdminEventRegistrations'))
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'))
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-emerald/20 border-t-emerald animate-spin" />
      <span className="font-mono text-xs uppercase tracking-widest text-steel/60">
        INITIALIZING SUBROUTINE...
      </span>
    </div>
  )
}

function App() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  return (
    <div className="relative min-h-screen bg-doom-bg">
      {/* 3D Particle background for all pages except the landing page */}
      {!isLandingPage && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <Particles
            particleColors={['#1EFFA0', '#C7CCD1', '#5C6270']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
      )}

      <div className="relative z-10">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Public & User routes with main layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />

              {/* Public discovery routes */}
              <Route path="events" element={<Events />} />
              <Route path="events/:eventId" element={<EventDetail />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="faq" element={<FAQ />} />

              {/* Protected user routes: requires login */}
              <Route path="dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="entry-registration" element={
                <ProtectedRoute><EntryRegistration /></ProtectedRoute>
              } />
              <Route path="my-pass" element={
                <ProtectedRoute><MyPass /></ProtectedRoute>
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
              <Route path="event-registrations" element={<AdminEventRegistrations />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App
