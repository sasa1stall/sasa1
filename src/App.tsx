import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              
              <Route element={<ProtectedRoute />}>
                 <Route path="checkout" element={<CheckoutPage />} />
                 <Route path="order-success/:id" element={<OrderSuccessPage />} />
                 <Route path="my-orders" element={<MyOrdersPage />} />
                 <Route path="profile" element={<ProfilePage />} />
                 <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route element={<ProtectedRoute adminOnly={true} />}>
                 <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


