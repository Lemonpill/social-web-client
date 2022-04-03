import CommentMenu from '../menus/CommentMenu';
import MoreVert from "@mui/icons-material/MoreVert";
import { Card, Typography, Box, IconButton, Avatar } from '@mui/material';
import React, { useCallback } from "react";
import { useModalContext } from '../../context/useModalContext';
import { useCommentsContext } from "../../context/useCommentsContext";
import EditCommentModal from "../modals/EditCommentModal";
import axios from 'axios';
import { API } from '../../API';
import { useAuthContext } from '../../context/useAuthContext';

const actionsIconStyle = {color: "text.secondary"};

const layoutStyle = {
  display: "flex",
  gap: 1
}

const avatarStyle = {
  width: "1.5em",
  height: "1.5em",
  mt: .5
};

const menuButtonStyle = {p: 0};

const ownerNameStyle = {fontSize: "60%"};

const dateStyle = { fontSize: "80%", opacity: .4, mt: 1};

export default function CommentCard({comment}) {
  // Debug
  // console.log("Render CommentCard")

  const {bearerToken, user} = useAuthContext()
  const {openEditCommentModal} = useModalContext()
  const {selectedCommentID, selectComment, onDeleteComment} = useCommentsContext()

  // Save content to separate state
  // In order to update dynamically
  const [content, setContent] = React.useState("")
  
  // Sync between inherited and displayed content
  React.useEffect(() => {
    setContent(comment.content)    
  }, [comment.content])

  // Delete comment
  const onDelete = useCallback(() => {
    // Confirm action
    const r = window.confirm("Are you sure?")
    if (!r) return

    // Request to delete the comment
    axios.delete(
      API.host + "/comments/" + selectedCommentID,
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      // Remove comment from comments pool
      onDeleteComment(selectedCommentID)
    }).catch(err => {
      alert("Something went wrong ...")
      // DEBUG
      console.log(err)
    })
  }, [bearerToken, selectedCommentID, onDeleteComment])

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

  return (
    <>
      {/* Edit Modal */}
      {comment.id === selectedCommentID &&
      <EditCommentModal
        comment={comment}
        currContent={content}
        setCurrContent={setContent}
      />}

      {/* Actions menu */}
      <CommentMenu
        anchorEl={menuAnchorEl}
        open={open}
        handleClose={handleCloseMenu}
        actions={comment.actions}
        onEdit={openEditCommentModal}
        onDelete={onDelete}
      />

      {/* Comment card*/}
      <Box sx={layoutStyle}>
        <Avatar sx={{...avatarStyle, backgroundColor: comment.owner.color, order: comment.owner.id === user.id ? 1 : 2}}>
          <Typography sx={ownerNameStyle}>
            {comment.owner.display_name[0].toUpperCase()}
          </Typography>
        </Avatar>
        <Card sx={{display: "grid", gridTemplateColumns: "auto max-content", alignItems: "flex-start", p: 2, order: comment.owner.id === user.id ? 2 : 1}}>
          <Box>
            <Typography
              variant="body1"
              component="p"
            >
              {content}
            </Typography>
            <Typography variant="body2" sx={{...dateStyle, textAlign: comment.owner.id === user.id ? "left" : "right"}}>
              {comment.created}
            </Typography>
          </Box>
          {/* Do not display menu icon if no actions are available */}
          {comment.actions.filter(a => a !== "View").length > 0 &&
          <IconButton sx={menuButtonStyle} onClick={e => {
            handleOpenMenu(e)
            selectComment(comment.id)
            }}>
            <MoreVert fontSize="small" sx={actionsIconStyle}/>
          </IconButton>}
        </Card>

      </Box>
    </>
  )
}
