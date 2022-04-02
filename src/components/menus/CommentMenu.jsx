import * as React from 'react';
import {Menu, MenuItem} from '@mui/material';
import {Edit, Delete} from "@mui/icons-material";

const menuStyle = {
  border: "1px solid",
  borderColor: "divider",
  boxShadow: 0
}

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  p: 1.2
}

export default function CommentMenu({anchorEl, open, handleClose, actions, onEdit, onDelete}) {
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
        {/* Display actions except for "View" */}
        {actions.filter(a => a !== "View").map(a => (
          <MenuItem key={a} onClick={() => {
            // Close the menu
            handleClose()
            // Handle actions
            a === "Edit" && onEdit()
            a === "Delete" && onDelete()
          }} sx={itemStyle}>
            {/* Icon to match action */}
            {a === "Edit" && <Edit fontSize="small"/>}
            {a === "Delete" && <Delete fontSize="small"/>}
            {a} 
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
