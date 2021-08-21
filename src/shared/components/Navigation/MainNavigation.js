import React, { useState, useContext } from "react";

import "./MainNavigation.css";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import SideDrawer from "./SideDrawer";
import NavLinks from "./Navlinks";
import Backdrop from "../UIElement/Backdrop";

import FastfoodIcon from "@material-ui/icons/Fastfood";

import { AuthContext } from "../../context/auth-context";
//import { CartContext } from "../../context/cart-context";

const MainNavigation = (props) => {
  const auth = useContext(AuthContext);
  //const cart = useContext(CartContext);
  const cart = JSON.parse(localStorage.getItem("cartData"));
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  console.log(cart);
  const openDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };
  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawer} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h2 className="main-navigation__title">
          <Link to="/"> |Digimenu</Link>
        </h2>
        <nav className="main-navigation__full-nav">
          <NavLinks />
        </nav>
        {auth.isLoggedIn && (
          <div>
            <Link to="/cart">
              <FastfoodIcon className="cart-icon" />
              <span className="cart-nmbr">
                {cart ? cart.cartItems.length : 0}
              </span>
            </Link>
          </div>
        )}
      </MainHeader>
    </>
  );
};

export default MainNavigation;
