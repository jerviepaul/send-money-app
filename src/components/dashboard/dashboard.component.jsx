import Login from "../auth/login.component";
import useToken from "../../app/useToken";
import { NumericFormat } from "react-number-format";
import { Col, Row } from "react-bootstrap";
import Transactions from "./transactions.component";
import UserTransfer from "./userTransfer.component";
import BankTransfer from "./bankTransfer.component";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

async function fetchUserData(userId, token) {
  try {
    const data = await fetch('http://localhost:8000/api/user'+userId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    }).then(data => data.json())
    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(data.data[0]))
  } catch (error) {
    Swal.fire({
      text: error.error,
      timer: 3000,
      icon: "error"
    })
  }
}


export default function Dashboard () {
  const {token, setToken} = useToken()
  const [transactionData, setTransactionData] = useState()
  
  if(!token){
    {return <Navigate to={'/login'} />}
  }

  const user = localStorage.getItem('user')
  const jsonUser = JSON.parse(user)


  useEffect(() => {
    fetchUserData(jsonUser[0].id, token)
  }, [])

  const userTransferCallback = (userTransferData) => {
    setTransactionData(userTransferData)
    userTransactionsCallback(userTransferData)
  }

  const bankTransferCallback = (userTransferData) => {
    setTransactionData(userTransferData)
    userTransactionsCallback(userTransferData)
  }

  const userTransactionsCallback = (userTransactionsData) => {
  }

  const account = jsonUser[0].account
  

  return (
    <>
    <div className="container">
      <div className="row justify-content-center">
        <div className="font-bold text-2xl">
          <h4 className="text-primary">Dashboard - {jsonUser[0].name}</h4>
        </div>
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card card-margin-bottom">
            <div className="card-body">
              <div className="card-title">
                <h5>Balance: <NumericFormat prefix="&#8369;" value={(account.acct_balance).toFixed(2)} displayType={'text'} thousandSeparator={true} /></h5>
                <hr />
                <Row>
                    <UserTransfer userTransferCallback={userTransferCallback} />
                    <BankTransfer bankTransferCallback={bankTransferCallback} />
                </Row>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-4 w-20">
          <div className="card card-margin-bottom">
            <div className="card-body">
              <div className="card-title">
                <h5>Transactions</h5>
                <hr />
              </div>
              <Row className="scroll">
                <Col className="h-25">
                  <Transactions userTransactionsCallback={userTransactionsCallback} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}