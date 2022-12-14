import style from "./Cart.module.css";
import React, { useEffect, useState } from "react";
import { css, jsx, Global } from "@emotion/react";
import Nav from "react-bootstrap/Nav";
// import Link from "next/link";
import { useRouter } from "next/router";
// import Button from '@mui/material/Button';
import Button from "@mui/material";
import Link from "@mui/material/Link";
import { loadStripe } from "@stripe/stripe-js";
import queryString from "query-string";

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
import Modal from "react-bootstrap/Modal";
import Stripe from "stripe";
import Cookies from "js-cookie";

const Cart = ({ cart, setCart, cartOpened, setCartOpened, setOrderSent }) => {
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [username, setUsername] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const router = useRouter();

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
    console.log("update cart state: " + state.isOpen);
    setCartOpened(state.isOpen);

    updateCartPrice();
  };

  const removeCartItem = ({ i, e }) => {
    console.log("removing index: " + i);
    // let newCart = cart.filter((_,index) => index !==i)
    // setCart([...newCart]);
    setCart((current) => current.filter((_, index) => index !== i));
    // setCart(cart.splice(i,1));
    updateCartPrice();
    console.log("Cart item removed, new cart:" + cart);
  };

  const updateCartPrice = (e) => {
    // updating cart price
    let price = 0;
    cart.forEach((item) => {
      price += item.price;
    });
    setCartTotalPrice((current) => (current = price));

    console.log("Cart updated, price:" + price);
  };

  var order = {
    ETA: 0,
    username: username,
    itemNames: [],
  };

  var orderRequestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  };

  const submitOrder = async (e) => {
    console.log("Submitting " + username + "'s cart" + cart);
    order.itemNames = cart.map((a) => a.title);
    orderRequestOptions.body = JSON.stringify(order);

    let userExisted = await checkUserExistPromise();
    if (userExisted) {
      console.log("user existed!");
      // setModalOpen(true);
    } else {
      console.log("user not exist");
      createUser();
      await timeout(1000);
    }

    // console.log("Sending Orders")
    // var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    // var endpoint = "/POS/orders";
    // fetch(rails_url+endpoint,orderRequestOptions) //fetch with no options does a get request to that endpoint
    //     .then(response => {
    //       console.log(response.json());
    //       // window.location.reload();
    //     })
    //     .catch(error => {
    //       console.error('There was an error!', error);
    //     });

    console.log(cart);

    // verify payment
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );

    let checkoutSessionID = await checkPaymentCompletedPromise();
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSessionID,
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      console.log("Payment Completed");
    }

    // router.push({
    //   pathname: "/client/[name]",
    //   query: {
    //     name: username,
    //     cart: JSON.stringify(cart),
    //     cartPrice: cartTotalPrice,
    //   },
    // });
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  var checkoutOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    body: JSON.stringify({
      cart: JSON.stringify(cart),
      redirectURL:
        "http://localhost:3000/client/" +
        username +
        "?" +
        queryString.stringify({
          // name: username,
          cart: JSON.stringify(cart),
          cartPrice: cartTotalPrice,
        }),
    }),
  };

  const checkPaymentCompletedPromise = function () {
    console.log("directing to checkout page");
    return new Promise(function (resolve, reject) {
      fetch("/api/checkout_sessions", checkoutOptions) //fetch with no options does a get request to that endpoint
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          resolve(data.id);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          reject(error);
        });
    });
  };

  const checkUserExistPromise = function () {
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/person";
    return new Promise(function (resolve, reject) {
      fetch(rails_url + endpoint) //fetch with no options does a get request to that endpoint
        .then((response) => {
          console.log("Checking if [" + username + "] existed");
          console.log(response);
          response.json().then((data) => {
            console.log(data);
            data["data"].map((person) => {
              console.log("Username: " + person.attributes.username);
              if (person.attributes.username == username) {
                resolve(true);
              }
            });
            resolve(false);
          });
        })
        .catch((error) => {
          console.error("There was an error!", error);
          reject(error);
        });
    });
  };

  const createUser = async () => {
    var createPersonRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: "password",
        email: "random_User_app@gmail.com",
        position: "client",
        completedOrders: [],
      }),
    };
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/createUser";
    fetch(rails_url + endpoint, createPersonRequestOptions) //fetch with no options does a get request to that endpoint
      .then((response) => {
        // window.location.reload();
        console.log("person created!");
        console.log(response.json());
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    setUsername(Cookies.get("user"));
  }, []);

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

  return (
    <motion.div
      className="MenuItems container"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <Modal show={modalOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Username Existed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please use a different username</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>

      <Menu
        styles={styles}
        right
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        customBurgerIcon={<img src="/static/img/cart.jpeg" />}
        onStateChange={(state) => updateCart(state)}
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
                <button onClick={(e) => removeCartItem({ i }, e)}>
                  Remove
                </button>
              </motion.div>
            </motion.div>
          ))}
          <motion.h5 className="item-title">
            Total Price: {cartTotalPrice}
          </motion.h5>

          <form>
            <label>
              Name:
              <input type="text" value={username} onChange={handleSubmit} />
            </label>
          </form>

          <Link component="button" onClick={() => submitOrder()}>
            Check Out
          </Link>
          {/* <form action="/api/checkout_sessions" method="POST">
      <section>
      <label>
            Name:
            <input type="text" value={username} onChange={handleSubmit}/>
          </label>
        <button type="submit" role="link">
          Checkout
        </button>
      </section>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </form> */}
        </motion.div>
      </Menu>
    </motion.div>
  );
};

export default Cart;
