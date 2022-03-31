import React from 'react';
import { Button } from '@mui/material';

export default function ModalCancelButton({text, onClick, disabled}) {
  return (
    <Button
      variant="text"
      disabled={disabled}
      onClick={onClick}
      sx={{color: "text.primary", opacity: .5}}
    >
      {text}
    </Button>
  )
}
