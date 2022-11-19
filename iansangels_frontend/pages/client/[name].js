import React, { useEffect, useState, useRef } from "react";
import { css, jsx, Global } from "@emotion/react";
import Nav from 'react-bootstrap/Nav';
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



export  const getServerSideProps= (context)=> {
    return {
        props: { 
           name: context.query.name,
        //    cart: context.query.cart
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
    // const [orderCompleted, setOrderCompleted] = useState(false);
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


    console.log("ClientName: " + props.name);
    // orders_json.map((order, i)=>{
    //     if(order.attributes.person.username == props.name){
    //         setETA(order.ETA);
    //         console.log("ETA: "+ETA);
    //     }
    // })
    const container = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
        },
      };

    useInterval(async () => {
        fetchETA();
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

    const handleClose = () => setModalOpen(false);
    const handleShow = () => setModalOpen(true);

    return(
    //     <motion.div 
    //         className="MenuItems container"
    //         variants={container}
    //         initial="hidden"
    //         animate="visible"
    //         >

    //         <motion.div
    //             className="menu-items"
    //             key={item.id}
    //             variants={itemContainer}
    //             transition={{ delay: i * 0.2 }}
    //         >

    //         {cart.map((item, i) => (
    //                 <motion.div
    //                     className="menu-items"
    //                     key={item.id}
    //                     variants={itemContainer}
    //                     transition={{ delay: i * 0.2 }}
    //                 >
    //         {/* <img src={item.imageSrc} alt="food burger" /> */}
    //         <motion.div className="item-content" key={i}>
    //           <motion.div className="item-title-box">
    //             <motion.h5 className="item-title">{item.title}</motion.h5>
    //             <motion.h5 className="item-price">${item.price}</motion.h5>
    //           </motion.div>
    //           <button onClick={(e) => removeCartItem({i},e)}>Remove</button>
    //         </motion.div>
    //       </motion.div>
    //     ))}
    //         <div>
    //             <h2> Order for: {props.name} </h2>
    //             <h2> ETA: {ETA} </h2>
    //         </div>
    //         </motion.div>


    //   </motion.div>

        <div>

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
        <h2> Order for: {props.name} </h2>
       
        <h2> ETA: {showETA ? ETA : "calculating"} </h2>
       
        </div>

        
        
    )
}

export default ETA