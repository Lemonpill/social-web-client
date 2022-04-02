import React from 'react';
import { MenuItem } from '@mui/material';

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  p: 1.2
}

export default function NavMenuItem({name, icon, onClick}) {
  return (
    <MenuItem key="feed" onClick={onClick} sx={itemStyle}>
      {icon}
      {name}
    </MenuItem>
  )
}
