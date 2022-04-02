import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const buttonStyle = {
  width: "100%",
  color: "text.primary",
  ":hover": {
    bgcolor: "transparent"
  },
  p: 2
}

const progressStyle = {color: 'primary.main'};

export default function LoadMoreButton({handleClick, isLoading}) {
  // DEBUG
  // console.log("LoadMoreButton: Rendering")

  return <Button onClick={handleClick} variant="text" sx={buttonStyle}>
      {isLoading ? 
        // Show circular progress while fetching
        <CircularProgress sx={progressStyle} size="2em"/>
       : "Load more"}
    </Button>
}
