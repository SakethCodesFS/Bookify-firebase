import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { Card, Container, Row, Col, Spinner, Button, Form, Alert } from "react-bootstrap";
import { useFirebase } from "../context/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/Cart";

function ViewBook() {
  const { id } = useParams();
  const firebase = useFirebase();
  const [book, setBook] = useState(null);
  const [url, setURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const { addItemToCart } = useCart();
  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const doc = await firebase.getBookById(id);
        if (doc.exists) {
          const data = doc.data();
          setBook(data);
          const imageURL = await firebase.getImageDownloadURL(data.imageURL);
          setURL(imageURL);
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [firebase, id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="text-center mt-5">
        <h3>Book not found</h3>
      </Container>
    );
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (quantity <= 0) {
      return setError("Quantity must be greater than 0");
    }

    const newItem = {
      quantity: parseInt(quantity, 10),
      bookId: id,
      customerName: firebase.user.email.split("@")[0],
      purchaseDate: Date.now(),
      bookAuthor: book.userName,
      bookTitle: book.name,
      price: book.price,
      bookImage: book.imageURL,
      description: `${book.name} is authored by ${book.userName} and the price of a single book is ${book.price}`
    };

    addItemToCart(newItem);

    showAlert(`${book.name} is added to the cart successfully!`, 'success');

    setQuantity('');
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1500);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            {url && <Card.Img variant="top" src={url} alt={book.name} />}
            <Card.Body>
              <Card.Title>{book.name}</Card.Title>
              <Card.Text>
                <strong>ISBN:</strong> {book.isbn} <br />
                <strong>Price:</strong> ${book.price} <br />
                <strong>Posted by:</strong> {book.userName} <br />
                <Card.Text>
                  <strong>Description:</strong> {book.name} is authored by{" "}
                  {book.userName} and the price of the book is ${book.price}{" "}
                  <br />
                </Card.Text>
              </Card.Text>
              {book.userPhotoURL && (
                <div className="text-center">
                  <img
                    src={book.userPhotoURL}
                    alt="User"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "fallback-image-url.jpg";
                    }}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
          {alert.show && (
            <Alert className="mt-2" variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
              {alert.message}
            </Alert>
          )}
          <Form onSubmit={handleAddToCart}>
            <Form.Group className="mb-3" controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <div className="input-icon-wrapper">
                <FontAwesomeIcon icon={faHashtag} className="input-icon" />
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    setError(null);
                    setQuantity(e.target.value);
                  }}
                  placeholder="Enter Quantity"
                />
              </div>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" type="submit" className="w-100">
              Add to Cart
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewBook;
