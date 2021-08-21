import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const ReportCovid = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [covidDate, setCovidDate] = useState();

  const updateCustomerHandler = (event) => {
    setCovidDate(event.target.value);
  };

  const [updatedMsg, setUpdatedMsg] = useState("");
  const reportCovidCase = async (event) => {
    event.preventDefault();
    console.log(covidDate);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/reportcovid`,
        "POST",
        JSON.stringify({
          date: covidDate,
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

  return (
    <div className="profile-container">
      <h2>Report COVID case:</h2>
      <p>
        If you are recently tested positive for COVID-19 please report it here
      </p>
      <form noValidate autoComplete="off" onSubmit={reportCovidCase}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="datetime-local"
              label="Date you tested positive"
              type="datetime-local"
              onChange={updateCustomerHandler}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" color="primary" type="submit">
              Report
            </Button>
            {updatedMsg ? <p className="successMsg">{updatedMsg}</p> : null}
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ReportCovid;
