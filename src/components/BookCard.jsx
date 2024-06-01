import React, { useEffect, useState } from "react";
import { Button, Card, Col } from "react-bootstrap";
import { useFirebase } from "../context/Firebase";
import { useNavigate } from "react-router-dom";
import { generateFromString } from 'generate-avatar';

function BookCard({ bookData, id, myBook }) {
  const [url, setURL] = useState(null);
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    firebase.getImageDownloadURL(bookData.imageURL).then((url) => setURL(url));
  }, [bookData.imageURL, firebase]);

  const handleDelete = async () => {
    try {
      await firebase.deleteBookById(id);
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete the book. Please try again.");
    }
  };

  return (
    <Col key={id}>
      <Card className="h-100">
        {bookData.imageURL && (
          <Card.Img variant="top" src={url} alt={bookData.name} />
        )}
        <Card.Body>
          <Card.Title>{bookData.name}</Card.Title>
          <Card.Text>
            <strong>ISBN:</strong> {bookData.isbn} <br />
            <strong>Price:</strong> ${bookData.price} <br />
            <strong>Posted by:</strong> {bookData.userName} <br />
            {bookData.userEmail && (
              <>
                <strong>Email:</strong> {bookData.userEmail} <br />
              </>
            )}
          </Card.Text>
          {bookData.userPhotoURL ? (
            <div className="text-center">
              <img
                src={bookData.userPhotoURL}
                alt="User"
                className="rounded-circle"
                style={{ width: "50px", height: "50px" }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "fallback-image-url.jpg";
                }} 
              />
            </div>
          ) : (
            <div className="text-center">
              <img
                src={`data:image/svg+xml;utf8,${generateFromString(bookData.userEmail)}`} 
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
          {myBook ? (
            <>
              <Button
                onClick={() => {
                  navigate(`/book/orders/${id}`);
                }}
                className="mt-3"
                variant="primary"
              >
                View Orders for this book
              </Button> 
              <Button
                onClick={() => {
                  navigate(`/book/edit/${id}`);
                }}
                className="mt-3"
                variant="secondary"
              >
                Edit Book details
              </Button> 
              <Button
                onClick={handleDelete}
                className="mt-3"
                variant="danger"
              >
                Delete Book 
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                navigate(`/book/view/${id}`);
              }}
              className="mt-3"
              variant="primary"
            >
              View Book
            </Button>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default BookCard;
