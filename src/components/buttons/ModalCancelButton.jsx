import React from 'react';
import { Button } from '@mui/material';

const ButtonStyle = {color: "text.primary", opacity: .5}

export default function ModalCancelButton({text, onClick, disabled}) {
  return (
    <Button
      variant="text"
      disabled={disabled}
      onClick={onClick}
      sx={ButtonStyle}
    >
      {text}
    </Button>
  )
}
