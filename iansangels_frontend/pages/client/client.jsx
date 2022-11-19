/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, Global } from "@emotion/react";
import { useState, useEffect } from "react";
import MenuItems from "../components/Menu/MenuItems";
// import MenuData from "./components/Menu/MenuData";
// import {menuData} from "./components/MenuData";
import Navbar from "../components/Menu/Navbar";

import Nav from "react-bootstrap/Nav";
import Navbar2 from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

// import { slide as Menu } from "react-burger-menu";
import Cart from "../components/ShoppingCart/Cart/Cart"


// function App() {
export default function client() {
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [shakes, setShakes] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [overlap, setOverlap] = useState(false);

  const [menus_json, setMenus_json] = useState([]);

  const [ETA, setETA] = useState(0);
  const [orderSent, setOrderSent] = useState(false);

  useEffect(() => {
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/POS/menu";
    fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
      .then(response => 
          response.json().then(data => {
            setMenus_json(data["data"])
            setLoading(false);
            console.log(menus_json)
            // MenuData = JSON.parse(menus_json); 
      }))
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [])

  
  

  // useEffect(() => {
  //   if(orderSent){
  //     var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
  //     var endpoint = "/POS/orders";
  //     fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
  //         .then(response => 
  //             response.json().then(data => {
  //             setETA(data["data"])
  //         }))
  //         .catch(error => {
  //           console.error('There was an error!', error);
  //         });
  //     }
  // }, [])

  const [loading, setLoading] = useState(true);

  if(loading){
    return <h1>Loading</h1>
  }

  return (
    <div
      id={"outer-container"}
      className="App"
      css={css`
        background: #f0eff1;
        height: 100%;
      `}
    >
      <Cart
        cart={cart}
        setCart={setCart}
        cartOpened={cartOpened}
        setCartOpened={setCartOpened}
        setOrderSent={setOrderSent}
      />

      <div id={"page-wrap"}>
        <Navbar
          setAll={setAll}
          setBreakfast={setBreakfast}
          setLunch={setLunch}
          setShakes={setShakes}
        />

        <MenuItems
          items={menus_json}
          all={all}
          breakfast={breakfast}
          lunch={lunch}
          shakes={shakes}
          cart={cart}
          setCartOpened={setCartOpened}
        />
      </div>

      <Global
        styles={css`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");
          ::selection {
            background: #000;
            color: #f0eff1;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Poppins", sans-serif;
            --webkit-tap-highlight-color: transparent;
          }
          body::-webkit-scrollbar {
            width: 12px; /* width of the entire scrollbar */
          }
          body::-webkit-scrollbar-track {
            background: #f0eff1; /* color of the tracking area */
          }
          body::-webkit-scrollbar-thumb {
            background-color: #444444; /* color of the scroll thumb */
            border-radius: 20px; /* roundness of the scroll thumb */
            border: 3px solid #f0eff1; /* creates padding around scroll thumb */
          }
          body {
            background: #f0eff1;
          }
          .container {
            width: 80%;
            margin: auto;
          }
        `}
      />
    </div>
  );
}

// export default App;
