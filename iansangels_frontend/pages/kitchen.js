import { useState, useEffect } from "react";

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
  const [editETAOrder, setEditETAOrder] = useState(0);
  const [editETAValue, setEditETAValue] = useState(0);
  const [ordersJson, setOrdersJson] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleETAChange = (event) => {
    setEditETAValue(event.target.value);
  };
  const handleSubmit = () => {
    setShow(false);
    // ordersJson[editETAId].eta = editETAValue;
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/kitchen";
    fetch(rails_url + endpoint, {
      method: "PATCH",
      body: JSON.stringify({
        username: editETAOrder.attributes.person.username,
        ETA: editETAValue,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        window.location.reload();
      });
  };

  useEffect(() => {
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/kitchen";
    fetch(rails_url + endpoint) //fetch with no options does a get request to that endpoint
      .then((response) =>
        response.json().then((data) => {
          // setOrders_json(data["data"]);
          // setLoading(false);
          let orders = data.data;
          orders.sort((a, b) => a.id - b.id);
          setOrdersJson(orders);
          // console.log(data);
        })
      );
  }, []);

  const editETA = (order) => {
    console.log("edit eta " + order.id);
    setEditETAOrder(order);
    setEditETAValue(order.attributes.ETA);
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
              {console.log(ordersJson)}
              {ordersJson &&
                ordersJson.map((order, i) => {
                  return (
                    <tr>
                      <td scope="row">{order.id}</td>
                      <td width="10%">{order.attributes.person.id}</td>
                      <td width="20%">
                        <ul>
                          {order.attributes.itemNames.map((item) => {
                            return <li>{item}</li>;
                          })}
                        </ul>
                      </td>
                      <td className="text-center" width="25%">
                        {order.attributes.ETA}
                      </td>
                      <td className="text-center" width="10%">
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            editETA(order);
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
          <Modal.Title>Edit Order {editETAOrder.id} ETA</Modal.Title>
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
