import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const style = {
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
    <Box sx={style}>
      <CircularProgress size="2em"/>
    </Box>
  )
}
