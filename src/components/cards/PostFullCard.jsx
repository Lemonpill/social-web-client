import PostMenu from '../menus/PostMenu';
import React from 'react';
import MoreVert from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Card, Typography, Box, IconButton } from '@mui/material';
import { useModalContext } from '../../context/useModalContext';
import { useAuthContext } from '../../context/useAuthContext';
import {API} from "../../API";

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
    <Card
      sx={{
        position: "relative",
        display: "flex",
        overflow: "visible",
        flexDirection: "column",
        boxShadow: 0,
        gap: 2,
        p: 2,
        border: "1px solid",
        borderColor: "divider"
      }}
      >
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
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column"
        }}>
          <Typography component="p" variant="body1" sx={{fontWeight: "medium"}}>
            {post.owner.display_name}
          </Typography>
          <Typography component="small" variant="body2" sx={{color: "text.secondary"}}>
            {post.created}
          </Typography>
        </Box>
        <IconButton onClick={handleOpenMenu}>
          <MoreVert fontSize="small" sx={{color: "text.secondary"}}/>
        </IconButton>
      </Box>
      <Box>
        <Typography
         variant="body1"
         component="p"
         sx={{mb: 1}}
        >
          {content}
        </Typography>
      </Box>
    </Card>
  )
}
