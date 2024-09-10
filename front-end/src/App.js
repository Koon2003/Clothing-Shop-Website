import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/frontEndPages/HomePage';
import ProductDetailPage from './pages/frontEndPages/ProductDetailsPage';
import AdminDashboard from './pages/adminDashboard/AdminDashboard';
import LogIn from './pages/adminDashboard/auth/LogIn';
import CategoryPage from './pages/frontEndPages/CategoryPage';
import CheckOutPage from './pages/frontEndPages/CheckOutPage';
import CartPage from './pages/frontEndPages/CartPage';
import SearchPage from './pages/frontEndPages/SearchPage';
import ThankYouPage from './pages/frontEndPages/ThanhYouPage';
import PrivacyPolicyPage from './pages/frontEndPages/Policy Pages/PrivacyPolicyPage';
import ShippingPolicyPage from './pages/frontEndPages/Policy Pages/ShippingPolicyPage';
import TermsAndConditionsPage from './pages/frontEndPages/Policy Pages/TermsAndConditionsPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path='/admin/' element={<AdminDashboard />}/>
          <Route path='/login/' element={<LogIn />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicyPage />} />
          <Route path="/chinh-sach-giao-hang" element={<ShippingPolicyPage />} />
          <Route path="/dieu-khoan-dich-vu" element={<TermsAndConditionsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
