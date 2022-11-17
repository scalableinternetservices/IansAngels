import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import bg_image from "../public/food_bg.jpg";

export default function Home() {
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            Ian's Angels All-In-One Restaurant WebApp
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/client">Client</Nav.Link>
              <Nav.Link href="/pos">POS</Nav.Link>
              <Nav.Link href="/kitchen">Kitchen</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{backgroundImage: `url(${bg_image.src})`, backgroundRepeat:"no-repeat", backgroundSize:"contain", height:1000, width:"auto", overflow:"auto"}}>
        <div className="m-5">
          <h1 className="text-center">Welcome to Ian's Angels All-In-One Restaurant WebApp</h1>
        </div>
        <div className="m-5">
          <Container>
            <Row>
              <Col className="text-center">
                <Link href="/client">
                  <Button variant="primary">Client Page</Button>
                </Link>
              </Col>
              <Col className="text-center">
                <Link href="/pos">
                  <Button variant="primary">POS Page</Button>
                </Link>
              </Col>
              <Col className="text-center">
                <Link href="/kitchen">
                  <Button variant="primary">Kitchen Page</Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}
