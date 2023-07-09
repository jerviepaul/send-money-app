import * as React from "react";
import logo from './logo.svg';
import './App.css';
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import Register from "./components/auth/register.component";
import Login from "./components/auth/login.component";
import Dashboard from "./components/dashboard/dashboard.component";
import Logout from "./components/auth/logout.component";

function App() {

  const [token, setToken] = React.useState()
  const hasToken = sessionStorage.getItem('token') !== null ? true : false;
  const pathName = window.location.pathname
  
  return(<Router>
    <Navbar bg="primary">
      <Container>
        <Nav.Link href="/login" className="navbar-brand text-white">
          Send Money App
        </Nav.Link>
      </Container>
      {
        hasToken ? (
          <Nav className="ml-auto">
            <Nav.Link className="active text-white" href="/logout">Logout</Nav.Link>
          </Nav>
        ) : (
          pathName === '/register' && (
            <Nav className="ml-auto text-white">
              <Nav.Link className="active text-white" href="/login">Login</Nav.Link>
              <Nav.Link className="disabled" href="">Register</Nav.Link>
            </Nav>
          ),
          pathName === '/login' && (
            <Nav className="ml-auto">
              <Nav.Link className="disabled" href="">Login</Nav.Link>
              <Nav.Link className="active text-white" href="/register">Register</Nav.Link>
            </Nav>
          )
        )
      }
    </Navbar>
    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <Routes>
            <Route path="/register" element={<Register /> } />
            <Route path="/login" element={<Login setToken={setToken} /> } />{" "}
            <Route path="/dashboard" element={<Dashboard /> } />
            <Route path="/logout" element={<Logout /> } />
            <Route exact path='/' element={<Login setToken={setToken} />} />{" "}
          </Routes>
        </Col>
      </Row>
    </Container>
  </Router>);
}

export default App;
