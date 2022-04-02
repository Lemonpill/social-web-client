import * as React from 'react';
import {Menu} from '@mui/material';
import { Feed, Logout, Brightness7 } from '@mui/icons-material';
import NavMenuItem from './items/NavMenuItem';
import { useNavigate } from 'react-router';
import { ColorModeContext } from '../..';

const menuStyle = {
  border: "1px solid",
  borderColor: "divider",
  boxShadow: 0
}

export default function NavbarMenu({anchorEl, open, handleClose, onLogout}) {

  const navigate = useNavigate()
  const colorMode = React.useContext(ColorModeContext)

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
        disableScrollLock
      >
        <NavMenuItem name="Theme" icon={<Brightness7/>} onClick={colorMode.toggleColorMode}/>
        <NavMenuItem name="Feed" icon={<Feed/>} onClick={() => {
          handleClose()
          navigate("/")
        }}/>
        <NavMenuItem name="Logout" icon={<Logout/>} onClick={() => {
          handleClose()
          onLogout()
        }}/>
      </Menu>
    </div>
  );
}
