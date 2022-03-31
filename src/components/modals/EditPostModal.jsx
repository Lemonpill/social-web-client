import * as React from 'react';
import { useModalContext } from "../../context/useModalContext";
import { Box, Card, Modal, Fade, Typography, Backdrop, TextField } from '@mui/material';
import axios from "axios";
import { useAuthContext } from "../../context/useAuthContext";
import { API } from '../../API';
import ModalSaveButton from "../buttons/ModalSaveButton";
import ModalCancelButton from "../buttons/ModalCancelButton";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  maxWidth: "70ch",
  border: '1px solid',
  borderColor: "divider",
  boxShadow: 0,
  display: "flex",
  overflow: "visible",
  flexDirection: "column",
  gap: 3,
  p: 2
};

export default function EditPostModal({post, currContent, setCurrContent}) {

  const {closeEditPostModal, showEditPostModal} = useModalContext()
  const {bearerToken} = useAuthContext()

  const [newContent, setNewContent] = React.useState("")
  const [contentError, setContentError] = React.useState("")
  
  const [loading, setLoading] = React.useState(false)

  // Closing the modal
  const onCancel = React.useCallback(() => {
    // Confirm action in case content has changed
    if (currContent !== newContent) {
      const r = window.confirm("Discard all changes?")
      if (!r) return
    }
    // Close the modal
    closeEditPostModal()
    // Reset new content to old one
    setNewContent(currContent)
  }, [closeEditPostModal, currContent, newContent])

  // Saving changes
  const onSave = React.useCallback(() => {
    // Reset errors on submit
    setContentError("")

    // Verify post is not empty
    if (!newContent) {
      setContentError("content can not be empty")
      return
    }

    // Set loading state to true
    setLoading(true)

    // Request to update the post
    axios.patch(
      API.host + "/posts/" + post.id,
      {content: newContent},
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      // Update card content
      setCurrContent(newContent)
      // Close the modal
      closeEditPostModal()
      // Reset loading state
      setLoading(false)
    }).catch(err => {
      if (err.response) setContentError(err.response.data.errors.content)
      else setContentError("something went wrong ...")
      // Reset loading state
      setLoading(false)
      // DEBUG
      console.log(err)
    })
  }, [closeEditPostModal, bearerToken, newContent, post.id, setCurrContent])

  // Update new content when content changes
  React.useEffect(() => {
    setNewContent(currContent)
  }, [currContent])

  return (
    <div>
      <Modal
        open={showEditPostModal}
        onClose={onCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableScrollLock
      >
        <Fade in={showEditPostModal}>
          <Card sx={style}>
            <Box sx={{display: "flex", alignItems: "center"}}>
              <Box sx={{display: "flex", flexDirection: "column"}}>
                <Typography component="p" variant="body1" sx={{fontWeight: "medium"}}>
                  {post.owner.display_name}
                </Typography>
                <Typography component="small" variant="body2" sx={{color: "text.secondary"}}>
                  {post.created}
                </Typography>
              </Box>
            </Box>
            <Box>
              <TextField
                fullWidth
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={7}
                multiline
                disabled={loading}
                error={contentError ? true : false}
                helperText={contentError ? contentError : " "}
                autoFocus
              />
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
              <ModalSaveButton
                text="Save"
                onClick={onSave}
                disabled={(currContent === newContent) || loading}
              />
              <ModalCancelButton
                text="Cancel"
                onClick={onCancel}
                disabled={loading}
              />
            </Box>
          </Card>
        </Fade>
      </Modal>
    </div>
  );
}