import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./users.css";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { makeStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";

import QRCode from "qrcode.react";
import ReactToPdf from "react-to-pdf";
import { Divider } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 894,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const Users = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [restInfo, setRestInfo] = useState();

  const [allCat, setAllCat] = useState();

  const [value, setValue] = useState(0);
  const classes = useStyles();

  const [qrUrl, setQrUrl] = useState();

  const [foodCat, setFoodCat] = useState();

  const [createdFoods, setCreatedFoods] = useState();

  const ref = React.createRef();

  const options = {
    orientation: "portrait",
    unit: "in",
    format: [6, 8],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [open, setOpen] = React.useState(false);

  /* useEffect(() => {
    const getUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:8000/api/users",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        setLoadedUsers(responseData.users);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [sendRequest, auth.token]); */

  const handleClickOpen = (id) => {
    setFoodCat(id);
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const createFood = async (event) => {
    event.preventDefault();
    console.log("creating food");
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/addfooditem`,
        "POST",
        JSON.stringify({
          fooditem: food,
          email: restInfo.email,
          category: foodCat,
          userID: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCreatedFoods(responseData.fooditems);
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const [food, setFood] = useState({
    foodName: "",
    foodPrice: "",
  });
  const foodHandler = (prop) => (event) => {
    setFood({ ...food, [prop]: event.target.value });
  };

  const body = (
    <div>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
    </div>
  );

  const deleteCat = async (id) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/deletecategory/${id}`,
        "DELETE",
        JSON.stringify({
          email: restInfo.email,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setAllCat(responseData);
    } catch (err) {}
  };

  const deleteFood = async (id) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/deletefood/${id}`,
        "DELETE",
        JSON.stringify({
          email: restInfo.email,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCreatedFoods(responseData);
    } catch (err) {}
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

        setRestInfo(responseData);
        setQrUrl(
          `${process.env.REACT_APP_MENU_URL}/browse/609d96e5b5ce26374895e435`
        );
        setAllCat(responseData.categories);
        setCreatedFoods(responseData.fooditems);
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [sendRequest, auth.token, auth.userId]);

  return (
    <>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className="tab-main"
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Restaurant Info" {...a11yProps(0)} />
          <Tab label="Add Food Categories" {...a11yProps(1)} />
          <Tab label="Add Food Items" {...a11yProps(2)} />
          <Tab label="Barcode" {...a11yProps(3)} />
          {/* <Tab label="Item Five" {...a11yProps(4)} />
          <Tab label="Item Six" {...a11yProps(5)} />
          <Tab label="Item Seven" {...a11yProps(6)} /> */}
        </Tabs>
        <TabPanel value={value} index={0}>
          1st tab
        </TabPanel>
        <TabPanel value={value} index={1}>
          2nd tab
        </TabPanel>
        <TabPanel value={value} index={2} className="tabpanel">
          <div>
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
                            <div>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleClickOpen(cat._id)}
                              >
                                Add item +
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => deleteCat(cat._id)}
                              >
                                Delete this category
                              </Button>
                            </div>
                            <Dialog
                              onClose={handleClose}
                              aria-labelledby="customized-dialog-title"
                              open={open}
                            >
                              <DialogTitle
                                id="customized-dialog-title"
                                onClose={handleClose}
                              >
                                Add a food item on your category
                              </DialogTitle>
                              <form
                                noValidate
                                autoComplete="off"
                                onSubmit={createFood}
                              >
                                <DialogContent dividers>
                                  <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        id="foodName"
                                        label="Food Name"
                                        value={food.foodName}
                                        onChange={foodHandler("foodName")}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        id="foodPrice"
                                        label="Food Price"
                                        value={food.foodPrice}
                                        onChange={foodHandler("foodPrice")}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                      />
                                    </Grid>
                                  </Grid>
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    autoFocus
                                    onClick={handleClose}
                                    color="primary"
                                    type="submit"
                                  >
                                    Add
                                  </Button>
                                </DialogActions>
                              </form>
                            </Dialog>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          {createdFoods ? (
                            <div className="foodItems">
                              {createdFoods.map((cf) => {
                                if (cf.foodCategory === cat._id)
                                  return (
                                    <div className="foodItem">
                                      <div className="foodItem-left">
                                        <img src={cf.foodImage} alt="" />
                                        <p>
                                          {cf.foodName} - {cf.foodPrice} ???
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => deleteFood(cf._id)}
                                        type="submit"
                                      >
                                        Delete
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
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div>
            <div ref={ref}>
              <div className="qr-code">
                {restInfo ? <QRCode value={qrUrl} size={575} /> : null}
                <p>{qrUrl}</p>
              </div>
              <h3>Scan the QR code to get the menu</h3>
            </div>
          </div>
          <ReactToPdf
            targetRef={ref}
            filename="Restaurant-QRcode.pdf"
            options={options}
            x={0.5}
            y={0.5}
            scale={0.8}
          >
            {({ toPdf }) => (
              <Button variant="outlined" color="primary" onClick={toPdf}>
                Generate pdf
              </Button>
            )}
          </ReactToPdf>
        </TabPanel>
        {/* <TabPanel value={value} index={4}>
          item 5
        </TabPanel>
        <TabPanel value={value} index={5}>
          item 6
        </TabPanel>
        <TabPanel value={value} index={6}>
          Item Seven
        </TabPanel> */}
      </div>
    </>
  );
};

export default Users;
