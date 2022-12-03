import { useState, useEffect,useRef } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Pagination from '@mui/material/Pagination';

export default function Kitchen() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [editETAOrder, setEditETAOrder] = useState(0);
  const [editETAValue, setEditETAValue] = useState(0);
  const [completeOrder, setCompleteOrder] = useState(0);
  const [ordersJson, setOrdersJson] = useState([]);
  const [numPages, setNumPages] = useState(0); //10 items per page
  const [page, setPage] = useState(1);


  function useInterval(callback, delay) {
    const savedCallback = useRef() ;
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
            }
        }
    }, [callback, delay]);
}

useInterval(async () => {
    getOrders();
}, 2000)

  const handleETAChange = (event) => {
    setEditETAValue(event.target.value);
  };

  const submitEditETA = () => {
    setShowEditModal(false);
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
        const orders = [...ordersJson];
        const idx = ordersJson.findIndex((el) => el.id == editETAOrder.id);
        orders[idx].attributes.ETA = editETAValue;
        setOrdersJson(orders);
        // window.location.reload();
      });
  };

  const submitComplete = () => {
    setShowCloseModal(false);
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/kitchen";

    fetch(rails_url + endpoint, {
      method: "DELETE",
      body: JSON.stringify({
        username: completeOrder.attributes.person.username,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then(() => {
      const orders = ordersJson.filter((el) => el.id != completeOrder.id);
      setOrdersJson(orders);
    });
  };

  const getOrders = () => {
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/kitchen";
    fetch(rails_url + endpoint) //fetch with no options does a get request to that endpoint
      .then((response) =>
        response.json().then((data) => {
          let orders = data.data;
          orders.sort((a, b) => a.id - b.id);
          setOrdersJson(orders);
          setNumPages(Math.ceil(data["data"].length/10));
          setPage(1);
        })
      );
  };

  useEffect(() => {
    getOrders();
  }, []);

  const editETA = (order) => {
    console.log("edit eta " + order.id);
    setEditETAOrder(order);
    setEditETAValue(order.attributes.ETA);
    setShowEditModal(true);
  };

  const changePage = (page) => {
    console.log(page);
    setPage(page);
  }

  const complete = (order) => {
    setCompleteOrder(order);
    setShowCloseModal(true);
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
                <Nav.Link href="/client/client">Client</Nav.Link>
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
                <th className="text-center">Client Name</th>
                <th className="text-center">Order</th>
                <th className="text-center">ETA</th>
                <th className="text-center">Update ETA</th>
                <th className="text-center">Complete</th>
              </tr>
            </thead>
            <tbody>
              {console.log(ordersJson)}
              {ordersJson &&
                ordersJson.slice((page-1)*10, Math.min(page*10, ordersJson.length)).map((order, i) => {
                  if (order.attributes.readyForKitchen)
                    return (
                      <tr>
                        <td scope="row">{order.id}</td>
                        <td width="10%">{order.attributes.person.username}</td>
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
                        <td className="text-center" width="10%">
                          <Button
                            variant="success"
                            onClick={(e) => {
                              complete(order);
                            }}
                          >
                            Complete
                          </Button>
                        </td>
                      </tr>
                    );
                })}
            </tbody>
          </table>
          <Pagination count={numPages} color="primary" onChange={(e, page) => {changePage(page)}}/>
        </div>
      </div>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        animation={false}
      >
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
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={submitEditETA}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCloseModal}
        onHide={() => setShowCloseModal(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm order {completeOrder.id} complete</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCloseModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={submitComplete}>
            Complete Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
