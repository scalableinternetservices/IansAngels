// import Head from 'next/head';
// import Image from 'next/image';
// import styles from '../styles/Home.module.css';
// import Link from 'next/link';
// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// // import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';

// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import { red } from '@mui/material/colors';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// export default function Home() {
//   const [expanded, setExpanded] = React.useState(false);

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//   };

//   return (
//     <div>
//       <Navbar bg="light" expand="lg">
//         <Container>
//           <Navbar.Brand href="/">Ian's Angels All-In-One Restaurant WebApp</Navbar.Brand>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//             <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="me-auto">
//               <Nav.Link href="/">Home</Nav.Link>
//               <Nav.Link href="/">Sales Report</Nav.Link>
//               <Nav.Link href="/">Inventory</Nav.Link>
//               <Nav.Link href="/client">Client</Nav.Link>
//               <Nav.Link href="/kitchen">Kitchen</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <div className="m-5">
//         <h1 className="text-center">Ordering Page</h1>
//       </div>

//       <Card sx={{ maxWidth: 345 }}>
//       <CardHeader
//         avatar={
//           <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
//             R
//           </Avatar>
//         }
//         action={
//           <IconButton aria-label="settings">
//             <MoreVertIcon />
//           </IconButton>
//         }
//         title="Shrimp and Chorizo Paella"
//         subheader="September 14, 2016"
//       />
//       <CardMedia
//         component="image"
//         height="194"
//         image={"../public/img/dish1"}
//         alt="Paella dish"
//       />
//       <img src={"../public/img/dish1"} alt="recipe thumbnail"/>
//       <CardContent>
//         <Typography variant="body2" color="text.secondary">
//           This impressive paella is a perfect party dish and a fun meal to cook
//           together with your guests. Add 1 cup of frozen peas along with the mussels,
//           if you like.
//         </Typography>
//       </CardContent>
//       <CardActions disableSpacing>
//         <IconButton aria-label="add to favorites">
//           <FavoriteIcon />
//         </IconButton>
//         <IconButton aria-label="share">
//           <ShareIcon />
//         </IconButton>
//         <ExpandMore
//           expand={expanded}
//           onClick={handleExpandClick}
//           aria-expanded={expanded}
//           aria-label="show more"
//         >
//           <ExpandMoreIcon />
//         </ExpandMore>
//       </CardActions>
//       <Collapse in={expanded} timeout="auto" unmountOnExit>
//         <CardContent>
//           <Typography paragraph>Method:</Typography>
//           <Typography paragraph>
//             Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
//             aside for 10 minutes.
//           </Typography>
//           <Typography paragraph>
//             Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
//             medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
//             occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
//             large plate and set aside, leaving chicken and chorizo in the pan. Add
//             pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
//             stirring often until thickened and fragrant, about 10 minutes. Add
//             saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
//           </Typography>
//           <Typography paragraph>
//             Add rice and stir very gently to distribute. Top with artichokes and
//             peppers, and cook without stirring, until most of the liquid is absorbed,
//             15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
//             mussels, tucking them down into the rice, and cook again without
//             stirring, until mussels have opened and rice is just tender, 5 to 7
//             minutes more. (Discard any mussels that don&apos;t open.)
//           </Typography>
//           <Typography>
//             Set aside off of the heat to let rest for 10 minutes, and then serve.
//           </Typography>
//         </CardContent>
//       </Collapse>
//     </Card>

//     </div>

//   )
// }

/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, Global } from "@emotion/react";
import { useState, useEffect } from "react";
import MenuItems from "./components/Menu/MenuItems";
import MenuData from "./components/Menu/MenuData";
// import {menuData} from "./components/MenuData";
import Navbar from "./components/Menu/Navbar";

import Nav from "react-bootstrap/Nav";
import Navbar2 from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { slide as Menu } from "react-burger-menu";

import styles from "./client.module.css";

function App() {
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [shakes, setShakes] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartAmount, setCartAmount] = useState(0);
  const [cartDisplayed, setCartDisplayed] = useState(false);
  const [overlap, setOverlap] = useState(false);

  const handleAddToCart = (e) => {
    let handledAddedGame = allGames.map((game, i) => {
      if (location.pathname === "/react-ecommerce-store/browse") {
        if (e.target.id == i) {
          game.inCart = true;
          let newCart = cart;
          newCart.push(game);
          setCart(newCart);
          setCartAmount(cartAmount + 1);
          return game;
        } else {
          return game;
        }
      } else {
        if (selectedGame.id == i) {
          game.inCart = true;
          let newCart = cart;
          newCart.push(game);
          setCart(newCart);
          setCartAmount(cartAmount + 1);
          return game;
        } else {
          return game;
        }
      }
    });

    setAllGames(handledAddedGame);
  };

  const clearCart = () => {
    setCart([]);
    setCartAmount(0);
    const defaultGames = allGames.map((game, i) => {
      game.inCart = false;
      game.isHovered = false;
      return game;
    });
    setAllGames(defaultGames);
    let newHoverState = hoverState[21];
    newHoverState.hovered = false;
    setHoverState([...hoverState, (hoverState[21] = newHoverState)]);
  };

  const handleRemoveFromCart = (e) => {
    let removedIndex = cart.findIndex((game) => game.id == e.target.id);
    let newAllGames = allGames.map((game, i) => {
      if (game.id == e.target.id) {
        game.inCart = false;
        game.isHovered = false;
        return game;
      } else {
        return game;
      }
    });
    setAllGames(newAllGames);
    let firstHalf = cart.slice(0, removedIndex);
    let secondHalf = cart.slice(removedIndex + 1);
    let addedUp = firstHalf.concat(secondHalf);
    setCart(addedUp);
    setCartAmount(cartAmount - 1);
    setHoverState([...hoverState, (hoverState[21].hovered = false)]);
  };

  const handleOpenCart = () => {
    setCartDisplayed(true);
  };

  const handleCloseCart = () => {
    setCartDisplayed(false);
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

  useEffect(() => {
    if (cartDisplayed) {
      document.body.style.overflow = "hidden !important";
    } else {
      document.body.style.overflow = "scroll !important";
    }
  }, [cartDisplayed]);

  return (
    <div
      id={"outer-container"}
      className="App"
      css={css`
        background: #f0eff1;
        height: 100%;
      `}
    >
      <Menu
        styles={styles}
        right
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        customBurgerIcon={<img src="/static/img/cart.jpeg" />}
      >
        <h3>Cart</h3>
      </Menu>
      <div id={"page-wrap"}>
        <Navbar
          setAll={setAll}
          setBreakfast={setBreakfast}
          setLunch={setLunch}
          setShakes={setShakes}
        />

        <MenuItems
          items={MenuData}
          all={all}
          breakfast={breakfast}
          lunch={lunch}
          shakes={shakes}
        />

        <div className={styles.main}>
          {overlap ? (
            <motion.div
              className={styles.overlap}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            ></motion.div>
          ) : null}

          {cartDisplayed ? (
            <Cart
              cartDisplayed={cartDisplayed}
              handleOpenCart={handleOpenCart}
              handleCloseCart={handleCloseCart}
              cart={cart}
              cartAmount={cartAmount}
              clearCart={clearCart}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          ) : null}
        </div>
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

export default App;
