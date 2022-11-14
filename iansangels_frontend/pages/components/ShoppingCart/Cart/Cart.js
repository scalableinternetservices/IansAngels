import styles from "./Cart.module.css";
import React, { useEffect, useState } from "react";
import { css, jsx, Global } from "@emotion/react";
// import { ReactComponent as Right } from "../../Resources/image/arrowRight.svg";
// import { ReactComponent as Cross } from "../../Resources/image/cross.svg";
import { motion, AnimatePresence } from "framer-motion";
// import AnimatedCart from "../../Containers/AnimatedPage/AnimatedCart";
// import AnimatedCard from "../../Containers/AnimatedPage/AnimatedCard";
// import { slide as Menu } from "react-burger-menu";
import { slide as Menu } from "react-burger-menu";
import MenuData from "../../Menu/MenuData";
import Container from "react-bootstrap/Container";

const Cart = ({cart, setCart, cartOpened, setCartOpened}) =>{

  const [cartTotalPrice, setCartTotalPrice] = useState(0);

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
      background: "rgba(0, 0, 0, 0.3)",
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
      price += MenuData[item-1].price;
    })
    setCartTotalPrice((current)=> current=price);

    console.log("Cart updated, price:" + price);
  }

  useEffect(() => {
    updateCartPrice();
  }, [cart]);


  return(
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
                <motion.h5 className="item-title">{MenuData[item-1].title}</motion.h5>
                <motion.h5 className="item-price">${MenuData[item-1].price}</motion.h5>
              </motion.div>
              <button onClick={(e) => removeCartItem({i},e)}>Remove</button>
            </motion.div>
          </motion.div>
        ))}
        <motion.h5 className="item-title">Total Price: {cartTotalPrice}</motion.h5>
        </motion.div>

      </Menu>
     
  );
};

export default Cart;
