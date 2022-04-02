import PostMenu from '../menus/PostMenu';
import React from 'react';
import MoreVert from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Card, Typography, Box, IconButton, Avatar } from '@mui/material';
import { useModalContext } from '../../context/useModalContext';
import { useAuthContext } from '../../context/useAuthContext';
import {API} from "../../API";

const cardStyle = {
  position: "relative",
  display: "flex",
  overflow: "visible",
  flexDirection: "column",
  boxShadow: 0,
  gap: 2,
  p: 2,
  border: "1px solid",
  borderColor: "divider"
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}

const metaStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1
}

const metaBoxStyle = {display: "flex", flexDirection: "column", gap: 0};

const ownerStyle = {fontWeight: "medium", lineHeight: "120%"};

const dateStyle = {color: "text.secondary", lineHeight: "120%"};

const actionsIconStyle = {color: "text.secondary"};

const contentStyle = {mb: 1};

export default function PostFullCard({post, content}) {
  // Debug
  // console.log("Render PostFullCard")

  const {openEditPostModal} = useModalContext()
  const {bearerToken} = useAuthContext()
  const navigate = useNavigate()

  // MENU //
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const open = Boolean(menuAnchorEl);
  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };
  //

  // View post
  const onPostView = React.useCallback(() => {
    navigate("/posts/" + post.id)
  }, [navigate, post.id])

  // Edit post
  const onPostEdit = React.useCallback(() => {
    openEditPostModal(post)
  }, [openEditPostModal, post])

  // Delete post
  const onPostDelete = React.useCallback(() => {
    if (!bearerToken) return

    // Confirm action
    const r = window.confirm("Are you sure?")
    if (!r) return

    // Request to delete post
    axios.delete(
      API.host + "/posts/" + post.id,
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      // Navigate to feed on successfull delete
      navigate("/")
    }).catch(err => {
      alert("Something went wrong ...")
      // DEBUG
      console.log(err)
    })
  }, [post.id, bearerToken, navigate])

  return (
    // Post
    <Card sx={cardStyle}>
      {/* Menu */}
      <PostMenu 
        anchorEl={menuAnchorEl}
        open={open}
        handleClose={handleCloseMenu}
        actions={post.actions}
        onView={onPostView}
        onEdit={onPostEdit}
        onDelete={onPostDelete}
      />
      <Box sx={headerStyle}>
        <Box sx={metaStyle}>
          <Avatar sx={{backgroundColor: post.owner.color}}>
              <Typography>
                {post.owner.display_name[0].toUpperCase()}
              </Typography>
            </Avatar>
            <Box sx={metaBoxStyle}>
              <Typography component="p" variant="body1" sx={ownerStyle}>
                {post.owner.display_name}
              </Typography>
              <Typography component="small" variant="body2" sx={dateStyle}>
                {post.created}
              </Typography>
            </Box>
        </Box>
        <IconButton onClick={handleOpenMenu}>
          <MoreVert fontSize="small" sx={actionsIconStyle}/>
        </IconButton>
      </Box>
      <Box>
        <Typography
         variant="body1"
         component="p"
         sx={contentStyle}
        >
          {content}
        </Typography>
      </Box>
    </Card>
  )
}
