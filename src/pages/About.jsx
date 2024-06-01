import React from 'react';
import "./Overlay.css"; // Import the overlay CSS

const About = () => {
  return (
    <div className="page-container">
      <div className="overlay"></div>
      <div className="content container">
        <h1>About Bookify</h1>
        <p>Welcome to Bookify! Your one-stop app for all things books.</p>
        <h2>Features</h2>
        <ul>
          <li><strong>Add New Book Listings:</strong> Easily add new books to your collection with detailed information including title, ISBN, price, and cover image.</li>
          <li><strong>View Books:</strong> Browse through the books listed by other users with detailed information and cover images.</li>
          <li><strong>Update Book Details:</strong> Edit the details of your listed books anytime.</li>
          <li><strong>Delete Book Listings:</strong> Remove books from your collection when no longer needed.</li>
          <li><strong>Order Management:</strong> View and manage all the orders for your books.</li>
          <li><strong>Cart Functionality:</strong> Add books to your cart, view cart items, and proceed to checkout with a confirmation modal.</li>
          <li><strong>User Authentication:</strong> Register and log in securely to manage your book listings and orders.</li>
          <li><strong>Responsive Design:</strong> Enjoy a seamless experience on both desktop and mobile devices.</li>
        </ul>
        <p>Join Bookify today and dive into a world of books!</p>
      </div>
    </div>
  );
};

export default About;
