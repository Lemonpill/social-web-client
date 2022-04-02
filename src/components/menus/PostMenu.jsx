import * as React from 'react';
import {Menu, MenuItem} from '@mui/material';
import {Edit, Delete, Visibility} from "@mui/icons-material";

const menuStyle = {
  border: "1px solid",
  borderColor: "divider",
  boxShadow: 0
}

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  p: 1.2,
}

export default function PostMenu({anchorEl, open, handleClose, actions, onView, onEdit, onDelete}) {
  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        sx={menuStyle}
      >
        {actions.map(a => (
          <MenuItem
            key={a}
            onClick={() => {
              handleClose()
              // Handle actions
              a === "View" && onView()
              a === "Edit" && onEdit()
              a === "Delete" && onDelete()
          }} sx={itemStyle}>
            {/* Icon to match action */}
            {a === "View" && <Visibility fontSize="small"/>}
            {a === "Edit" && <Edit fontSize="small"/>}
            {a === "Delete" && <Delete fontSize="small"/>}
            {a} 
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
