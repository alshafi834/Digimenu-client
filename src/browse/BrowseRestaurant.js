import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";
import { CartContext } from "../shared/context/cart-context";

import "./BrowseRestaurant.css";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import { useParams } from "react-router-dom";
const BrowseRestaurant = (props) => {
  const resturantId = useParams().restId;
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);
  const { sendRequest } = useHttpClient();

  const [restInfo, setRestInfo] = useState();

  const [allCat, setAllCat] = useState();
  const [allFood, setAllFood] = useState();

  /* const [foodCat, setFoodCat] = useState();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id) => {
    setFoodCat(id);
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  }; */

  //const [myCart, setMyCart] = useState([]);

  const addToCart = (item) => {
    //console.log(cart.cartItems);
    //cart.cartItems.push(item);
    //setMyCart(myCart => [...myCart, item]);
    //cart.cartItems.push(item);
    item.quantity = 1;
    cart.setCart(item, restInfo._id);
    //console.log(cart.cartItems);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/users/browse/${resturantId}`,
          "POST",
          JSON.stringify({
            userID: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        setRestInfo(responseData);
        setAllCat(responseData.categories);
        setAllFood(responseData.fooditems);
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [sendRequest, auth.token, auth.userId]);

  return (
    <div className="menu">
      {restInfo ? (
        <div className="menu-top">
          <h2>{restInfo.username}</h2>
          <p> - {restInfo.address}</p>
        </div>
      ) : null}

      {allCat ? (
        <div>
          <div className="category-sec">
            {allCat.map((cat) => {
              return (
                <Accordion>
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div className="cat-item">
                      <p>{cat.catName}</p>
                      {/* <div>
                        <Button variant="outlined" color="primary">
                          Add item +
                        </Button>
                        <Button variant="outlined" color="primary">
                          Delete this category
                        </Button>
                      </div> */}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {allFood ? (
                      <div className="foodItems">
                        {allFood.map((cf) => {
                          if (cf.foodCategory === cat._id)
                            return (
                              <div className="foodItem">
                                <div className="foodItem-left">
                                  <img src={cf.foodImage} alt="" />
                                  <p>
                                    {cf.foodName} - {cf.foodPrice} €
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    addToCart(cf);
                                  }}
                                  type="submit"
                                >
                                  ADD
                                </button>
                              </div>
                            );
                        })}
                      </div>
                    ) : null}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BrowseRestaurant;
