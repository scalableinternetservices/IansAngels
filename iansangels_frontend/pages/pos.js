import React, { useEffect, useState, useRef } from "react";
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
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export default function Pos() {
  const [orders_json, setOrders_json] = useState([]);

  function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => {
          clearInterval(id);
        };
      }
    }, [callback, delay]);
  }

  useInterval(async () => {
    fetchOrder();
  }, 2000);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = () => {
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/POS/orders";
    fetch(rails_url + endpoint) //fetch with no options does a get request to that endpoint
      .then((response) =>
        response.json().then((data) => {
          setOrders_json(data["data"]);
          setLoading(false);
        })
      );
  };

  const deleteOrder = (i) => {
    console.log("delete " + i);
    var cur_name = orders_json[i]["attributes"]["person"]["username"];

    const opts = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: cur_name,
      }),
    };

    var rails_url = "http://localhost:3001";
    var endpoint = "/POS/orders";
    fetch(rails_url + endpoint, opts).then((response) => {
      const orders = [...orders_json];
      orders.splice(i, 1);
      setOrders_json(orders);
    });
  };

  //var orders_json = getOrders();

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [newETA, setNewETA] = useState("");
  const [editNum, setEditNum] = useState(0);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleCloseSubmit = () => {
    console.log("submit new eta");
    console.log("new eta: " + newETA);
    var uname = orders_json[editNum]["attributes"]["person"]["username"];

    if (newETA == "") {
      window.alert("You need to enter a new ETA");
      return;
    }

    setShowModal(false);
    setEditNum(0);

    const opts = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: uname,
        ETA: newETA,
      }),
    };

    var rails_url = "http://localhost:3001";
    var endpoint = "/POS/orders";
    fetch(rails_url + endpoint, opts).then((response) => {
      const orders = [...orders_json];
      orders[editNum]["attributes"]["ETA"] = newETA;
      setOrders_json(orders);
    });
  };

  const editETA = (i) => {
    setEditNum(i);
    console.log("edit eta " + i);
    handleShow();
  };

  const sendToKitchen = (i) => {
    const uname = orders_json[i]["attributes"]["person"]["username"];
    const opts = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: uname,
        readyForKitchen: true,
      }),
    };

    var rails_url = "http://localhost:3001";
    var endpoint = "/POS/orders";
    fetch(rails_url + endpoint, opts).then((response) => {
      const orders = [...orders_json];
      orders[i]["attributes"]["readyForKitchen"] = true;
      setOrders_json(orders);
    });
  };

  if (loading) {
    return <h1>Loading</h1>;
  }
  /*else{
    console.log(orders_json);
  }*/

  return (
    <div>
      {console.log(orders_json)}
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
              <NavDropdown title="POS Pages" id="basic-nav-dropdown">
                <NavDropdown.Item href="/pos">
                  POS Home (Current Orders)
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/salesreport">
                  Sales Report
                </NavDropdown.Item>
                <NavDropdown.Item href="/inventory">Inventory</NavDropdown.Item>
                <NavDropdown.Item href="/menus">
                  View/Edit Menus
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="m-5">
        <h1 className="text-center">POS</h1>
      </div>
      <br />
      <div className="m-5">
        <h2>Current Orders</h2>
      </div>
      <div className="m-5">
        <table className="table table-sm table-responsive table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Client Username</th>
              <th className="text-center">Order</th>
              <th className="text-center">ETA</th>
              <th className="text-center">Sent to Kitchen</th>
              <th className="text-center">Send to Kitchen</th>
              <th className="text-center">Update ETA</th>
              <th className="text-center">Mark Order Completed</th>
            </tr>
          </thead>
          <tbody>
            {orders_json.map((order, i) => {
              return (
                <tr>
                  <td scope="row" width="10%">
                    {i + 1}
                  </td>
                  <td width="10%">
                    {order["attributes"]["person"]["username"]}
                  </td>
                  <td width="10%">
                    <ul>
                      {order["attributes"]["itemNames"].map((item) => {
                        return <li>{item}</li>;
                      })}
                    </ul>
                  </td>
                  <td className="text-center" width="10%">
                    {order["attributes"]["ETA"]}
                  </td>
                  <td className="text-center" width="10%">
                    {String(order["attributes"]["readyForKitchen"])}
                  </td>
                  <td className="text-center" width="10%">
                    <Button
                      variant="primary"
                      disabled={order["attributes"]["readyForKitchen"]}
                      onClick={(e) => {
                        sendToKitchen(i);
                      }}
                    >
                      Send
                    </Button>
                  </td>
                  <td className="text-center" width="10%">
                    <Button
                      variant="primary"
                      onClick={(e) => {
                        editETA(i);
                      }}
                    >
                      Edit ETA
                    </Button>
                  </td>
                  <td className="text-center" width="10%">
                    <Button
                      variant="success"
                      onClick={(e) => {
                        deleteOrder(i);
                      }}
                    >
                      Mark Completed
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order ETA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Form.Group className="mb-3" controlId="formETA">
              <Form.Label>Edit ETA</Form.Label>
              <Form.Control
                placeholder={orders_json[editNum]["attributes"]["ETA"]}
                onChange={(e) => {
                  setNewETA(e.target.value);
                }}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
