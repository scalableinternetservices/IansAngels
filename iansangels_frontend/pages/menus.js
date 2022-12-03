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



export default function PosMenus() {

    const [menus_json, setMenus_json] = useState([]);
    const [numPages, setNumPages] = useState(0); //10 items per page
    const [page, setPage] = useState(1);

    useEffect(() => {
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/POS/menu";
        fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
            .then(response => 
                response.json().then(data => {
                    setMenus_json(data["data"])
                    setNumPages(Math.ceil(data["data"].length/10));
                    setLoading(false);
            }))
    }, [])

    const submitMenu = () => {
      console.log("submit Inventory");
      console.log("name: " + newName);
      console.log("price: " + newPrice);
      console.log("description: " + newDescription);
      console.log("category: " + newCategory);
      console.log("url: " + newURL);
      console.log("can order: " + newCanOrder);

      if(newName == "" || newPrice == "" || newDescription == "" || newCategory == "" || newURL == "" || newIngredients == ""){
          window.alert("Missing Field(s)");
          return;
      }

      var ing_arr = newIngredients.split(',');
      //console.log(ing_arr);

      const opts = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              "itemName": newName,
              "price": newPrice,
              "description": newDescription,
              "category": newCategory,
              "imageURL": newURL,
              "ingredients": ing_arr,
              "canOrder": newCanOrder,
          })
      };

      var rails_url = "http://localhost:3001";
      var endpoint = "/POS/menu";
      fetch(rails_url+endpoint, opts)
          .then(response => {
              window.location.reload();
          })

    }

    const deleteMenu = (i) => {
      console.log("delete " + i);
      var cur_name = menus_json[i]["attributes"]["itemName"];

      const opts = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              "itemName": cur_name,
          })
      };

      var rails_url = "http://localhost:3001";
      var endpoint = "/POS/menu";
      fetch(rails_url+endpoint, opts)
          .then(response => {
              window.location.reload();
          })
    }

  
    //var menus_json = getOrders();

    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newURL, setNewURL] = useState("");
    const [newIngredients, setNewIngredients] = useState("");
    const [newCanOrder, setNewCanOrder] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editNum, setEditNum] = useState(0);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleCloseSubmit = () => {
        console.log("submit new eta");
        console.log("new price: " + newPrice);
        console.log("new description: " + newDescription);
        console.log("new category: " + newCategory);
        console.log("new url: " + newURL);
        console.log("new can order: " + newCanOrder);
        var cur_name = menus_json[editNum]["attributes"]["itemName"];

        if(newPrice == "" || newDescription == "" || newCategory == "" || newURL == "" || newIngredients == ""){
          window.alert("You need to enter all fields");
          return;
        }

        var ing_arr = newIngredients.split(',');
        
        setShowModal(false);
        setEditNum(0);

        const opts = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "itemName": cur_name,
                "price": newPrice,
                "description": newDescription,
                "category": newCategory,
                "imageURL": newURL,
                "ingredients": ing_arr,
                "canOrder": newCanOrder,
            })
        };

        var rails_url = "http://localhost:3001";
        var endpoint = "/POS/menu";
        fetch(rails_url+endpoint, opts)
            .then(response => {
                window.location.reload();
            })
    }

    const editMenu = (i) => {
      setEditNum(i);
      console.log("edit menu item " + i);
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
      console.log(menus_json);
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
          <h1 className="text-center">Create New Menu Item</h1>
          <div className="row">
              <div className="col-3 text-center">
                  <h3>Enter Item Name</h3>
              </div>
              <div className="col-3 text-center">
                  <h3>Enter Price</h3>
              </div>
              <div className="col-3 text-center">
                  <h3>Enter Description</h3>
              </div>
              <div className="col-3 text-center">
                  <h3>Enter Category</h3>
              </div>
          </div>
          <Form>
          <div className="row">
              <div className="col-3 text-center">
                  <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Menu Item Name</Form.Label>
                      <Form.Control placeholder="Enter your new menu item name" onChange={(e) => {
                          setNewName(e.target.value);
                      }}/>
                  </Form.Group>
              </div>
              <div className="col-3 text-center">
                  <Form.Group className="mb-3" controlId="formPrice">
                      <Form.Label>Price</Form.Label>
                      <Form.Control placeholder="Enter price" onChange={(e) => {
                          setNewPrice(e.target.value);
                      }}/>
                  </Form.Group>
              </div>
              <div className="col-3 text-center">
                  <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control placeholder="Enter description" onChange={(e) => {
                          setNewDescription(e.target.value);
                      }}/>
                  </Form.Group>
              </div>
              <div className="col-3 text-center">
                  <Form.Group className="mb-3" controlId="formCategory">
                      <Form.Label>Category</Form.Label>
                      <Form.Control placeholder="Enter category" onChange={(e) => {
                          setNewCategory(e.target.value);
                      }}/>
                  </Form.Group>
              </div>
          </div>
          <br/>
          <div className="row">
              <div className="col-3 text-center">
                  <h3>Enter URL</h3>
              </div>
              <div className="col-3 text-center">
                  <h3>Enter Ingredients - comma seperated</h3>
              </div>
              <div className="col-3 text-center">
                  <h3>Currently Available for Order?</h3>
              </div>
          </div>
          <br/>
          <div className="row">
              <div className="col-3 text-center">
                  <Form.Group className="mb-3" controlId="formURL">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control placeholder="Enter image url" onChange={(e) => {
                          setNewURL(e.target.value);
                      }}/>
                  </Form.Group>
              </div>
              <div className="col-3 text-center">
                  <Form.Group className="mb-3" controlId="formIngredients">
                      <Form.Label>Ingredients - separate with commas, no spaces after commas</Form.Label>
                      <Form.Control placeholder="ingredient 1,ingredient 2,etc,no spaces after commas" onChange={(e) => {
                          setNewIngredients(e.target.value);
                      }}/>
                  </Form.Group>
              </div>
              <div className="col-3">
                  <Form.Group className="mb-3" controlId="formCanOrder">
                    <Form.Check type="checkbox" label="Available To Order" checked={newCanOrder} onChange={(e) => {
                      //setNewCanOrder(e.target.checked);
                      setNewCanOrder(!newCanOrder);
                    }}/>
                  </Form.Group>
              </div>
          </div>
          <div className="row">
              <div className="col-3 text-center">
              <Button variant="primary" onClick={(e) => {submitMenu()}}>Submit</Button>
              </div>
          </div>
          </Form>
          <br/>
        </div>
        <div className="m-5">
          <h2>Menus</h2>
        </div>
        <div className="m-5">
          <table className="table table-sm table-responsive table-hover table-striped">
              <thead>
                  <tr>
                      <th className="text-center"></th>
                      <th className="text-center">Item Name</th>
                      <th className="text-center">Item Description</th>
                      <th className="text-center">Ingredients</th>
                      <th className="text-center">Category</th>
                      <th className="text-center">Available to Order</th>
                      <th className="text-center">Image</th>
                      <th className="text-center">Edit Menu Item</th>
                      <th className="text-center">Delete Menu Item</th>
                  </tr>
              </thead>
              <tbody>
                  {menus_json.slice((page-1)*10, Math.min(page*10, menus_json.length)).map((menu, i) => {
                      return (
                          <tr>
                              <td scope="row" width="5%">{(page-1)*10+i+1}</td>
                              <td width="10%">{menu["attributes"]["itemName"]}</td>
                              <td width="20%">{menu["attributes"]["description"]}</td>
                              <td className="text-center" width="15%">
                                <ul>
                                  {menu["attributes"]["ingredients"].map((ingredient) => {
                                    return <li>{ingredient}</li>;
                                  })}
                                </ul>
                              </td>
                              <td className="text-center" width="10%">{menu["attributes"]["category"]}</td>
                              <td className="text-center" width="5%">{menu["attributes"]["canOrder"]?
                                "True"
                                :
                                "False"
                              }</td>
                              <td className="text-center" width="10%">{menu["attributes"]["imageURL"]}</td>
                              <td className="text-center" width="10%">
                                  <Button variant="secondary" onClick={(e) => {editMenu((page-1)*10 + i)}}>Edit Item</Button>
                              </td>
                              <td className="text-center" width="10%">
                                  <Button variant="danger" onClick={(e) => {deleteMenu((page-1)*10 + i)}}>Delete Item</Button>
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
            <Modal.Title>Edit Menu Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <Form.Group className="mb-3" controlId="formPrice">
                <Form.Label>Edit Price</Form.Label>
                <Form.Control placeholder={menus_json[editNum]["attributes"]["price"]} onChange={(e) => {
                  setNewPrice(e.target.value);
                }}/>
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Edit Description</Form.Label>
                <Form.Control placeholder={menus_json[editNum]["attributes"]["description"]} onChange={(e) => {
                  setNewDescription(e.target.value);
                }}/>
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="mb-3" controlId="formCategory">
                <Form.Label>Edit Category</Form.Label>
                <Form.Control placeholder={menus_json[editNum]["attributes"]["category"]} onChange={(e) => {
                  setNewCategory(e.target.value);
                }}/>
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="mb-3" controlId="formURL">
                <Form.Label>Edit Image URL</Form.Label>
                <Form.Control placeholder={menus_json[editNum]["attributes"]["imageURL"]} onChange={(e) => {
                  setNewURL(e.target.value);
                }}/>
              </Form.Group>
            </div>
            <div classNme="row">
              <Form.Group className="mb-3" controlId="formIngredients">
                <Form.Label>Ingredients - separate with commas, no spaces after commas</Form.Label>
                <Form.Control placeholder="ingredient 1,ingredient 2,etc,no spaces after commas" onChange={(e) => {
                    setNewIngredients(e.target.value);
                }}/>
              </Form.Group>
            </div>
            <div>
            <Form.Group className="mb-3" controlId="formCanOrder">
              <Form.Check type="checkbox" label="Available To Order" checked={newCanOrder} onChange={(e) => {
                  //setNewCanOrder(e.target.checked);
                  setNewCanOrder(!newCanOrder);
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
  