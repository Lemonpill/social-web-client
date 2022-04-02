import * as React from 'react';
import { useModalContext } from "../../context/useModalContext";
import { Box, Card, Modal, Fade, Typography, Backdrop, TextField } from '@mui/material';
import axios from "axios";
import { useAuthContext } from "../../context/useAuthContext";
import { API } from '../../API';
import ModalSaveButton from '../buttons/ModalSaveButton';
import ModalCancelButton from '../buttons/ModalCancelButton';

const cardStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  maxWidth: "70ch",
  display: "flex",
  overflow: "visible",
  flexDirection: "column",
  gap: 3,
  p: 2,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: 0
};

const headerStyle = {display: "flex", alignItems: "center"}

const metaStyle = {display: "flex", gap: 1, alignItems: "center"}

const footerStyle = {display: "flex", gap: 2}

export default function EditCommentModal({comment, currContent, setCurrContent}) {

  const {closeEditCommentModal, showEditCommentModal} = useModalContext()
  const {bearerToken} = useAuthContext()

  const [newContent, setNewContent] = React.useState("")
  const [contentError, setContentError] = React.useState("")

  const [loading, setLoading] = React.useState(false)

  // Closing Modal
  const onCancel = React.useCallback(() => {
    // Confirm action in case content has changed
    if (currContent !== newContent) {
      const r = window.confirm("Discard all changes?")
      if (!r) return
    }
    // Close Modal
    closeEditCommentModal()
    // Reset new content to old one
    setNewContent(currContent)
  }, [closeEditCommentModal, currContent, newContent])

  // Saving changes
  const onSave = React.useCallback(() => {
    // Reset errors on submit
    setContentError("")

    // Verify comment is not empty
    if (!newContent) {
      setContentError("content can not be empty")
      return
    }

    // Set loading state to true
    setLoading(true)

    // Request to update the comment
    axios.patch(
      API.host + "/comments/" + comment.id,
      {content: newContent},
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      // Update card content
      setCurrContent(newContent)
      // Close the modal
      closeEditCommentModal()
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
  }, [closeEditCommentModal, bearerToken, newContent, comment.id, setCurrContent])

  // Update new content when current content changes
  React.useEffect(() => {
    setNewContent(currContent)
  }, [currContent])

  return (
    <div>
      <Modal
        open={showEditCommentModal}
        onClose={onCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableScrollLock
      >
        <Fade in={showEditCommentModal}>
          <Card sx={cardStyle}>
            <Box sx={headerStyle}>
              <Box sx={metaStyle}>
                <Typography component="p" variant="body1" sx={{fontWeight: "medium"}}>
                  {comment.owner.display_name}
                </Typography>
                <Typography component="small" variant="body2" sx={{color: "text.secondary"}}>
                  {comment.created}
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
                error={contentError ? true : false}
                helperText={contentError ? contentError : " "}
                disabled={loading}
                autoFocus
              />
            </Box>
            <Box sx={footerStyle}>
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