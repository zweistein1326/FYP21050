import { 
  Paper,
  Container,
  Box, 
  Typography,
  Alert
} from "@mui/material";
import React from "react";
import FormRegister from "../components/FormRegister";

const RegisterPage = ({theme, connect, disconnect, isActive, account}) => {
  return (
    <>
      <Container align="center" >
        <Box sx={{ my: 4 }}>
          <Paper elevation={0} >
            <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: "bold"}}>
              Register an Algol Account
            </Typography>
            <br/>
            <FormRegister />
            <br/>
            {isActive && (
              <Alert severity="success" sx={{width: "45%"}}>
                Connected Wallet Address: {account}
              </Alert>
            )}
            {!isActive && (
              <Alert severity="warning" sx={{width: "45%"}}>
                No wallet is connected.
              </Alert>
            )}
            <br/>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default RegisterPage;