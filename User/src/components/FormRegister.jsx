import React, {useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AlertDialog from "./AlertDialog";
import axios from "axios";
import rsa from 'js-crypto-rsa';
import {encrypt, decrypt} from "./rsa/utils";

const defaultValues = {
  username: "",
  walletAddress: "",
};

const FormRegister = () => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    rsa.generateKey(2048).then( async (key) => {
      const publicKey = key.publicKey;
      const privateKey = key.privateKey;
            
      localStorage.setItem(`publicKey${formValues.username}`, JSON.stringify(publicKey));
      localStorage.setItem(`privateKey${formValues.username}`, JSON.stringify(privateKey));
      const baseURL = "http://127.0.0.1:8000"
      const payload = {
        username: formValues.username,
        walletAddress: formValues.walletAddress,
        publicKey: JSON.stringify(publicKey),
        isAdmin:false
      };
      setLoading(true);
      axios.post(baseURL+"/register", payload).then(response => {
        setLoading(false);
        if (response.data.success) {
          setSubmitted(true);
        } else{
          setError(true);
        }
      }, error => {
        console.log(error)
        setLoading(false);
        setError(true);
      });
    });
  };

  return (
    <Box sx={{width: "100%"}}>
      <form onSubmit={handleSubmit} sx={{display: "flex", flexDirection: "column"}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
                sx={{width: "45%"}}
                id="username-input"
                name="username"
                label="Username"
                type="text"
                value={formValues.username}
                onChange={handleInputChange}
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{width: "45%"}}
              id="walletAddress-input"
              name="walletAddress"
              label="Wallet Address"
              type="text"
              value={formValues.walletAddress}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" sx={{width: "45%"}}>
              Register Account
            </Button>
          </Grid>
          {loading && (<Grid item xs={12}>
            <CircularProgress />
          </Grid>)}
          {error && (<AlertDialog status="Registration Failed" message="Please try again"/>)}
          {submitted && (<AlertDialog status="Registration Successful" message="Proceed to Login" proceedToLogin={submitted}/>)}
        </Grid>
      </form>
    </Box>
  );
}

export default FormRegister;