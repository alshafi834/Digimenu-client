import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./Profile.css";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const Profile = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [customerInfo, setCustomerInfo] = useState();

  const updateCustomerHandler = (prop) => (event) => {
    setCustomerInfo({ ...customerInfo, [prop]: event.target.value });
  };

  const [updatedMsg, setUpdatedMsg] = useState("");
  const updateCustomerInfo = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/editcustomerprofileinfo`,
        "POST",
        JSON.stringify({
          customerproInfo: customerInfo,
          userID: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setUpdatedMsg(responseData.msg);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users`,
          "POST",
          JSON.stringify({
            userID: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );

        setCustomerInfo(responseData);
        //setQrUrl(`http://digimenu.com/${responseData.username}`);
        //setAllCat(responseData.categories);
        //setCreatedFoods(responseData.fooditems);
        //console.log(customerInfo);
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [sendRequest, auth.token, auth.userId]);
  return (
    <div className="profile-container">
      <h2>Profile Info:</h2>
      {customerInfo ? (
        <form noValidate autoComplete="off" onSubmit={updateCustomerInfo}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="username"
                label="User Name"
                value={customerInfo.username}
                onChange={updateCustomerHandler("username")}
                type="text"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="restAddress"
                label="User Address"
                value={customerInfo.address}
                onChange={updateCustomerHandler("address")}
                type="text"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="restPhone"
                label="User Phone"
                value={customerInfo.phone}
                onChange={updateCustomerHandler("phone")}
                type="text"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="restEmail"
                label="User Email"
                value={customerInfo.email}
                onChange={updateCustomerHandler("email")}
                type="text"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" color="primary" type="submit">
                Update Info
              </Button>
              {updatedMsg ? <p className="successMsg">{updatedMsg}</p> : null}
            </Grid>
          </Grid>
        </form>
      ) : null}
      {/* {customerInfo ? (
              <ul>
                <li>Name: {customerInfo.username}</li>
                <li>Address: {customerInfo.address}</li>
                <li>Phone: {customerInfo.phone}</li>
                <li>Email: {customerInfo.email}</li>
              </ul>
            ) : null} */}
    </div>
  );
};

export default Profile;
