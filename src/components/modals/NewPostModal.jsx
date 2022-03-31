import * as React from 'react';
import { useModalContext } from "../../context/useModalContext";
import { Box, Card, Modal, Fade, Typography, Backdrop, TextField } from '@mui/material';
import { useAuthContext } from "../../context/useAuthContext";
import axios from 'axios';
import { API } from '../../API';
import ModalSaveButton from "../buttons/ModalSaveButton";
import ModalCancelButton from '../buttons/ModalCancelButton';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  maxWidth: "70ch",
  border: '2px solid',
  borderColor: "divider",
  boxShadow: 0,
  display: "flex",
  overflow: "visible",
  flexDirection: "column",
  gap: 3,
  p: 2
};

const NewPostModal = ({onAddPost}) => {
    
  const {showNewPostModal, closeNewPostModal} = useModalContext()
  const {user, bearerToken} = useAuthContext()
  
  const [content, setContent] = React.useState("")
  const [contentError, setContentError] = React.useState("")

  const [loading, setLoading] = React.useState(false)
    
  const onCreate = React.useCallback(() => {
    // Reset previous error
    setContentError("")

    // Set loading state to true
    setLoading(true)

    // Request to create a post
    axios.post(
      API.host + "/posts",
      {content},
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      // Close modal
      closeNewPostModal()
      // Add post to feed
      onAddPost(res.data)
      // Reset loading and Content
      setLoading(false)
      setContent("")
    }).catch(err => {
      if (err.response) setContentError(err.response.data.errors.content)
      else {
        setContentError("something went wrong")
        // DEBUG
        console.log(err)
      }
      setLoading(false)
    })
  },[bearerToken, content, closeNewPostModal, onAddPost])

  const onCancel = React.useCallback(() => {
    // Confirm the action in case content was provided
    if (content) {
      const r = window.confirm("Discard post?")
      if (!r) return
    }
    // Reset the content
    setContent("")
    // Close the modal
    closeNewPostModal()
  }, [content, closeNewPostModal, setContent])

  return (
    <div>
      <Modal
        open={showNewPostModal}
        onClose={onCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showNewPostModal}>
          <Card sx={style}>
            <Box sx={{display: "flex", alignItems: "center"}}>
              <Box sx={{display: "flex", flexDirection: "column"}}>
                <Typography component="h1" variant="h6" sx={{fontWeight: "medium"}}>
                  Create a post
                </Typography>
                <Typography component="small" variant="body2" sx={{color: "text.secondary"}}>
                  as {user.display_name}
                </Typography>
              </Box>
            </Box>
            <Box>
              {/* Input field */}
              <TextField
                required
                fullWidth
                value={content}
                disabled={loading}
                onChange={e => setContent(e.target.value)}
                rows={7}
                multiline
                error={contentError ? true : false}
                helperText={contentError ? contentError : " "}
                autoFocus
              />
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
              {/* Save button */}
              <ModalSaveButton
                disabled={!content || loading}
                onClick={onCreate}
                text="Save"
              />
              <ModalCancelButton
                onClick={onCancel}
                text="Cancel"
                disabled={loading}
              />
            </Box>
          </Card>
        </Fade>
      </Modal>
    </div>
  );
}

export default NewPostModal