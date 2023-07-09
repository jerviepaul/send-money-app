import { Col, Row } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import { Route } from "react-router-dom";

export default function Transactions ( {userTransactionsCallback} ) {

  const user = localStorage.getItem('user')
  const jsonUser = JSON.parse(user)
  const transactionsData = jsonUser[0].transactions
  userTransactionsCallback()
  function getSymbol(type) {
    if (type === 'Send') {
      return '-'
    }
    return '+'
  }

  function fromTo(type) {
    if (type === 'Send') {
      return 'to'
    }
    return 'from'
  }

  return (
    <ul className="list-group list-group-flush">
      {
        transactionsData.length > 0 ? (
          transactionsData.map((transaction) => {
            return (
              <li key={transaction.id} className="list-group-item smaller-font">
                <Row>
                  <Col>
                    <span>{transaction.type} Money {fromTo(transaction.type)} {transaction.channel}</span>
                  </Col>
                  <Col className="text-center">
                    <p>{getSymbol(transaction.type)}<NumericFormat prefix="&#8369;" value={transaction.transaction_amount.toFixed(2)} displayType="text" thousandSeparator={true} /></p>
                    <p className="smaller-font">Last Balance: <NumericFormat prefix="&#8369;" value={transaction.previous_balance.toFixed(2)} displayType="text" thousandSeparator={true} /></p>
                  </Col>
                </Row>
              </li>
            )
          })
        ) : (
          <li className="text-center small">No recent transactions.</li>
        )
      }
    </ul>
  )
}