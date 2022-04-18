import React from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import myteam from '../images/myteam.png';
import useStyles from '../styles/styles';

import {useNavigate} from 'react-router-dom';

const Hero = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const gotoRegister = () => {
    navigate('/register');
  }
  return (
    <Box className={classes.heroBox}>
      <Grid container spacing={6} className={classes.gridContainer}>
        <Grid item xs={12} md={7}>
          <Typography variant="h3" fontWeight={700} className={classes.title}>
            Welcome to Algol
          </Typography>
          <Typography variant="h6" className={classes.subtitle}>
            A robust blockchain powered solution enabling ease and trust 
            in management of Academic Credentials. 

            Share your credentials with only who you want.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '200px', fontSize: '16px' }}
            onClick={gotoRegister}
          >
            Register now
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <img src={myteam} alt="My Team" className={classes.largeImage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;