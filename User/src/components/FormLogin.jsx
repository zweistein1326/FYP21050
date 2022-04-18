import React, {useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AlertDialog from "./AlertDialog";
import axios from "axios";

const defaultValues = {
  username: "",
  walletAddress: "",
};

const FormLogin = () => {
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
    const baseURL = "http://127.0.0.1:8000"
    const payload = {
      username: formValues.username,
      walletAddress: formValues.walletAddress,
    };
    setLoading(true);
    axios.post(baseURL+"/login", payload).then(response => {
      setLoading(false);
      if (response.data.success) {
        setSubmitted(true);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else{
        setError(true);
      }
    }, error => {
      setLoading(false);
      setError(true);
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
              Log Into Account
            </Button>
          </Grid>
          {loading && (<Grid item xs={12}>
            <CircularProgress />
          </Grid>)}
          {error && (<AlertDialog status="Login Failed" message="Please try again"/>)}
          {submitted && (<AlertDialog status="Login Successful" message="Proceed" proceedToHome={submitted}/>)}
        </Grid>
      </form>
    </Box>
  );
}

export default FormLogin;