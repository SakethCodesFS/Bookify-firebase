import React, { useState, useRef, useEffect } from "react"; 
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBarcode, faDollarSign, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useFirebase } from "../context/Firebase";
import { useNavigate, useParams } from "react-router-dom";
import "./Overlay.css"; // Import the overlay CSS

function ListingPage() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [isbnNumber, setIsbnNumber] = useState('');
  const [price, setPrice] = useState('');
  const [coverPic, setCoverPic] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const fileInputRef = useRef(null);  // Create a ref for the file input

  useEffect(() => {
    if (id) {
      firebase.getBookById(id).then(doc => {
        const bookData = doc.data();
        setName(bookData.name);
        setIsbnNumber(bookData.isbn);
        setPrice(bookData.price);
        setCoverPic(bookData.imageURL);
      });
    }
  }, [id, firebase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === '' || isbnNumber === '' || price <= 0 || coverPic === '') {
      return showAlert('Please fill all the fields', 'danger');
    }
    try {
      if (id) {
        // Update existing book
        await firebase.updateBookById(id, { name, isbn: isbnNumber, price, imageURL: coverPic });
        showAlert('Listing updated successfully!', 'success');
      } else {
        // Create new book
        await firebase.handleCreateNewListing(name, isbnNumber, price, coverPic);
        showAlert('Listing created successfully!', 'success');
      }

      // Reset form fields
      setName('');
      setIsbnNumber('');
      setPrice('');
      setCoverPic('');
      fileInputRef.current.value = "";  // Reset file input

      // Navigate back to myBooks
      navigate('/myBooks');
    } catch (error) {
      console.error("Error creating or updating listing", error);
      showAlert("Failed to create or update listing. Please try again.", "danger");
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1500);
  };

  return (
    <Container className="mt-5">
      <div className="form-container bg-light p-4 border rounded">
        {alert.show && (
          <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBookTitle">
            <Form.Label>Book Title</Form.Label>
            <div className="input-icon-wrapper">
              <FontAwesomeIcon icon={faBook} className="input-icon" />
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Book Title"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formIsbnNumber">
            <Form.Label>ISBN Number</Form.Label>
            <div className="input-icon-wrapper">
              <FontAwesomeIcon icon={faBarcode} className="input-icon" />
              <Form.Control
                type="text"
                value={isbnNumber}
                onChange={(e) => setIsbnNumber(e.target.value)}
                placeholder="ISBN Number"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <div className="input-icon-wrapper">
              <FontAwesomeIcon icon={faDollarSign} className="input-icon" />
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter Price"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCoverPic">
            <Form.Label>Upload Cover Image</Form.Label>
            <div className="input-icon-wrapper">
              <FontAwesomeIcon icon={faUpload} className="input-icon" />
              <Form.Control
                type="file"
                ref={fileInputRef}  // Attach the ref to the file input
                onChange={(e) => setCoverPic(e.target.files[0])}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            {id ? 'Update Book Listing' : 'Create Book Listing'}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default ListingPage;
