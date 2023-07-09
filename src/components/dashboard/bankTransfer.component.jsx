import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";

async function transfer(userToken, request) {
  try {
    return fetch('http://localhost:8000/api/transfer/bank', {
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

const BankTransfer = ({bankTransferCallback}) => {

  const [acctNumber, setAcctNumber] = useState('')
  const [amount, setAmount] = useState('0.00')
  const [providerId, setProviderId] = useState('')
  const [bankId, setBankId] = useState('')
  const [providers, setProviders] = useState([])
  const [banks, setBanks] = useState([])

  const tokenString = sessionStorage.getItem('token')
  const userToken = JSON.parse(tokenString)
  const user = sessionStorage.getItem('user')
  const jsonUser = JSON.parse(user)
  const account = jsonUser[0].account

  async function getProviders () {
    try {
      return fetch('http://localhost:8000/api/providers',{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        }
      }).then(data => data.json())
    } catch (error) {
      Swal.fire({
        text: JSON.stringify(error.message),
        timer: 3000,
        icon: "error"
      })
      return
    }
  }

  useEffect(() => {
    getProviders().then(res => {
      setProviders(res.data)
    })
  }, [setProviders])

  async function getProviderBanks(id) {
    try {
      return fetch('http://localhost:8000/api/provider/'+id+'/banks', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + userToken,
                },
              }).then(data => data.json())
    } catch (error) {
      Swal.fire({
        text: JSON.stringify(error.message),
        timer: 3000,
        icon: "error"
      })
      return
    }
  }

  async function getProviderBanksHandle(e) {
    const id = e.target.value
    if (id === "") {
      setBanks([])
      return
    }
    const data = await getProviderBanks(id)
    setBanks(data.data[0].banks)
  }

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
      'provider_id': providerId,
      'bank_id': bankId,
      'acct_number': acctNumber,
      'amount': amount
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
    sessionStorage.removeItem('user')
    sessionStorage.setItem('user', userSession)
    bankTransferCallback(userSession)
    Swal.fire({
      icon:"success",
      text:data.message,
      timer: 3000,
    })
    setProviderId('')
    setBankId('')
    setAcctNumber('')
    setAmount('0.00')
  }

  return (
    <>
    <div className="col-6 col-sm-6 col-md-6">
      <div className="card card-margin-bottom small">
        <div className="card-body">
          <div className="card-title text-center">
            <h6>
              Send Money to Bank
            </h6>
            <hr />
            <Form className="text-start" onSubmit={handleSubmit}>
              <Row className="my-3">
                <Col>
                  <Form.Group controlId="Provider">
                    <Form.Label>Provider</Form.Label>
                    <Form.Select className="small-font form-select-sm" value={providerId} required onChange={(event) => {
                      setProviderId(event.target.value)
                      getProviderBanksHandle(event)
                    }}>
                      <option className="small-font form-select-sm" value="">Choose you provider.</option>
                      {
                        providers.length > 0 && (
                          providers.map((provider) => {
                            return (
                              <option className="small-font form-select-sm" key={provider.id} value={provider.id}>
                                {provider.name}
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
                  <Form.Group controlId="Bank">
                    <Form.Label>Bank</Form.Label>
                    <Form.Select className="small-font form-select-sm" value={bankId} required onChange={(event) => {
                      setBankId(event.target.value)
                    }}>
                      <option className="small-font form-select-sm" value="">Choose you bank.</option>
                      {
                        banks.length > 0 && (
                          banks.map((bank) => {
                            return (
                              <option className="small-font form-select-sm" key={bank.id} value={bank.id}>
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
                  <Form.Group controlId="AccountNumber">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control className="small-font form-select-sm" type="text" min={8} value={acctNumber} required onChange={(event)=> {
                      setAcctNumber(event.target.value)
                    }}/>
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

export default BankTransfer