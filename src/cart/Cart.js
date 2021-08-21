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

import { Link } from "react-router-dom";

const Cart = () => {
  const { sendRequest } = useHttpClient();
  const cartcon = useContext(CartContext);
  const auth = useContext(AuthContext);
  const cart = JSON.parse(localStorage.getItem("cartData"));
  console.log(cart);

  const [expanded, setExpanded] = useState("panel1");

  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    entrytime: "",
    leavingtime: "",
  });

  const updateCustomerHandler = (prop) => (event) => {
    setCustomerInfo({ ...customerInfo, [prop]: event.target.value });
  };

  const submitCovidData = async (event) => {
    event.preventDefault();
    console.log(customerInfo);
    setExpanded("panel3");
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/covidentry`,
        "POST",
        JSON.stringify({
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          userid: auth.userId,
          restid: cart.restId,
          entrytime: customerInfo.entrytime,
          leavingtime: customerInfo.leavingtime,
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

  const placeOrder = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/createorder`,
        "POST",
        JSON.stringify({
          fooditem: cart.cartItems,
          totalprice: cart.totalPrice,
          userID: auth.userId,
          restId: cart.restId,
          orderDate: new Date().toISOString(),
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //setCreatedFoods(responseData.fooditems);
      console.log(responseData);
      localStorage.setItem("cartData", null);
      setOrderPlaced(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="cart-container">
      {!cart && !orderPlaced ? (
        <div className="empty-cart">
          <img
            src="https://i1.wp.com/www.huratips.com/wp-content/uploads/2019/04/empty-cart.png?fit=603%2C288&ssl=1"
            width="350px"
            alt="Empty cart"
          />
          <p>Sorry, Your cart is empty!!</p>
        </div>
      ) : null}
      {cart && !orderPlaced ? (
        <div>
          <Accordion
            square
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
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
                          <p>{cr.qPrice} €</p>
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
            <AccordionSummary
              aria-controls="panel2d-content"
              id="panel2d-header"
            >
              <h2>Covid Measure Data</h2>
            </AccordionSummary>
            <AccordionDetails>
              <div className="pay-type">
                <form noValidate autoComplete="off" onSubmit={submitCovidData}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="name"
                        label="User Name"
                        placeholder="Last Name, First Name"
                        value={customerInfo.name}
                        onChange={updateCustomerHandler("name")}
                        type="text"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="email"
                        label="User Address"
                        placeholder="Street house, Postcode, City"
                        value={customerInfo.email}
                        onChange={updateCustomerHandler("email")}
                        type="text"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="phone"
                        label="User Phone"
                        placeholder="XXXXXXXXXXX"
                        value={customerInfo.phone}
                        onChange={updateCustomerHandler("phone")}
                        type="text"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <TextField
                        id="datetime-local"
                        label="Entry Time"
                        type="datetime-local"
                        onChange={updateCustomerHandler("entrytime")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <TextField
                        id="datetime-local"
                        label="Probable leaving time"
                        type="datetime-local"
                        onChange={updateCustomerHandler("leavingtime")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <button className="order-btn" type="submit">
                        Submit
                      </button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              aria-controls="panel3d-content"
              id="panel3d-header"
            >
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
      ) : null}

      {orderPlaced ? (
        <div className="empty-cart">
          <img
            src="https://image.flaticon.com/icons/png/512/113/113339.png"
            width="350px"
            alt="Empty cart"
          />
          <p>
            Your order has been placed successfully!! Restaurant is processing
            your food!!
          </p>
          <p>
            Track your <Link to="/orders">Order</Link>!!
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Cart;
