import React, { useEffect, useContext, useState } from "react";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const CompletedOrders = () => {
  const [myOrders, setMyOrders] = useState();
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users/completedorders/${auth.userId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setMyOrders(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrders();
  }, [sendRequest, auth.token, auth.userId]);

  const [open, setOpen] = React.useState(false);

  const steps = ["Active", "Processing", "Ready to collect", "Completed"];

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  return (
    <div>
      <h3>Completed Orders</h3>
      {myOrders ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell align="right">Total Price</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myOrders.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {formatDate(row.orderdate)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClickOpen}
                    >
                      View Items
                    </Button>
                    <Dialog
                      onClose={handleClose}
                      aria-labelledby="customized-dialog-title"
                      open={open}
                    >
                      <DialogContent dividers>
                        {row.fooditems.map((cr, index) => {
                          return (
                            <>
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
                            </>
                          );
                        })}
                        {/* <div className="total">
                            <h4>Total Price: {row.totalprice} €</h4>
                          </div> */}
                      </DialogContent>
                      <DialogActions>
                        <Button autoFocus onClick={handleClose} color="primary">
                          Okay
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                  <TableCell align="right">{row.totalprice}</TableCell>
                  <TableCell align="right">{steps[row.status]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </div>
  );
};

export default CompletedOrders;
