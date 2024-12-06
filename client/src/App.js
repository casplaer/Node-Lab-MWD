import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UpdatePage from './pages/UpdatePage';
import ApiDemoPage from './pages/ApiDemoPage'
import DetailsPage from './pages/DetailsPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CreatePage from './pages/CreatePage';

function App() {
  return (
    <GoogleOAuthProvider clientId="140471774782-jud41o6q20iqrk4as0b0psjcndeobsut.apps.googleusercontent.com">
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<h1>Добро пожаловать!</h1>} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/admin" element={<AdminPage />}/>
          <Route path="/create" element={<CreatePage />}/>
          <Route path="/update/:id" element={<UpdatePage />}/>
          <Route path="/api-demo" element={<ApiDemoPage />}/>
          <Route path="/product-details/:id" element={<DetailsPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
