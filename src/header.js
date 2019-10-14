import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Login from './login'
import Logout from './logout'
import Register from './register'
import Image from './image'

export default function Header() {
  const [cookies] = useCookies(['authtoken']);
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Devolute Image Upload Test</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {!cookies.authtoken ? 
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            : 
              <>
              <Nav.Link as={Link} to="/">Images</Nav.Link>
              <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route path="/login">
          <Login/>
        </Route>
        <Route path="/logout">
          <Logout/>
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/">
          <Image/>
        </Route>
      </Switch>
    </Router>
  )
}