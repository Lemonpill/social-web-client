import axios from "axios";
import { useState, useCallback } from "react";
import { useAuthContext } from "../../context/useAuthContext";
import {
  Card,
  TextField,
  Button
} from '@mui/material';
import { useCommentsContext } from "../../context/useCommentsContext";
import { API } from "../../API";

export default function NewCommentForm({ postID }) {
  // Debug
  // console.log("Rendering NewCommentForm")

  const {bearerToken} = useAuthContext()
  const {onAddComment} = useCommentsContext()
  
  // Input and errors state
  const [content, setContent] = useState("")
  const [contentError, setContentError] = useState("")

  // Request to create a new comment
  const handleSubmit = useCallback((e) => {
    // Debug
    // console.log("NewCommentForm: calling handleSubmit")

    // Prevent default event behavior
    e.preventDefault()

    // Clear previous errors
    setContentError()

    // Request to create a new comment
    axios.post(
      API.host + "/posts/" + postID + "/comments",
      {content},
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      onAddComment(res.data)
      // Reset form
      setContent("")
    }).catch(err => {
      if (err.response) setContentError(err.response.data.errors.content)
      else setContentError("Something went wrong ...")
    })
  }, [content, bearerToken, postID, onAddComment])

  return (
    <Card
      sx={{
        display:"flex",
        alignItems: "center",
        gap: 2,
        py: 1,
        px: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 0
      }}
    >
      <TextField
        label="Share your thoughts here"
        onChange={e => setContent(e.target.value)}
        value={content}
        error={contentError ? true : false}
        helperText={contentError ? contentError : " "}
        variant="standard"
        fullWidth
      />
      <Button
        onClick={handleSubmit}
        type="submit"
        variant="text"
        sx={{
          fontWeight: 400,
          color: "text.primary",
          p:0
        }}
      >
        Submit
      </Button>
    </Card>
  )
}
