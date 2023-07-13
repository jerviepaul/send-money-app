import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";

async function transfer(userToken, request) {
  try {
    return fetch('http://localhost:8000/api/transfer/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken,
      },
      body: JSON.stringify(request)
    }).then(resp => resp.json())
  } catch (error) {
    Swal.fire({
      text: error.error,
      timer: 3000,
      icon: "error"
    })
  }
  
}

export default function UserTransfer({userTransferCallback})  {
  
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('0.00')
  const [users, setUsers] = useState([])

  const tokenString = localStorage.getItem('token')
  const userToken = JSON.parse(tokenString)
  const user = localStorage.getItem('user')
  const jsonUser = JSON.parse(user)
  const account = jsonUser[0].account

  const fetchUsers = async () => {
    try {
      return await fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }).then(data => data.json())
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.message,
        timer: 3000,
      })
    }
  }

  useEffect(() => {
    fetchUsers().then(res => {
      setUsers(res)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setAmount(Number(amount).toFixed(2).toString())

    if (amount > account.acct_balance) {
      Swal.fire({
        text: 'Not enough balance.',
        timer: 3000,
        icon: "error"
      })
      return
    }

    const request = {
      'email': email,
      'amount': Number(amount).toFixed(2).toString()
    }

    const data = await transfer(userToken, request)
    if (!JSON.stringify(data.success)) {
      Swal.fire({
        text: JSON.stringify(data.data),
        timer: 3000,
        icon: "error"
      })
      return
    }

    const userSession = JSON.stringify(data.data)
    localStorage.removeItem('user')
    localStorage.setItem('user', userSession)
    userTransferCallback(userSession)
    Swal.fire({
      icon:"success",
      text:data.message,
      timer: 3000,
    })
    setEmail('')
    setAmount('0.00')
  }


  return (
    <>
    <div className="col-6 col-sm-6 col-md-6">
      <div className="card card-margin-bottom small">
        <div className="card-body">
          <div className="card-title text-center">
            <h6>
              Send Money to User
            </h6>
            <hr />
            <Form className="text-start" onSubmit={handleSubmit}>
              <Row className="my-3">
                <Col>
                  <Form.Group controlId="Email">
                    <Form.Label>Email</Form.Label>
                    <Form.Select className="small-font form-select-sm" value={email} required onChange={(event) => {
                      setEmail(event.target.value)
                    }}>
                      <option className="small-font form-select-sm" value="">Select user email.</option>
                      {
                        users.length > 0 && (
                          users.map((user) => {
                            return (
                              <option className="small-font form-select-sm" key={user.id} value={user.email}>
                                {user.email}
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
                  <Form.Group controlId="Amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control className="small-font form-select-sm" type="number" min={100} step={0.01} value={amount} required onChange={(event)=> {
                      setAmount(event.target.value)
                    }}/>
                  </Form.Group>
                </Col>
              </Row>
              <Button className="small-font mt-2 text-center col-sm-12" variant="success" size="md" block="block" type="submit">
                Transfer
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}