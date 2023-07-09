import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

async function login(credentials) {
  return fetch('http://localhost:8000/api/login',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  }).then(data => data.json())
}

const Login = ({setToken}) => {
  const navigate = useNavigate();

  if (!setToken) {
    console.log("setToken")
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationError, setValidationError] = useState({})

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await login({
      email,
      password,
      'withCredentials': true,
    })
    Swal.fire({
      icon:"success",
      text:data.message,
      timer: 3000,
    })
    
    localStorage.setItem('token', JSON.stringify(data.data.token))
    setToken(data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))
    navigate('/dashboard')
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-4 small">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Login</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value])=>(
                                <li key={key}>{value}</li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={handleSubmit}>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control className="small-font" type="email" value={email} required onChange={(event)=> {
                          setEmail(event.target.value)
                        }}/>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control className="small-font" type="password" value={password} required onChange={(event)=> {
                          setPassword(event.target.value)
                        }}/>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="success" className="small-font mt-2 text-center col-sm-12" size="lg" block="block" type="submit">
                    Login
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login;