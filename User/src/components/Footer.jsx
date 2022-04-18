import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center"  >
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:3000/">
        Algol
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Footer = () => {

  return (
    <Box sx={{ position: "relative" }}>
      <Container>
        <Copyright />
      </Container>
    </Box>
  );
}

export default Footer;