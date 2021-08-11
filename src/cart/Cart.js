import React, { useContext, useState } from "react";
import "./cart.css";
import { CartContext } from "../shared/context/cart-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const Cart = () => {
  const { sendRequest } = useHttpClient();
  const cartcon = useContext(CartContext);
  const auth = useContext(AuthContext);
  const cart = JSON.parse(localStorage.getItem("cartData"));
  console.log(cartcon);

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const goToPayment = () => {
    setExpanded("panel2");
  };

  const add = (item, index) => {
    cartcon.addQuantity(item, index);
  };
  const remove = (item, index) => {
    cartcon.removeQuantity(item, index);
  };

  const [payType, setPayType] = useState("cash");
  const [showOnlineForm, setShowOnlineForm] = useState(false);

  const handlePayType = (event) => {
    setPayType(event.target.value);
    if (event.target.value === "online") {
      setShowOnlineForm(true);
    }
  };

  const placeOrder = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:8000/api/users/createorder",
        "POST",
        JSON.stringify({
          fooditem: cart.cartItems,
          totalprice: cart.totalPrice,
          userID: auth.userId,
          restId: cart.restId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //setCreatedFoods(responseData.fooditems);
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="cart-container">
      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <h2>CART</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="cart-section">
            {cart ? (
              <div className="">
                {cart.cartItems.map((cr, index) => {
                  return (
                    <div className="cartItem">
                      <div className="cartItem-top">
                        <img src={cr.foodImage} alt="" />
                        <span>{cr.foodName}</span>
                      </div>

                      <div>
                        <button
                          onClick={() => {
                            remove(cr, index);
                          }}
                        >
                          -
                        </button>
                        {/* <input
                      type="number"
                      value={cr.quantity}
                      id="quantity"
                      name="quantity"
                      min="1"
                      max="5"
                    ></input> */}
                        <span className="quantity">{cr.quantity}</span>
                        <button
                          onClick={() => {
                            add(cr, index);
                          }}
                        >
                          +
                        </button>
                      </div>
                      <p>
                        {cr.foodName} - {cr.qPrice} €
                      </p>
                    </div>
                  );
                })}
                <div className="total">
                  <h2>Total Price: {cart.totalPrice} €</h2>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => {
                    goToPayment();
                  }}
                >
                  Checkout
                </button>
              </div>
            ) : null}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <h2>Payment Method</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="pay-type">
            <FormControl component="fieldset">
              {/* <FormLabel component="legend">Gender</FormLabel> */}
              <RadioGroup
                aria-label="paymenttype"
                name="paymenttype1"
                value={payType}
                onChange={handlePayType}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio color="primary" />}
                  label="Cash"
                />{" "}
                <FormControlLabel
                  value="online"
                  control={<Radio color="primary" />}
                  label="Card payment"
                />
                {showOnlineForm ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="cardnumber"
                        label="Card Number"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        type="text"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="expiredate"
                        label="Expiry Date"
                        placeholder="MM / YY"
                        type="text"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="cvv"
                        label="CVV"
                        placeholder="XXX"
                        type="text"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                ) : null}
                <FormControlLabel
                  value="paypal"
                  control={<Radio color="primary" />}
                  label="Paypal"
                />
              </RadioGroup>
            </FormControl>
            <button className="order-btn" onClick={placeOrder}>
              Order
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Cart;
