import React from 'react';
import { Box, Typography } from '@mui/material';

const mainBoxStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};



export default function NotFoundPage() {
  return (
    <Box sx={mainBoxStyle}>
      <Typography component="h1" variant="h5">
        Not Found
      </Typography>
      <Typography component="p" variant="body1">
        The requested page is not found
      </Typography>
    </Box>
  )
}
