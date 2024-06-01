import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useFirebase } from "../context/Firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Overlay.css"; // Import the overlay CSS
import BookCard from "../components/BookCard"; // Import the BookCard component
import { useNavigate } from "react-router-dom";

function Home() {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!firebase.user) {
      navigate('/register');
    } else {
      firebase.getAllBooks().then((docs) => setBooks(docs.docs));
    }
  }, [firebase, navigate]);

  console.log(books[0]?.data());
  console.log(firebase.user);

 

  return (
    
    <div className="container mt-5">
      <Row xs={1} md={2} lg={3} className="g-4">
        {books
          .filter((book) => book.data().userEmail !== firebase.user.email)
          .map((book) => {
            const data = book.data();
            const id = book.id;
            return <BookCard myBook={false} key={book.id} id={id} bookData={data} />;
          })}
      </Row>
    </div>
  );
}

export default Home;
