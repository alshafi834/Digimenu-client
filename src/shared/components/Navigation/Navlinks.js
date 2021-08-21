import React, { useContext } from "react";

import "./Navlink.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const Navlinks = () => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      {/* <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li> */}
      {auth.isLoggedIn && (
        <>
          {/* <li>
            <NavLink to="/users" exact>
              My restaurant
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/profile" exact>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/browse" exact>
              Browse restaurant
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" exact>
              My Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" exact>
              Cart
            </NavLink>
          </li>
          <li>
            <NavLink to="/reportcase" exact>
              Report Covid Case
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications" exact>
              Notifications
            </NavLink>
          </li>
        </>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/">Login/Register</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>
            <NavLink to="/">Logout</NavLink>
          </button>
        </li>
      )}
    </ul>
  );
};

export default Navlinks;
