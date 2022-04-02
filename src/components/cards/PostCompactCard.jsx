import PostMenu from '../menus/PostMenu';
import MoreVert from "@mui/icons-material/MoreVert";
import axios from 'axios';
import { Card, Typography, Box, Link, IconButton, Avatar } from '@mui/material';
import React, { useCallback } from "react";
import { useModalContext } from '../../context/useModalContext';
import EditPostModal from "../modals/EditPostModal";
import { useFeedContext } from '../../context/useFeedContext';
import { API } from '../../API';
import { useAuthContext } from '../../context/useAuthContext';
import { useNavigate } from 'react-router';

const cardStyle = {
  position: "relative",
  display: "flex",
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

const ownerStyle = {fontWeight: "medium", lineHeight: "120%"};

const dateStyle = {color: "text.secondary", lineHeight: "120%"};

const metaBoxStyle = {display: "flex", flexDirection: "column", gap: 0};

const actionsIconStyle = {color: "text.secondary"};

const contentStyle = {mb: 2};

const readLinkStyle = {fontWeight: 500, color: "text.primary"};

const commentsCountStyle = {color: "text.secondary"};

export default function PostCompactCard({post}) {
  // Debug
  // console.log("Render PostCompactCard")

  const {openEditPostModal} = useModalContext()
  const {selectedPostID, selectPost, removePost} = useFeedContext()
  const {bearerToken} = useAuthContext()
  const navigate = useNavigate()

  // Save content to separate state
  // In order to update dynamically
  const [content, setContent] = React.useState("")
  
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
  const onView = useCallback(() => {
    navigate("/posts/" + post.id)
  }, [navigate, post.id])
  
  // Delete post
  const onDelete = React.useCallback(() => {
    if (!bearerToken) return
    
    // Confirm before proceeding
    const r = window.confirm("Are you sure?")
    if (!r) return
    
    // Request to delete the post
    axios.delete(
      API.host + "/posts/" + post.id,
      {headers: {Authorization: "Bearer " + bearerToken}}
      ).then(res => {
        // Remove post from feed
        removePost(post.id)
      }).catch(err => {
        alert("Something went wrong ...")
        // DEBUG
        console.log(err)
      })
    }, [post.id, bearerToken, removePost])
    
    // Sync between inherited and displayed content
    React.useEffect(() => {
      setContent(post.content)    
    }, [post.content])
    
    return (
      <div>
      {/* Edit Modal */}
      {post.id === selectedPostID &&
      <EditPostModal
        post={post}
        currContent={content}
        setCurrContent={setContent}
      />}

      {/* Actions menu */}
      <PostMenu
        anchorEl={menuAnchorEl}
        open={open}
        handleClose={handleCloseMenu}
        actions={post.actions}
        onView={onView}
        onEdit={openEditPostModal}
        onDelete={onDelete}
      />

      {/* Post card */}
      <Card sx={cardStyle}>
        <Box sx={headerStyle}>
          <Box sx={metaStyle}>
            <Avatar sx={{backgroundColor: post.owner.color}}>
              <Typography>
                {post.owner.display_name[0]}
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
          <IconButton onClick={e => {
            handleOpenMenu(e)
            selectPost(post.id)
            }}>
            <MoreVert fontSize="small" sx={actionsIconStyle}/>
          </IconButton>
        </Box>
        <Box>
          <Typography
          variant="body1"
          component="p"
          sx={contentStyle}
          >
            {content.substring(0, 160)}
            {content.length >= 160 && "..."}
          </Typography>
          <Link
            href={"/posts/" + post.id}
            underline="hover"
            sx={readLinkStyle}
          >read post</Link>
        </Box>
        <Box component="footer">
          <Typography
            variant="body2"
            component="p"
            sx={commentsCountStyle}
          >{post.comments} Comments
          </Typography>
        </Box>
      </Card>
    </div>
  )
}
