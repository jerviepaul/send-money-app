import useToken from "../../app/useToken";
import { NumericFormat } from "react-number-format";
import { Col, Row } from "react-bootstrap";
import Transactions from "./transactions.component";
import UserTransfer from "./userTransfer.component";
import BankTransfer from "./bankTransfer.component";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";


export default function Dashboard () {
  const {token, setToken} = useToken()
  const [transactionData, setTransactionData] = useState()
  

  const fetchUserData = async (userId, token) => {
    try {
      return await fetch('http://localhost:8000/api/users/'+userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        }
      }).then(data => data.json())
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    if (token) {
      console.log(token, jsonUser[0].id)
      fetchUserData(jsonUser[0].id, token).then(res => {
        console.log(res)
        localStorage.setItem('user', JSON.stringify(res.data))
      })
    }
  }, [])

  if(!token){
    {return <Navigate to={'/login'} />}
  }

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

  const user = localStorage.getItem('user')
  const jsonUser = JSON.parse(user)
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