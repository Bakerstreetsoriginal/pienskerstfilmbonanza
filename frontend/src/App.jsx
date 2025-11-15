import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ReviewsPage from './pages/ReviewsPage'
import ReviewDetailPage from './pages/ReviewDetailPage'
import AboutPage from './pages/AboutPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminReviewForm from './pages/admin/AdminReviewForm'
import ProtectedRoute from './components/ProtectedRoute'
import Snowfall from './components/Snowfall'
import './styles/App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Snowfall />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/reviews/:id" element={<ReviewDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/review/new" element={
              <ProtectedRoute>
                <AdminReviewForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/review/edit/:id" element={
              <ProtectedRoute>
                <AdminReviewForm />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App

