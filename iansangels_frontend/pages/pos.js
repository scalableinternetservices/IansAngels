import React, { useEffect, useState } from "react";
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
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


/*
<Form>
<div className="row">
    <div className="col-3 text-center">
        <Form.Group className="mb-3" controlId="formUserId">
            <Form.Label>User Id</Form.Label>
            <Form.Control placeholder="Enter your User Id" onChange={(e) => {
                setNewUserId(e.target.value);
            }}/>
        </Form.Group>
    </div>
    <div className="col-3 text-center">
        <Form.Group className="mb-3" controlId="formPostId">
            <Form.Label>Post Id</Form.Label>
            <Form.Control placeholder="Enter your Post's Id (must be unique)" onChange={(e) => {
                setNewPostId(e.target.value);
            }}/>
        </Form.Group>
    </div>
    <div className="col-3 text-center">
        <Form.Group className="mb-3" controlId="formText">
            <Form.Label>Post Text</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter the text for your post" onChange={(e) => {
                setNewPostText(e.target.value);
            }}/>
        </Form.Group>
    </div>
    <div className="col-3 text-center">
        <Form.Group className="mb-3" controlId="formImageURL">
            <Form.Label>Image URL</Form.Label>
            <Form.Control placeholder="Enter your Image URL (if wanted)" onChange={(e) => {
                setNewPostURL(e.target.value);
            }}/>
        </Form.Group>
    </div>
</div>
<br/>
<div className="row">
    <div className="col-3 text-center">
    <Button variant="primary" onClick={(e) => {submitPost()}}>Submit</Button>
    </div>
</div>
</Form>
*/


/*
//useEffect runs when any object given in the array at the end re-renders, when array is empty it runs on initial page render. Here we grab initial data
useEffect(() => {
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/posts";
        fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
            .then(response => 
                response.json().then(data => {
                    setPosts_json(data["data"])
                    setLoading(false);
            }))
    }, [])

    const submitPost = () => { //hook function up to a button or whatever
        console.log("submit post");
        console.log("uid: " + newUserId);
        console.log("pid: " + newPostId);
        console.log("ptxt: " + newPostText);
        console.log("purl: " + newPostURL);

        if(newUserId == "" || newPostId == ""){
            window.alert("Missing Ids");
            return;
        }

        const opts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ //object to be posted
                "user_id": newUserId, //newUserId,etc are state objects made with useState() that we set to be the value we want push to db
                "idpost": newPostId,
                "text": newPostText,
                "imageurl": newPostURL,
            })
        };

        var rails_url = "http://localhost:3001";
        var endpoint = "/posts";
        fetch(rails_url+endpoint, opts) //give it options to do post/patch/delete requests
            .then(response => {
                window.location.reload();
            })

    }

    const deletePost = (i) => {
        console.log("delete " + i);

        const opts = {
            method: 'DELETE',
        };

        var rails_url = "http://localhost:3001";
        var endpoint = "/posts/"+i;          //talk with erwan for the endpoint here, needs to refer to the specific entry in db to delete
        fetch(rails_url+endpoint, opts)
            .then(response => {
                window.location.reload();
            })
    }
*/

/*
const handleCloseSubmit = () => {
        console.log("submit edit");
        console.log("uid: " + newUserId);
        console.log("pid: " + newPostId);
        console.log("ptxt: " + newPostText);
        console.log("purl: " + newPostURL);

        if(newUserId == "" || newPostId == ""){
            window.alert("Missing Ids");
            return;
        }
        
        setShowModal(false);

        const opts = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "user_id": newUserId,
                "idpost": newPostId,
                "text": newPostText,
                "imageurl": newPostURL,
            })
        };

        var rails_url = "http://localhost:3001";
        var endpoint = "/posts/"+posts_json[editNum]["attributes"]["idpost"]; //talk with erwan for the endpoint here, needs to refer to the specific entry in db to update
        fetch(rails_url+endpoint, opts)
            .then(response => {
                window.location.reload();
            })
    }
*/


/*const getOrders = () => {
    var orders_json = [
        {
          "iduser": 1,
          "order": "hamburger",
          "eta": 15,
        },
        {
          "iduser": 5,
          "order": "pizza",
          "eta": 25,
        }
    ];
    return orders_json;
}*/


export default function Pos() {

    const [orders_json, setOrders_json] = useState([]);

    useEffect(() => {
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/POS/orders";
        fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
            .then(response => 
                response.json().then(data => {
                    setOrders_json(data["data"])
                    setLoading(false);
            }))
    }, [])

    const deleteOrder = (i) => {
      console.log("delete " + i);
      var cur_name = orders_json[i]["attributes"]["person"]["username"];

      const opts = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              "username": cur_name,
          })
      };

      var rails_url = "http://localhost:3001";
      var endpoint = "/POS/orders";
      fetch(rails_url+endpoint, opts)
          .then(response => {
              window.location.reload();
          })
    }

  
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

        if(newETA == ""){
            window.alert("You need to enter a new ETA");
            return;
        }
        
        setShowModal(false);
        setEditNum(0);

        const opts = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "username": uname,
                "ETA": newETA,
            })
        };

        var rails_url = "http://localhost:3001";
        var endpoint = "/POS/orders";
        fetch(rails_url+endpoint, opts)
            .then(response => {
                window.location.reload();
            })
    }

  const editETA = (i) => {
    setEditNum(i);
    console.log("edit eta " + i);
    handleShow();
  }


  if(loading){
    return <h1>Loading</h1>
  }
  /*else{
    console.log(orders_json);
  }*/

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Ian's Angels All-In-One Restaurant WebApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/salesreport">Sales Report</Nav.Link>
              <Nav.Link href="/inventory">Inventory</Nav.Link>
              <Nav.Link href="/menus">View/Edit Menus</Nav.Link>
              <Nav.Link href="/client">Client</Nav.Link>
              <Nav.Link href="/kitchen">Kitchen</Nav.Link>
              <NavDropdown title="POS Pages" id="basic-nav-dropdown">
                <NavDropdown.Item href="/pos">POS Home (Current Orders)</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/salesreport">Sales Report</NavDropdown.Item>
                <NavDropdown.Item href="/inventory">Inventory</NavDropdown.Item>
                <NavDropdown.Item href="/menus">View/Edit Menus</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="m-5">
        <h1 className="text-center">POS</h1>
      </div>
      <br/>
      <div className="m-5">
        <h2>Current Orders</h2>
      </div>
      <div className="m-5">
          <table className="table table-sm table-responsive table-hover table-striped">
              <thead>
                  <tr>
                      <th className="text-center"></th>
                      <th className="text-center">Client Username</th>
                      <th className="text-center">Order</th>
                      <th className="text-center">ETA</th>
                      <th className="text-center">Update ETA</th>
                      <th className="text-center">Mark Order Completed</th>
                  </tr>
              </thead>
              <tbody>
                  {orders_json.map((order, i) => {
                      return (
                          <tr>
                              <td scope="row">{i+1}</td>
                              <td width="10%">{order["attributes"]["person"]["username"]}</td>
                              <td width="10%">
                                <ul>
                                  {order["attributes"]["itemNames"].map((item) => {
                                    return <li>{item}</li>;
                                  })}
                                </ul>
                              </td>
                              <td className="text-center" width="25%">{order["attributes"]["ETA"]}</td>
                              <td className="text-center" width="10%">
                                  <Button variant="secondary" onClick={(e) => {editETA(i)}}>Edit ETA</Button>
                              </td>
                              <td className="text-center" width="10%">
                                  <Button variant="primary" onClick={(e) => {deleteOrder(i)}}>Mark Completed</Button>
                              </td>
                          </tr>
                      )
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
              <Form.Control placeholder={orders_json[editNum]["attributes"]["ETA"]} onChange={(e) => {
                setNewETA(e.target.value);
              }}/>
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
  )
}
