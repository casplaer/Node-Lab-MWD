import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
