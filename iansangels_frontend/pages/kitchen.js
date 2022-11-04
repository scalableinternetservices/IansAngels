import { useState } from "react";

import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const getOrders = () => {
  var orders_json = [
    {
      orderId: 3,
      iduser: 1,
      order: "hamburger",
      eta: 15,
    },
    {
      orderId: 1,
      iduser: 5,
      order: "pizza",
      eta: 25,
    },
    {
      orderId: 2,
      iduser: 3,
      order: "taco",
      eta: 2,
    },
  ];

  orders_json.sort((a, b) => a.orderId - b.orderId);
  return orders_json;
};

export default function Kitchen() {
  const [show, setShow] = useState(false);
  const [editETAId, setEditETAId] = useState(0);
  const [editETAValue, setEditETAValue] = useState(0);
  const [ordersJson, setOrdersJson] = useState(getOrders());

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleETAChange = (event) => {
    setEditETAValue(event.target.value);
  };
  const handleSubmit = () => {
    setShow(false);
    ordersJson[editETAId].eta = editETAValue;
  };

  const editETA = (i) => {
    console.log("edit eta " + i);
    setEditETAId(i);
    setEditETAValue(ordersJson[i].eta);
    handleShow();
  };

  return (
    <>
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
                <Nav.Link href="/kitchen">Kitchen</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="m-5">
          <h1 className="text-center">Kitchen</h1>
        </div>
        <div className="m-5">
          <table className="table table-sm table-responsive table-hover table-striped">
            <thead>
              <tr>
                <th className="text-center">Order Id</th>
                <th className="text-center">Client User ID</th>
                <th className="text-center">Order</th>
                <th className="text-center">ETA</th>
                <th className="text-center">Update ETA</th>
              </tr>
            </thead>
            <tbody>
              {ordersJson.map((order, i) => {
                return (
                  <tr>
                    <td scope="row">{i + 1}</td>
                    <td width="10%">{order["iduser"]}</td>
                    <td width="10%">{order["order"]}</td>
                    <td className="text-center" width="25%">
                      {order["eta"]}
                    </td>
                    <td className="text-center" width="10%">
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          editETA(i);
                        }}
                      >
                        Edit ETA
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order {editETAId + 1} ETA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Update ETA</Form.Label>
              <Form.Control
                type="number"
                value={editETAValue}
                onChange={handleETAChange}
              />
              <Form.Text className="text-muted">Enter in minutes</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
