import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { css, jsx, Global } from "@emotion/react";
import Nav from 'react-bootstrap/Nav';
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useRouter } from "next/router";

import { loadStripe } from '@stripe/stripe-js';
import {PaymentElement, useStripe, useElements} from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export  const getServerSideProps= (context)=> {
    return {
        props: { 
           name: context.query.name,
           cart: JSON.parse(context.query.cart),
           cartPrice: context.query.cartPrice,
        }
    }
}

export function useInterval(callback, delay) {
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

const ETA = (props) => {


    const [orders_json, setOrders_json] = useState([]);
    const [ETA, setETA] = useState(0);
    const [showETA, setShowETA] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [cancelOrderModalOpen, setCancelOrderModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const [cardNumber, setCardNumber] = useState(0);
    const [balance, setBalance] = useState(50);
    const [isOrderPaid, setIsOrderPaid] = useState(false);

    const {asPath} = useRouter();

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
  
    const [message, setMessage] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    // const [clientSecret, setClientSecret] = React.useState("");


    const container = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
        },
      };

    useInterval(async () => {
        if(!cancelOrderModalOpen){
          fetchETA();
        }
    }, 2000)

    const fetchETA = () => {
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/POS/orders";
        
        fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
            .then(response => 
                response.json().then(data => {
                    setOrders_json(data["data"]);
                    console.log(data);
                    // setOrderCompleted(true);
                    let orderCompleted = true;
                    data["data"].map((order, i)=>{
                        console.log("Order: "+order);
                        if(order.attributes.person.username === props.name){
                            console.log("Person: "+order.attributes.person.username);
                            // checking if the ETA is updated
                            if(order.attributes.ETA != 0){
                                setETA(order.attributes.ETA);
                                setShowETA(true);
                                console.log("ETA: "+ETA);
                            }
                            // if the ETA field still exists, the order is not yet completed
                            // setOrderCompleted(false);
                            orderCompleted = false;
                        }

                    })
                    console.log("OrderCompleted: ", orderCompleted);
                    if(orderCompleted){
                        console.log("Order is completed");
                        setModalOpen(true);
                    }
                    // console.log("ETA: "+ETA);
            }))
    }

    var cancelOrderRequestOpt = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: props.name}),
    }; 

    const handleCancelOrder = () => {
      var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
      var endpoint = "/client/order";
      fetch(rails_url+endpoint, cancelOrderRequestOpt)
        .then(response => {
          console.log(response.json());
        })
      console.log("order cancelled");
      setCancelOrderModalOpen(true);
    }

    const handlePayment = async (e) => {

      e.preventDefault();
      console.log("directing to payment page");

      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      setIsLoading(true);
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: asPath,
        },
      });
  
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
  
      setIsLoading(false);
    }

    const paymentElementOptions = {
      layout: "tabs",
    };


    return(
      

      <motion.div 
            className="MenuItems container"
            variants={container}
            initial="hidden"
            animate="visible"
            css={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        
        margin-top: 30px;
        padding: 40px 20px;
        background: #fff;
        border-radius: 50px;

        .menu-items {
          padding: 1rem 1.5rem;
          display: flex;
          border: #efefef 1px solid;
          border-top: none;

          &:last-child {
            border-bottom: none;
          }


          .item-content {
            display: grid;
            padding: 0 1rem;

            p {
              font-size: 0.8rem;
            }

            .item-title-box {
              display: flex;
              justify-content: space-between;

              .item-title,
              .item-price {
                font-size: 1rem;
               
              }
            }
          }
        }

        img {
          height: 85px;
          
          cursor: pointer;
        }
      `}
        >

        

        <Modal show={modalOpen} onHide={()=>setModalOpen(false)}>
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
                    <Button variant="primary" onClick={()=>setModalOpen(false)}>
                        Got it!
                    </Button>
                </Link>
            
            </Modal.Footer>
        </Modal>

        <Modal show={cancelOrderModalOpen} onHide={()=>setCancelOrderModalOpen(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Order Cancelled</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your Order is cancelled!</Modal.Body>
            <Modal.Footer>
                <Link 
                href="/client/client"
                // href="client/ETA"
                passHref legacyBehavior
                > 
                    <Button variant="primary" onClick={()=>setCancelOrderModalOpen(false)}>
                        Got it!
                    </Button>
                </Link>
            
            </Modal.Footer>
        </Modal>

        <Modal show={paymentModalOpen} onHide={()=>setPaymentModalOpen(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Order Failed</Modal.Title>
            </Modal.Header>
            <Modal.Body>You're Broke!</Modal.Body>
            <Modal.Footer>
                
              <Button variant="primary" onClick={()=>setPaymentModalOpen(false)}>
                  Got it!
              </Button>
            
            </Modal.Footer>
        </Modal>

        <h2> Order for: {props.name} </h2>



        {props.cart.map((item, i) => (
        <motion.div
            className="menu-items"
            key={item.id}
            variants={itemContainer}
            transition={{ delay: i * 0.2 }}
          >
            <img src={item.imgURL} alt="food burger" width={200} height={150}/>
          
            <motion.div className="item-content">
              <motion.div className="item-title-box">
                <motion.h5 className="item-title">{item.title}</motion.h5>
                <motion.h5 className="item-price">${item.price}</motion.h5>
              </motion.div>
             
            </motion.div>
        </motion.div>
        ))}

        <h2> Total: ${props.cartPrice} </h2>



        <div>

        
       <h2> ETA: {showETA 
       ? (<>  {ETA} Minutes  <br></br>
        </>)
       : (<> Order Processing  <br></br>
       <Button variant="primary" onClick={()=>handleCancelOrder()}>
         Cancel Order
        </Button> </>)} </h2>
            


        </div>


        </motion.div>
        
        
        
    )
}

export default ETA