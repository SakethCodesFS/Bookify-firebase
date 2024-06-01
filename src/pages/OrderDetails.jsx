import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/Firebase";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

function OrderDetails() {
  const firebase = useFirebase();
  const { bookId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [bookTitle, setBookTitle] = useState("");

  useEffect(() => {
    const fetchOrdersAndBookDetails = async () => {
      try {
        const bookDoc = await firebase.getBookById(bookId);
        if (bookDoc.exists) {
          setBookTitle(bookDoc.data().name);
        }

        const orders = await firebase.getOrdersByBookId(bookId);
        setOrderDetails(orders);
      } catch (error) {
        console.error("Error fetching orders or book details:", error);
      }
    };

    fetchOrdersAndBookDetails();
  }, [firebase, bookId]);

  return (
    <Container className="mt-5">
      <h2>Order Details for Book: {bookTitle}</h2>
      <Row>
        {orderDetails.length === 0 ? (
          <Col>
            <p>No orders found for this book.</p>
          </Col>
        ) : (
          orderDetails.map((order, index) => (
            <Col key={index} md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{order.bookTitle}</Card.Title>
                  <Card.Text>
                    <strong>Customer:</strong> {order.customerName} <br />
                    <strong>Quantity:</strong> {order.quantity} <br />
                    <strong>Price:</strong> ${order.price} <br />
                    <strong>Order Date:</strong> {new Date(order.purchaseDate.seconds * 1000).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default OrderDetails;
