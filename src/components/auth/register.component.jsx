import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [bankId, setBankId] = useState("")
  const [acctNumber, setAcctNumber] = useState("")
  const [validationError, setValidationError] = useState({})

  const [banks, setBanks] = useState([])

  const fetchBanks = async () => {
    try {
      const resp = await axios.request('http://192.168.1.2:8000/api/banks');
      return resp;
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchBanks().then(res => {
      setBanks(res.data.data)
      console.log(res.data)
    })
  }, [])

  const clearForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setPasswordConfirmation('')
    setBankId('')
    setAcctNumber('')
    fetchBanks()
  }

  const register = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      Swal.fire({
        text: 'Password did not match.',
        title: 'Validation Error',
        icon: "error",
        timer: 3000,
      })
      return
    }

    var request = {
      'name': name,
      'email': email,
      'password': password,
      'password_confirmation': passwordConfirmation,
      'bank_id': bankId,
      'acct_number': acctNumber,
    }

    await axios.post('http://192.168.1.2:8000/api/register', request).then(({ data }) => {
      Swal.fire({
        icon: "success",
        text: data.message
      })
      clearForm()
      navigate("/")
    }).catch(({ response }) => {
      if (response.status === 404) {
        setValidationError([response.data.message])
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error"
        })
      }
    })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Register</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value]) => (
                                <li key={key}>{value}</li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={register}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={name} required onChange={(event) => {
                          setName(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} required onChange={(event) => {
                          setEmail(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} required onChange={(event) => {
                          setPassword(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Confirm Password">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" value={passwordConfirmation} required onChange={(event) => {
                          setPasswordConfirmation(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Bank">
                        <Form.Label>Bank</Form.Label>
                        <Form.Select value={bankId} required onChange={(event) => {
                          setBankId(event.target.value)
                        }}>
                          <option value="">Select your bank.</option>
                          {
                            banks.length > 0 && (
                              banks.map((bank) => {
                                return (
                                  <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                  </option>
                                )
                              })
                            )
                          }
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Account Number">
                        <Form.Label>Account Number</Form.Label>
                        <Form.Control type="text" value={acctNumber} required onChange={(event) => {
                          setAcctNumber(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="success" className="mt-2" size="lg" block="block" type="submit">
                    Register
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

export default Register;