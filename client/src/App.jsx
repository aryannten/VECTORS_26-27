import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Particles from './components/ui/Particles'
import PageLoading from './components/ui/PageLoading'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import Landing from './pages/Landing'
import DoomsdayCommandCenter from './pages/DoomsdayCommandCenter'

// Lazy load non-critical pages for better initial load performance
const EntryRegistration = lazy(() => import('./pages/EntryRegistration'))
const MyPass = lazy(() => import('./pages/MyPass'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Schedule = lazy(() => import('./pages/Schedule'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Security = lazy(() => import('./pages/Security'))
const Admin = lazy(() => import('./pages/admin/Admin'))
const AdminRegistrations = lazy(() => import('./pages/admin/AdminRegistrations'))
const AdminEventRegistrations = lazy(() => import('./pages/admin/AdminEventRegistrations'))
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Immutable constant to prevent re-instantiating WebGL context on route re-renders
const PARTICLE_COLORS = ['#1EFFA0', '#C7CCD1', '#5C6270']

function App() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/' || location.pathname === '/command'

  return (
    <div className="relative min-h-screen bg-doom-bg">
      <ScrollToTop />

      {/* 3D Particle background for internal pages (disabled on heavy canvas views) */}
      {!isLandingPage && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <Particles
            particleColors={PARTICLE_COLORS}
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
        <ErrorBoundary>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              {/* Monumental Cinematic Landing & Tactical Command Center */}
              <Route path="/" element={<Landing />} />
              <Route path="/command" element={<DoomsdayCommandCenter />} />

              {/* Public & User routes wrapped in standard festival Layout */}
              <Route path="/" element={<Layout />}>
                <Route path="festival" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />

                {/* Public discovery routes */}
                <Route path="events" element={<Events />} />
                <Route path="events/:eventId" element={<EventDetail />} />
                <Route path="schedule" element={<Schedule />} />
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

              {/* Security: protected scanner (security staff log in via normal /login) */}
              <Route path="/security/login" element={<Navigate to="/login" replace />} />
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
                <Route path="users" element={<AdminUsers />} />
                <Route path="audit-logs" element={<AdminAuditLogs />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
