import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


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


const getOrders = () => {
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
}


export default function Home() {
  var orders_json = getOrders();

  const editETA = (i) => {
      console.log("edit eta " + i);
  }


  return (
    <div>
      <div className="m-5">
        <h1 className="text-center">POS</h1>
      </div>
      <div className="m-5">
          <table className="table table-sm table-responsive table-hover table-striped">
              <thead>
                  <tr>
                      <th className="text-center"></th>
                      <th className="text-center">Client User ID</th>
                      <th className="text-center">Order</th>
                      <th className="text-center">ETA</th>
                      <th className="text-center">Update ETA</th>
                  </tr>
              </thead>
              <tbody>
                  {orders_json.map((order, i) => {
                      return (
                          <tr>
                              <td scope="row">{i+1}</td>
                              <td width="10%">{order["iduser"]}</td>
                              <td width="10%">{order["order"]}</td>
                              <td className="text-center" width="25%">{order["eta"]}</td>
                              <td className="text-center" width="10%">
                                  <Button variant="secondary" onClick={(e) => {editETA(i)}}>Edit ETA</Button>
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
