import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Communities from './pages/Communities'
import CommunityForm from './pages/CommunityForm'
import Properties from './pages/Properties'
import PropertyForm from './pages/PropertyForm'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="communities" element={<Communities />} />
        <Route path="communities/new" element={<CommunityForm />} />
        <Route path="communities/:id" element={<CommunityForm />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/new" element={<PropertyForm />} />
        <Route path="properties/:id" element={<PropertyForm />} />
      </Route>
    </Routes>
  )
}

export default App
