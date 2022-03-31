import CommentMenu from '../menus/CommentMenu';
import MoreVert from "@mui/icons-material/MoreVert";
import { Card, Typography, Box, IconButton } from '@mui/material';
import React, { useCallback } from "react";
import { useModalContext } from '../../context/useModalContext';
import { useCommentsContext } from "../../context/useCommentsContext";
import EditCommentModal from "../modals/EditCommentModal";
import axios from 'axios';
import { API } from '../../API';
import { useAuthContext } from '../../context/useAuthContext';

export default function CommentCard({comment}) {
  // Debug
  // console.log("Render CommentCard")

  const {bearerToken} = useAuthContext()
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
    <div>
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
      <Card
        sx={{
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
            alignItems: "center",
            gap: 1
          }}>
            <Typography component="p" variant="body1" sx={{fontWeight: "medium"}}>
              {comment.owner.display_name}
            </Typography>
            <Typography component="small" variant="body2" sx={{color: "text.secondary"}}>
              {comment.created}
            </Typography>
          </Box>
          
          {/* Do not display menu icon if no actions are available */}
          {comment.actions.filter(a => a !== "View").length > 0 &&
            <IconButton onClick={e => {
              handleOpenMenu(e)
              selectComment(comment.id)
              }}>
              <MoreVert fontSize="small" sx={{color: "text.secondary"}}/>
            </IconButton>}
        </Box>
        <Box>
          <Typography
          variant="body1"
          component="p"
          sx={{mb: .4}}
          >
            {content}
          </Typography>
        </Box>
      </Card>
    </div>
  )
}
