import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const screenStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

export default function LoadingScreen() {
  // DEBUG
  // console.log("Rendering: LoadingScreen")
  
  return (
    <Box sx={screenStyle}>
      <CircularProgress size="2em"/>
    </Box>
  )
}
