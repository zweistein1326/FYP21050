import { 
  Container, 
  Box,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const ProfilePage = ({ connect, disconnect, isActive, account }) => {
  return (
    <Container align="center" >
      <Box sx={{ my: 4 }}>
        <p>Profile</p>
      </Box>
    </Container>
  )
}

export default ProfilePage;