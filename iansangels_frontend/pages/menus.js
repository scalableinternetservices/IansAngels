import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';



export default function PosMenus() {
    //var orders_json = getOrders();
  
  
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">Ian's Angels All-In-One Restaurant WebApp</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/pos">POS Home</Nav.Link>
                <Nav.Link href="/salesreport">Sales Report</Nav.Link>
                <Nav.Link href="/inventory">Inventory</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="m-5">
          <h1 className="text-center">POS</h1>
        </div>
        <br/>
        <div className="m-5">
          <h2>Menus</h2>
        </div>
        <br/>
      </div>
    )
  }
  