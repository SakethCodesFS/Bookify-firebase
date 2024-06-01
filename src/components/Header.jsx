import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './Header.css'; // Import the custom CSS for the header
import { useFirebase } from '../context/Firebase';
import { useCart } from '../context/Cart'; // Assuming you have a CartContext for managing cart state

const Header = () => {
  const firebase = useFirebase();
  const cart = useCart();
  const navigate = useNavigate();

  const [signOut, setSignOut] = useState(false);
   const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setSignOut(firebase.isLoggedIn);
  }, [firebase.isLoggedIn]);

  useEffect(() => {
    setCartCount(cart.cartItems.reduce((total, item) => total + Number(item.quantity), 0));
  }, [cart.cartItems]);

  const handleSignOut = async () => {
    await firebase.signOutUser();
    navigate('/login');
  };

  const getWelcomeMessage = () => {
    if (firebase.user && firebase.user.email) {
      const username = firebase.user.email.split('@')[0];
      return `Welcome ${username}`;
    }
    return 'Welcome, Guest';
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          Bookify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav>
          <Navbar.Text>
            {getWelcomeMessage()}
          </Navbar.Text>
          <Nav>
            {signOut ? (
              <>
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                <Nav.Link as={Link} to="/book/list">Add Listing</Nav.Link>
                <Nav.Link  as={Link} to="/myBooks">My Books</Nav.Link>
                <Nav.Link onClick={handleSignOut}>Sign Out</Nav.Link>
                <Nav.Link as={Link} to="/cart">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span className="cart-count">{cartCount}</span>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
