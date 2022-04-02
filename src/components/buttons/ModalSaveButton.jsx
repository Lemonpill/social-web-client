import React from 'react';
import { Button } from '@mui/material';

const buttonStyle = {color: "text.primary", borderColor: "text.primary"}

export default function ModalSaveButton({text, disabled, onClick}) {
  return (
    <Button
      variant="outlined"
      sx={buttonStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}
