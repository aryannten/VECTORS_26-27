import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import EntryRegistration from './pages/EntryRegistration'
import MyPass from './pages/MyPass'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Security from './pages/Security'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="entry-registration" element={<EntryRegistration />} />
        <Route path="my-pass" element={<MyPass />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:eventId" element={<EventDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* Security scanner lives outside the main layout */}
      <Route path="/security" element={<Security />} />
    </Routes>
  )
}

export default App

