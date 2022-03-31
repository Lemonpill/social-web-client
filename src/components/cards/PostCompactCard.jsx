import PostMenu from '../menus/PostMenu';
import MoreVert from "@mui/icons-material/MoreVert";
import axios from 'axios';
import { Card, Typography, Box, Link, IconButton } from '@mui/material';
import React, { useCallback } from "react";
import { useModalContext } from '../../context/useModalContext';
import EditPostModal from "../modals/EditPostModal";
import { useFeedContext } from '../../context/useFeedContext';
import { API } from '../../API';
import { useAuthContext } from '../../context/useAuthContext';
import { useNavigate } from 'react-router';

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
      <Card
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxShadow: 0,
          gap: 2,
          p: 2,
          border: "1px solid",
          borderColor: "divider"
        }}
        >
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
          <IconButton onClick={e => {
            handleOpenMenu(e)
            selectPost(post.id)
            }}>
            <MoreVert fontSize="small" sx={{color: "text.secondary"}}/>
          </IconButton>
        </Box>
        <Box>
          <Typography
          variant="body1"
          component="p"
          sx={{mb: 2}}
          >
            {content.substring(0, 160)}
            {content.length >= 160 && "..."}
          </Typography>
          <Link
            href={"/posts/" + post.id}
            underline="hover"
            sx={{fontWeight: 500, color: "text.primary"}}
          >read post</Link>
        </Box>
        <Box component="footer">
          <Typography
            variant="body2"
            component="p"
            sx={{color: "text.secondary"}}
          >{post.comments} Comments
          </Typography>
        </Box>
      </Card>
    </div>
  )
}
