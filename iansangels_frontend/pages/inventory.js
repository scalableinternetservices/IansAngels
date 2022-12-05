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
import Pagination from '@mui/material/Pagination';



export default function PosInventory() {

    const [inventories_json, setInventories_json] = useState([]);
    const [numPages, setNumPages] = useState(0); //10 items per page
    const [page, setPage] = useState(1);

    useEffect(() => {
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/POS/inventory";
        fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
            .then(response => 
                response.json().then(data => {
                    setInventories_json(data["data"]);
                    setNumPages(Math.ceil(data["data"].length/10));
                    setLoading(false);
            }))
    }, [])

    const submitInventory = () => {
      console.log("submit Inventory");
      console.log("name: " + newItemName);
      console.log("quantity: " + newQuantity);

      if(newItemName == "" || newQuantity == ""){
          window.alert("Missing Field(s)");
          return;
      }

      const opts = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              "foodName": newItemName,
              "quantity": newQuantity,
          })
      };

      var rails_url = "http://localhost:3001";
      var endpoint = "/POS/inventory";
      fetch(rails_url+endpoint, opts)
          .then(response => {
              window.location.reload();
          })

    }

    const deleteInventory = (i) => {
      console.log("delete " + i);
      var cur_name = inventories_json[i]["attributes"]["foodName"];

      const opts = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              "foodName": cur_name,
          })
      };

      var rails_url = "http://localhost:3001";
      var endpoint = "/POS/inventory";
      fetch(rails_url+endpoint, opts)
          .then(response => {
              window.location.reload();
          })
    }

  
    //var inventories_json = getOrders();

    const [loading, setLoading] = useState(true);

    const [newItemName, setNewItemName] = useState("");
    const [newQuantity, setNewQuantity] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editNum, setEditNum] = useState(0);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleCloseSubmit = () => {
        console.log("submit new quantity");
        console.log("new quantity: " + newQuantity);
        var cur_name = inventories_json[editNum]["attributes"]["foodName"];

        if(newQuantity == ""){
            window.alert("You need to enter a new Quantity");
            return;
        }
        
        setShowModal(false);
        setEditNum(0);

        const opts = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "foodName": cur_name,
                "quantity": newQuantity,
            })
        };

        var rails_url = "http://localhost:3001";
        var endpoint = "/POS/inventory";
        fetch(rails_url+endpoint, opts)
            .then(response => {
                window.location.reload();
            })
    }

    const editInventory = (i) => {
      setEditNum(i);
      console.log("edit inventory item " + i);
      handleShow();
    }

    const changePage = (page) => {
      console.log(page);
      setPage(page);
    }


    if(loading){
      return <h1>Loading</h1>
    }
    /*else{
      console.log(inventories_json);
    }*/
  
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">Ian's Angels All-In-One Restaurant WebApp</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
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
        <div className="m-5 border border-dark">
          <h1 className="text-center">Create New Inventory Item</h1>
          <div className="row">
              <div className="col-3 text-center">
                  <h3>Enter Food Name</h3>
              </div>
              <div className="col-3 text-center">
                  <h3>Enter Current Quantity</h3>
              </div>
          </div>
          <Form>
          <div className="row">
              <div className="col-3 text-center">
                  <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Food Item Name</Form.Label>
                      <Form.Control placeholder="Enter your new Food Item name" onChange={(e) => {
                          setNewItemName(e.target.value);
                      }}/>
                  </Form.Group>
              </div>
              <div className="col-3 text-center">
                  <Form.Group className="mb-3" controlId="formQuantity">
                      <Form.Label>Current Quantity</Form.Label>
                      <Form.Control placeholder="Enter your current quantity" onChange={(e) => {
                          setNewQuantity(e.target.value);
                      }}/>
                  </Form.Group>
              </div>
          </div>
          <br/>
          <div className="row">
              <div className="col-3 text-center">
              <Button variant="primary" onClick={(e) => {submitInventory()}}>Submit</Button>
              </div>
          </div>
          </Form>
          <br/>
      </div>
      <div className="m-5"></div>
        <div className="m-5">
          <h2>Inventory</h2>
        </div>
        <div className="m-5">
          <table className="table table-sm table-responsive table-hover table-striped">
              <thead>
                  <tr>
                      <th className="text-center"></th>
                      <th className="text-center">Item Name</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Edit Inventory Item</th>
                      <th className="text-center">Delete Inventory Item</th>
                  </tr>
              </thead>
              <tbody>
                  {inventories_json.slice((page-1)*10, Math.min(page*10, inventories_json.length)).map((inventory, i) => {
                      return (
                          <tr>
                              <td scope="row" width="5%">{(page-1)*10+i+1}</td>
                              <td className="text-center" width="30%">{inventory["attributes"]["foodName"]}</td>
                              <td className="text-center" width="10%">{inventory["attributes"]["quantity"]}</td>
                              <td className="text-center" width="10%">
                                  <Button variant="secondary" onClick={(e) => {editInventory((page-1)*10 + i)}}>Edit Item</Button>
                              </td>
                              <td className="text-center" width="10%">
                                  <Button variant="danger" onClick={(e) => {deleteInventory((page-1)*10 + i)}}>Delete Item</Button>
                              </td>
                          </tr>
                      )
                  })}
              </tbody>
          </table>
          <Pagination count={numPages} color="primary" onChange={(e, page) => {changePage(page)}}/>
        </div>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Inventory Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <Form.Group className="mb-3" controlId="formQuantity">
                <Form.Label>Edit Quantity</Form.Label>
                <Form.Control placeholder={inventories_json[editNum]["attributes"]["quantity"]} onChange={(e) => {
                  setNewQuantity(e.target.value);
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
  