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



export default function PosSales() {
    const [sales_json, setSales_json] = useState([]);

    useEffect(() => {
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/POS/sales";
        fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
            .then(response => 
                response.json().then(data => {
                    setSales_json(data)
                    setLoading(false);
            }))
    }, [])

    //var orders_json = getOrders();

    const [loading, setLoading] = useState(true);

    if(loading){
      return <h1>Loading</h1>
    }
    /*else{
      console.log(sales_json);
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
          <h1 className="text-center">Sales Report</h1>
          <br/>
          <div className="row">
              <div className="col-3 text-center">
                  <h3>Total Sales: ${sales_json["totalMoney"]}</h3>
              </div>
              <div className="col-3 text-center">
                  <h3>Top Selling Item: "{sales_json["mostPopularItem"]}" ({sales_json["mostPopularItemCount"]} total sales)</h3>
              </div>
              <div className="col-3 text-center">
                  <h3>Sales For All Items:</h3>
                  <ul>
                    {sales_json["totalOrders"].map((item) => {
                      return <li>"{item["order"]}":   {item["amount"]} total sales</li>;
                    })}
                  </ul>
              </div>
              <div className="col-3 text-center">
                  <h3>Total Ingredients Used:</h3>
                  <ul>
                    {sales_json["totalIngredients"].map((item) => {
                      return <li>"{item["ingredient"]}":   {item["amount"]} total used</li>;
                    })}
                  </ul>
              </div>
          </div>
        </div>
        <br/>
      </div>
    )
  }
  