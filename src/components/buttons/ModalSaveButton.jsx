import React from 'react';
import { Button } from '@mui/material';

export default function ModalSaveButton({text, disabled, onClick}) {
  return (
    <Button
      variant="outlined"
      sx={{color: "text.primary", borderColor: "text.primary"}}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}
