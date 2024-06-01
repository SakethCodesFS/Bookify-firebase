import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Header from './components/Header'; // Import the Header component
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ForgotPassword from './pages/ForgotPassword';
import ListingPage from './pages/ListingPage';
import ViewBook from './pages/ViewBook';
import CartPage from './pages/CartPage';
import MyBooks from './pages/MyBooks';
import OrderDetails from './pages/OrderDetails';
import './global.css'; // Import the global CSS file

function App() {
  return (
    <div>
      <Header /> {/* Add the Header component here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/book/list" element={<ListingPage />} />
        <Route path="/book/edit/:id" element={<ListingPage />} /> {/* Route for editing a book */}
        <Route path="/home" element={<Home />} />
        <Route path='/book/view/:id' element={<ViewBook />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/myBooks' element={<MyBooks />} />
        <Route path='/book/orders/:bookId' element={<OrderDetails />} />
      </Routes>
    </div>
  );
}

export default App;
