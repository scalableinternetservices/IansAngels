/**@jsxRuntime classic */
/**@jsx jsx */
import { css, jsx } from "@emotion/react";
import { PropaneSharp } from "@mui/icons-material";
import { Button } from "@mui/material";
import Buttons from "./Buttons";
import React from "react";
import jsCookie from "js-cookie";
import Router, { withRouter } from "next/router";

const Navbar = ({ setAll, setBreakfast, setLunch, setShakes, user }) => {
  const breakpoints = [576, 768, 992, 1200];

  const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

  return (
    <div
      className="Navbar"
      style={{ marginRight: "80px", paddingTop: "40px" }}
      css={css`
        display: flex;
        justify-content: space-around;

        .logo {
          font-size: 1.8rem;
        }

        ${mq[2]} {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          place-items: center;

          .Buttons {
            grid-row: 2;
            grid-column: 1/4;
          }

          .logo {
            grid-row: 1;
            grid-column: 1/4;
            position: relative;
            bottom: 10px;
            font-size: 3rem;
          }

          .dwu {
            grid-row: 1;
            grid-column: 1/4;
            font-size: 0.9rem;
            position: relative;
            top: 20px;
            font-weight: 400;
            font-size: 1.3rem;
          }
        }
      `}
    >
      <h3 className="logo">Ians's Angel</h3>
      <Buttons
        className="Buttons"
        setAll={setAll}
        setBreakfast={setBreakfast}
        setLunch={setLunch}
        setShakes={setShakes}
      />
      {user ? (
        <>
          <h4>Welcome, {user} </h4>
          <Button
            onClick={() => {
              jsCookie.set("user", "");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            Router.push({
              pathname: "/client/login",
            });
          }}
        >
          Log In
        </Button>
      )}
    </div>
  );
};

export default Navbar;
