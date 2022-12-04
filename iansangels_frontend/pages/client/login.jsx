/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, Global } from "@emotion/react";
import { useState, useEffect } from "react";
import MenuItems from "../components/Menu/MenuItems";
// import MenuData from "./components/Menu/MenuData";
// import {menuData} from "./components/MenuData";
import Navbar from "../components/Menu/Navbar";
import Alert from "react-bootstrap/Alert";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// import { slide as Menu } from "react-burger-menu";
import Cart from "../components/ShoppingCart/Cart/Cart";
import { motion } from "framer-motion";

import Router, { withRouter } from "next/router";

import jsCookie from "js-cookie";

// function App() {
export default function login() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [shakes, setShakes] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [overlap, setOverlap] = useState(false);
  const breakpoints = [576, 768, 992, 1200];

  const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

  const [menus_json, setMenus_json] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/POS/menu";
    fetch(rails_url + endpoint) //fetch with no options does a get request to that endpoint
      .then((response) =>
        response.json().then((data) => {
          setMenus_json(data["data"]);
          setLoading(false);
          console.log(menus_json);
          // MenuData = JSON.parse(menus_json);
        })
      )
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const [loading, setLoading] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
    var endpoint = "/person";
    fetch(rails_url + endpoint) //fetch with no options does a get request to that endpoint
      .then((response) =>
        response.json().then((data) => {
          console.log(data.data);
          const people = data.data;
          console.log(people);
          for (var p of people) {
            console.log(p);
            if (
              p.attributes.email.toLowerCase() == email.toLocaleLowerCase() &&
              p.attributes.password == password
            ) {
              setFailed(false);

              jsCookie.set("user", p.attributes.username);
              Router.push({
                pathname: "/client/client",
              });
            }
          }
          setFailed(true);
        })
      )
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  if (loading) {
    return <h1>Loading</h1>;
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
      <div id={"page-wrap"}>
        <Navbar
          setAll={setAll}
          setBreakfast={setBreakfast}
          setLunch={setLunch}
          setShakes={setShakes}
        />

        <motion.div
          className="form container"
          variants={container}
          initial="hidden"
          animate="visible"
          css={css`
            margin-top: 30px;
            padding: 40px 20px;
            background: #fff;
            border-radius: 50px;

            .menu-items {
              padding: 1rem 1.5rem;
              display: flex;
              border: #efefef 1px solid;
              border-top: none;
              ${mq[0]} {
                display: grid;
                img {
                  margin-bottom: 10px;
                }
              }

              &:last-child {
                border-bottom: none;
              }

              &:nth-child(odd) {
                border-left: none;
                ${mq[2]} {
                  border-right: none;
                }
              }

              &:nth-child(even) {
                border-right: none;
                ${mq[2]} {
                  border-left: none;
                }
              }

              .item-content {
                display: grid;
                padding: 0 1rem;

                p {
                  font-size: 0.8rem;
                  ${mq[(0, 1)]} {
                    font-size: 0.7rem;
                  }
                }

                .item-title-box {
                  display: flex;
                  justify-content: space-between;

                  .item-title,
                  .item-price {
                    font-size: 1rem;
                    ${mq[(0, 1)]} {
                      font-size: 0.8rem;
                    }
                  }
                }
              }
            }

            img {
              height: 85px;
              ${mq[(0, 1)]} {
                height: 75px;
              }
              cursor: pointer;
            }
          `}
        >
          <div style={{ margin: "auto", width: "50%", padding: "10px" }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                  }}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    e.preventDefault();
                    setPassword(e.target.value);
                  }}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              {failed && (
                <Alert variant={"danger"} style={{ marginTop: 25 }}>
                  Login failed. Please try again.
                </Alert>
              )}
            </Form>
          </div>
        </motion.div>
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
