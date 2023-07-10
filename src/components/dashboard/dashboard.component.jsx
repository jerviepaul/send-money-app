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

  let user = localStorage.getItem('user')
  let jsonUser = JSON.parse(user)
  let account = jsonUser[0].account
  
  // useEffect(() => {
    if (token) {
      fetchUserData(jsonUser[0].id, token).then(res => {
        localStorage.setItem('user', JSON.stringify(res.data))
        user = localStorage.getItem('user')
        jsonUser = JSON.parse(user)
        account = jsonUser[0].account
        document.getElementById("acct_balance").innerHTML = numberWithCommas(account.acct_balance.toFixed(2))
      })
    }
  // }, [])
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
                <h5>Balance: &#8369;<NumericFormat id="acct_balance" prefix="" value={(account.acct_balance).toFixed(2)} displayType={'text'} thousandSeparator={true} /></h5>
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