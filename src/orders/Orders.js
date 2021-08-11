import React, { useEffect, useContext, useState } from "react";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import "./Orders.css";

const Orders = () => {
  const [myOrders, setMyOrders] = useState();
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const [activeStep, setActiveStep] = useState(0);
  function getSteps() {
    return ["Active", "Processing", "Ready to collect"];
  }
  const steps = getSteps();

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/users/orders/${auth.userId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setMyOrders(responseData);
        setActiveStep(responseData[0].status);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrders();
  }, [sendRequest, auth.token, auth.userId]);

  console.log(myOrders);
  return (
    <div className="order-container">
      <h2>Your orders</h2>
      <h3>Current Order</h3>
      {myOrders ? (
        <div className="ongo-order-sec">
          <div className="stepper">
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          <div className="order-sec">
            <>
              <div className="active-order">
                {myOrders[0].fooditems.map((cr, index) => {
                  return (
                    <div className="cartItem">
                      <div className="cartItem-top">
                        <img src={cr.foodImage} alt="" />
                        <span>
                          {cr.foodName} x {cr.quantity}
                        </span>
                      </div>
                      <p>
                        {cr.foodName} - {cr.qPrice} €
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="total">
                <h4>Total Price: {myOrders[0].totalprice} €</h4>
              </div>
            </>
          </div>
        </div>
      ) : null}

      <h3>Completed Orders</h3>
    </div>
  );
};

export default Orders;
