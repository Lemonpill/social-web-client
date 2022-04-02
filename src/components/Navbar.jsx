import React from 'react';
import { AppBar, Toolbar, Box, IconButton, Container, Typography } from '@mui/material';
import { useAuthContext } from '../context/useAuthContext';
import { MenuOutlined } from "@mui/icons-material";
import NavbarMenu from './menus/NavbarMenu';

const appBarStyle = {
  display: "flex",
  position: "sticky",
  top: 0,
  zIndex: 9,
  backgroundColor: "background.navbar",
  boxShadow: 0,
  border: "1px solid",
  borderColor: "divider"
};

const toolbarStyle = {display: "flex", justifyContent: "space-between"};

const logoPrimStyle = {
  fontWeight: "bold",
  color: 'primary.main'
};

const logoSecStyle = {color: "text.primary"};


export default function Navbar() {  

  const {logoutUser} = useAuthContext()

  // MENU //
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };
  //

  return (
    <AppBar sx={appBarStyle}>
      <NavbarMenu
        anchorEl={menuAnchorEl}
        open={openMenu}
        handleClose={handleCloseMenu}
        onLogout={logoutUser}
      />
      <Container maxWidth="sm" disableGutters>
        <Toolbar sx={toolbarStyle}>
          <Typography sx={logoSecStyle} component="h6" variant="h6">
            Social<Typography component="span" variant="h6" sx={logoPrimStyle}>
              Web
              </Typography>
          </Typography>
          <Box sx={{display: "flex"}}>
            <IconButton onClick={handleOpenMenu}>
              <MenuOutlined/>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
