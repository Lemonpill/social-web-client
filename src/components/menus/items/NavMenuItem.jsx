import React from 'react'
import { MenuItem } from '@mui/material'

export default function NavMenuItem({name, icon, onClick}) {
  return (
    <MenuItem key="feed" onClick={onClick} sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      p: 1.2
    }}>
      {icon}
      {name}
    </MenuItem>
  )
}
