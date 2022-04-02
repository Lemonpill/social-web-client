import FeedSection from '../sections/FeedSection';
import { Container, Card, TextField } from '@mui/material';
import { useFeedContext } from "../../context/useFeedContext";
import NewPostModal from '../modals/NewPostModal';
import { useModalContext } from '../../context/useModalContext';
import React from 'react';
import InfoBox from '../InfoBox';

const containerStyle = {display: "flex", flexDirection: "column", gap: 1, mt: 1};

const cardStyle = {
  p: 2,
  boxShadow: 0,
  border: "1px solid",
  borderColor: "divider"
}

const postsStatusMessage = {
  "loading": "Loading feed ...",
  "error": "Error loading feed"
}

export default function HomePage() {

  // Debug
  // console.log("Render HomePage")

  const {status, addPost} = useFeedContext()
  const {openNewPostModal} = useModalContext()

  // Clicking text field opens New Post Modal
  const handleClickTextField = React.useCallback(e => {
    e.target.blur()
    openNewPostModal()
  }, [openNewPostModal])

  return (
    <Container maxWidth="sm" sx={containerStyle}>
      <NewPostModal onAddPost={addPost}/>
      <Card sx={cardStyle}>
        {/* Clicking text field opens new post modal */}
        <TextField
          fullWidth
          size="small"
          placeholder="What's going on?"
          onClick={handleClickTextField}
          // Reset value on change
          onChange={e => e.target.value = ""}
        />
      </Card>
      {status === "ready" ? 
          // Show feed section when ready
          <FeedSection/> :
          // Show status box while feed is loading
          <InfoBox text={postsStatusMessage[status]}/>}
    </Container>
  )
}

