import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useFirebase } from "../context/Firebase";
import { useNavigate, Link } from "react-router-dom";
import "./Overlay.css"; // Import the overlay CSS

function Login() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate("/");
    }
  }, [firebase, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.signInUserWithEmailAndPass(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setEmail('');
      setPassword('')
    }
  };

  const signinWithGoogle = async () => {
    try {
      await firebase.loginWithGoogleAccount();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="overlay"></div>
      <div className="content">
        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => {
                  setError(null);
                  setEmail(e.target.value);
                }}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => {
                  setError(null);
                  setPassword(e.target.value);
                }}
                placeholder="Password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <h5>OR</h5>
            <Button
              onClick={signinWithGoogle}
              variant="danger"
              type="button"
              className="w-100"
            >
              Sign in with Google
            </Button>
            <Link to="/forgot-password" className="d-block mt-3">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
