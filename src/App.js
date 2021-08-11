import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Home from "./users/pages/Home";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { CartContext } from "./shared/context/cart-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { useCart } from "./shared/hooks/cart-hook";
import Users from "./users/components/Users";
import Profile from "./users/components/Profile";
import Browse from "./browse/Browse";
import BrowseRestaurant from "./browse/BrowseRestaurant";
import Cart from "./cart/Cart";
import Orders from "./orders/Orders";

const App = () => {
  const { token, login, logout, userId } = useAuth();
  const { foodAdded, cartItems, restId, setCart, addQuantity, removeQuantity } =
    useCart();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>{" "}
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/browse" exact>
          <Browse />
        </Route>
        <Route path="/cart" exact>
          <Cart />
        </Route>
        <Route path="/orders" exact>
          <Orders />
        </Route>
        <Route path="/browse/:restId" exact>
          <BrowseRestaurant />
        </Route>
        {/* <Redirect to="/users" /> */}
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Auth />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>{" "}
        {/* <Redirect to="/auth" /> */}
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <CartContext.Provider
        value={{
          isFoodAdded: foodAdded,
          cartItems: cartItems,
          restId: restId,
          setCart: setCart,
          addQuantity: addQuantity,
          removeQuantity: removeQuantity,
        }}
      >
        <Router>
          <MainNavigation />
          <main>{routes}</main>
        </Router>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
