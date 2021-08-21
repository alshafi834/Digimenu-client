import React, { useEffect, useContext, useState } from "react";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import "./Orders.css";

import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CompletedOrders from "./CompletedOrders";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Orders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const [activeStep, setActiveStep] = useState(0);

  const [value, setValue] = React.useState(0);

  function getSteps() {
    return ["Active", "Processing", "Ready to collect"];
  }
  const steps = getSteps();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users/orders/${auth.userId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setMyOrders(responseData);
        setActiveStep(responseData[0].status + 1);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrders();
  }, [sendRequest, auth.token, auth.userId]);

  console.log(myOrders);
  return (
    <div className="order-container">
      <div className="top-section">
        <h2>Your orders</h2>
        <button
          className="refresh-btn"
          onClick={() => {
            refreshPage();
          }}
        >
          Refresh
        </button>
      </div>

      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Current Orders" {...a11yProps(0)} />
          <Tab label="Completed Orders" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <h3>Current Order</h3>
        {myOrders.length > 0 ? (
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
                        <p>{cr.qPrice} €</p>
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
        ) : (
          <div>You don't have any active orders</div>
        )}
      </TabPanel>

      <TabPanel value={value} index={1}>
        <CompletedOrders />
      </TabPanel>
    </div>
  );
};

export default Orders;
