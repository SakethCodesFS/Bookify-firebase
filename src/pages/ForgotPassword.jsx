import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../context/Firebase";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
      setError("");
    } catch (error) {
      setError("Failed to send password reset email. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="page-container">
      <div className="overlay"></div>
      <div className="content">
        <div className="form-container">
          <h2>Forgot Password</h2>
          <Form onSubmit={handleSubmit}>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send Reset Email
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
