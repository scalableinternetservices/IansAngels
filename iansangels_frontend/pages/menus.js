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



export default function PosMenus() {

    const [menus_json, setMenus_json] = useState([]);

    useEffect(() => {
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/POS/menu";
        fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
            .then(response => 
                response.json().then(data => {
                    setMenus_json(data["data"])
                    setLoading(false);
            }))
    }, [])

  
    //var menus_json = getOrders();

    const [loading, setLoading] = useState(true);

    const editMenu = (i) => {
      console.log("edit menu item " + i);
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
                <Nav.Link href="/pos">POS Home</Nav.Link>
                <Nav.Link href="/salesreport">Sales Report</Nav.Link>
                <Nav.Link href="/inventory">Inventory</Nav.Link>
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
                  </tr>
              </thead>
              <tbody>
                  {menus_json.map((menu, i) => {
                      return (
                          <tr>
                              <td scope="row" width="5%">{i+1}</td>
                              <td width="10%">{menu["attributes"]["itemName"]}</td>
                              <td width="30%">{menu["attributes"]["description"]}</td>
                              <td width="20%">{menu["attributes"]["ingredients"][0]}</td>
                              <td className="text-center" width="10%">{menu["attributes"]["category"]}</td>
                              <td className="text-center" width="5%">{() => {
                                if(menu["attributes"]["canOrder"]){
                                  return "True";
                                }
                                else{
                                  return "False";
                                }
                              }}</td>
                              <td className="text-center" width="10%">{menu["attributes"]["imageURL"]}</td>
                              <td className="text-center" width="10%">
                                  <Button variant="secondary" onClick={(e) => {editMenu(i)}}>Edit Menu Item</Button>
                              </td>
                          </tr>
                      )
                  })}
              </tbody>
          </table>
        </div>
      </div>
    )
  }
  