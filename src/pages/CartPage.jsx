import React, {  useEffect, useState } from "react";
import { Button, Container, Row, Col, Image, Form, Alert, Modal } from "react-bootstrap";
import { useCart } from "../context/Cart";
import "./CartPage.css"; // Import the custom CSS for the cart page
import { useFirebase } from "../context/Firebase";
import { addDoc, collection } from "firebase/firestore";
import { fireStore } from "../context/Firebase";

const CartPage = () => {
  const { cartItems, setCartItems, removeItemFromCart } = useCart();
  const { getImageDownloadURL } = useFirebase();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImageURLs = async () => {
      const itemsWithImageURLs = await Promise.all(
        cartItems.map(async (item) => {
          if (item.bookImage) {
            const imageURL = await getImageDownloadURL(item.bookImage);
            return { ...item, bookImage: imageURL };
          }
          return item;
        })
      );
      setCartItems(itemsWithImageURLs);
    };

    fetchImageURLs();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let totalPrice = 0;
      cartItems.forEach((item) => {
        totalPrice += item.price * item.quantity;
      });
      setTotalPrice(totalPrice);
    };
    calculateTotalPrice();
  }, [cartItems]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1500);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const newCartItems = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        await addDoc(collection(fireStore, `books/${item.bookId}/orders`), {
          ...item,
          purchaseDate: new Date(),
        });
      }
      showAlert("Order placed successfully!", "success");
      setCartItems([]); // Clear the cart after checkout
    } catch (error) {
      console.error("Error placing order: ", error);
      showAlert("Failed to place order. Please try again.", "danger");
    }
  };

  const handleRemoveItem = (index) => {
    removeItemFromCart(index);
    showAlert("Item removed from cart", "success");
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleConfirmCheckout = () => {
    handleCloseModal();
    handleCheckout();
  };

  return (
    <Container className="cart-page">
      <h2>Your Cart</h2>
      {alert.show && (
        <Alert
          variant={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <Row key={index} className="cart-item">
            <Col md={3}>
              <Image src={item.bookImage} thumbnail />
            </Col>
            <Col md={5}>
              <h4>{item.bookTitle}</h4>
              <p>{item.description}</p>
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(index, parseInt(e.target.value))
                }
              />
            </Col>
            <Col md={2} className="text-right">
              <h5>${item.price * item.quantity}</h5>
              <Button
                variant="danger"
                onClick={() => handleRemoveItem(index)}
                className="remove-button"
              >
                Remove item
              </Button>
            </Col>
          </Row>
        ))
      )}
     {cartItems.length === 0 ? <></> : <p>Total price: ${totalPrice}</p> } 
      {cartItems.length > 0 && (
        <Button
          variant="primary"
          onClick={handleShowModal}
          className="checkout-button"
        >
          Checkout
        </Button>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Order Summary</h5>
          {cartItems.map((item, index) => (
            <div key={index}>
              <p><strong>Title:</strong> {item.bookTitle}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.price}</p>
              <hr />
            </div>
          ))}
          <h5>Total Price: ${totalPrice}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmCheckout}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CartPage;
