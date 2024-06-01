import React, { useEffect, useState } from "react";
import { Row, Button, Container, Col, Card } from "react-bootstrap";
import { useFirebase } from "../context/Firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Overlay.css"; // Import the overlay CSS
import BookCard from "../components/BookCard"; // Import the BookCard component

function MyBooks() {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    firebase.getAllBooks().then((docs) => setBooks(docs.docs));
  }, [firebase]);

  // Filter books by the logged-in user's email
  const myBooks = books.filter((book) => book.data().userEmail === firebase.user.email);

  const handleShowOrders = async () => {
    const allOrders = [];
    for (const book of myBooks) {
      const bookId = book.id;
      const bookOrders = await firebase.getOrdersByBookId(bookId);
      allOrders.push(...bookOrders.map(order => ({ ...order, bookTitle: book.data().name })));
    }
    setOrders(allOrders);
    setShowOrders(true);
  };

  return (
    <div className="container mt-5">
      {myBooks.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {myBooks.map((book) => {
              const data = book.data();
              const id = book.id;
              return <BookCard myBook={true} key={book.id} id={id} bookData={data} />;
            })}
          </Row>
          <div className="text-center mt-4">
            <Button variant="primary" onClick={handleShowOrders}>
              Show All Orders
            </Button>
          </div>
        </>
      ) : (
        <h1>No books added yet!</h1>
      )}
      {showOrders && (
        <Container className="mt-5">
          <h2>All Orders</h2>
          <Row>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <Col key={index} md={4}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>{order.bookTitle}</Card.Title>
                      <Card.Text>
                        <strong>Customer:</strong> {order.customerName} <br />
                        <strong>Quantity:</strong> {order.quantity} <br />
                        <strong>Price:</strong> ${order.price} <br />
                        <strong>Order Date:</strong> {new Date(order.purchaseDate.seconds * 1000).toLocaleString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No orders found for your books.</p>
            )}
          </Row>
        </Container>
      )}
    </div>
  );
}

export default MyBooks;
