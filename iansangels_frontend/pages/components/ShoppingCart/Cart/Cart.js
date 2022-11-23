import style from "./Cart.module.css";
import React, { useEffect, useState } from "react";
import { css, jsx, Global } from "@emotion/react";
import Nav from 'react-bootstrap/Nav';
import Link from "next/link";
import { useRouter } from "next/router";
import Button from '@mui/material/Button';
// import Button from 'components/CustomButtons/Button.js';

// import { ReactComponent as Right } from "../../Resources/image/arrowRight.svg";
// import { ReactComponent as Cross } from "../../Resources/image/cross.svg";
import { motion, AnimatePresence } from "framer-motion";
// import AnimatedCart from "../../Containers/AnimatedPage/AnimatedCart";
// import AnimatedCard from "../../Containers/AnimatedPage/AnimatedCard";
// import { slide as Menu } from "react-burger-menu";
import { slide as Menu } from "react-burger-menu";
import MenuData from "../../Menu/MenuData";
import Container from "react-bootstrap/Container";
import { create } from "@mui/material/styles/createTransitions";
import Modal from 'react-bootstrap/Modal';


const Cart = ({cart, setCart, cartOpened, setCartOpened, setOrderSent}) =>{

  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [username, setUsername] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const itemContainer = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const styles = {
    bmBurgerButton: {
      position: "fixed",
      width: "36px",
      height: "30px",
      right: "36px",
      top: "72px",
    },
    bmBurgerBars: {
      background: "#373a47",
    },
    bmBurgerBarsHover: {
      background: "#a90000",
    },
    bmCrossButton: {
      height: "24px",
      width: "24px",
    },
    bmCross: {
      background: "#bdc3c7",
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
    },
    bmMenu: {
      background: "#373a47",
      padding: "2.5em 1.5em 0",
      fontSize: "1.15em",
    },
    bmMorphShape: {
      fill: "#373a47",
    },
    bmItemList: {
      color: "#b8b7ad",
      padding: "0.8em",
    },
    bmItem: {
      display: "inline-block",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0)",
    },
  };
  const updateCart = (state) => {

    // updating cart list
    console.log(cart);
    setCart(cart);
    // setCartOpened(!cartOpened);
    console.log("update cart state: " + state.isOpen)
    setCartOpened(state.isOpen)

    updateCartPrice();
  }

  const removeCartItem = ({i,e}) => {
    console.log("removing index: "+i);
    // let newCart = cart.filter((_,index) => index !==i)
    // setCart([...newCart]);
    setCart((current) => current.filter((_,index) => index !==i))
    // setCart(cart.splice(i,1));
    updateCartPrice();
    console.log("Cart item removed, new cart:" + cart);
  }

  const updateCartPrice = (e) => {
    // updating cart price
    let price = 0;
    cart.forEach((item) => {
      price += item.price;
    })
    setCartTotalPrice((current)=> current=price);

    console.log("Cart updated, price:" + price);
  }

  var order = { 
    "ETA": 0,
    "username": username,
    "itemNames": [],
  }


  var orderRequestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  }; 

  const submitOrder = () => {
    console.log("Submitting cart" + cart);
    order.itemNames = cart.map(a => a.title);
    orderRequestOptions.body = JSON.stringify(order);


    if(!checkUserExist(order.username)){
      console.log("user not exist")
      createUser();
    }else {
      console.log("user existed!")
      setModalOpen(true);
    }

    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/POS/orders";
    fetch(rails_url+endpoint,orderRequestOptions) //fetch with no options does a get request to that endpoint
        .then(response => {
          console.log(response.json());
          // window.location.reload();
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
      
    
  }

  const checkUserExist = () => {
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/person";
    fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
        .then(response => {
          response.json().then(data => {
            console.log(data["data"]);
            data["data"].map((person) => {
              if(person.attributes.username == order.username){
                return true;
              }
            })
            return false;
          }
          )
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
  }

  var createPersonRequestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: ""
  }; 

  const createUser = () => {
    createPersonRequestOptions.body = JSON.stringify({
      "username": order.username,
      "password": "password",
      "email": "random_User_app@gmail.com",
      "position": "client",
      "completedOrders": []
    });
    console.log("creating user:" + order.username);
    console.log(createPersonRequestOptions);


    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/createUser";
    fetch(rails_url+endpoint,createPersonRequestOptions) //fetch with no options does a get request to that endpoint
        .then(response => {
          console.log(response.json());
          // window.location.reload();
        })
        .catch(error => {
          console.error('There was an error!', error);
        });

  }

  useEffect(() => {
    updateCartPrice();
  }, [cart]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const handleSubmit = (e) => {
    setUsername(e.target.value);
  };

  const handleClose = () => setModalOpen(false);

  return(
    <motion.div 
      className="MenuItems container"
      variants={container}
      initial="hidden"
      animate="visible"
      >
      <Modal show={modalOpen} onHide={handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Order Completed</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your Order is on the way!</Modal.Body>
          <Modal.Footer>
              <Link 
              href="/client/client"
              // href="client/ETA"
              passHref legacyBehavior
              > 
                  <Button variant="primary" onClick={handleClose}>
                      Got it!
                  </Button>
              </Link>
          
          </Modal.Footer>
      </Modal>


      <Menu
        styles={styles}
        right
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        customBurgerIcon={<img src="/static/img/cart.jpeg" />}
        onStateChange={ (state) => updateCart(state) }
        isOpen={cartOpened}
      
      >

        <h3>Cart</h3>
        <motion.div>
        
        {cart.map((item, i) => (
          <motion.div
            className="menu-items"
            key={item.id}
            variants={itemContainer}
            transition={{ delay: i * 0.2 }}
          >
            {/* <img src={item.imageSrc} alt="food burger" /> */}
            <motion.div className="item-content" key={i}>
              <motion.div className="item-title-box">
                <motion.h5 className="item-title">{item.title}</motion.h5>
                <motion.h5 className="item-price">${item.price}</motion.h5>
              </motion.div>
              <button onClick={(e) => removeCartItem({i},e)}>Remove</button>
            </motion.div>
          </motion.div>
        ))}
        <motion.h5 className="item-title">Total Price: {cartTotalPrice}</motion.h5>
        {/* <button onClick={routeChange}>Check Out</button> */}
        {/* <Nav.Link href="/client/checkout">Check Out</Nav.Link> */}
        {/* <button onClick={submitOrder}>Submit Order</button> */}
        <Link 
          href={{
            pathname:"/client/[name]", 
            query: {
              name: order.username,
              cart: cart
            },
          }}
          // href="client/ETA"
          passHref legacyBehavior
        >
          {/* <SubmitOrderButton /> */}
          {/* <form onSubmit={()=> submitOrder()}>
            <label>
              Name:
              <input type="text" value={order.username} />
            </label>
            <input type="submit" value="Submit" />
          </form> */}
          <Button variant="contained" onClick={()=> submitOrder()}>
            Submit Order
          </Button>
        </Link>

        <form onSubmit={()=> submitOrder()}>
            <label>
              Name:
              <input type="text" value={order.username} onChange={handleSubmit}/>
            </label>
            <input type="submit" value="Save" />
          </form>

        
        </motion.div>
        
      </Menu>

    </motion.div>

    
     
  );
};

export default Cart;
