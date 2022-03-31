import React from "react";
import { usePostContext } from '../../context/usePostContext';
import PostFullCard from "../cards/PostFullCard";
import NewCommentForm from '../forms/NewCommentForm';
import CommentsSection from "../sections/CommentsSection";
import { Container} from '@mui/material';
import { useCommentsContext } from '../../context/useCommentsContext';
import EditPostModal from '../modals/EditPostModal';
import InfoBox from "../InfoBox";

const postStatusMessage = {
  "loading": "Loading post ...",
  "error": "Error loading post"
}

const commentsStatusMessage = {
  "pending": null,
  "loading": "Loading comments ...",
  "error": "Error loading comments"
}

export default function PostPage() {

  // Debug
  // console.log("Render PostPage")
  const {post, postStatus} = usePostContext()
  const {commentsStatus} = useCommentsContext()

  // Separating Content to a new state, 
  // In order to update it dynamically
  const [content, setContent] = React.useState("")

  // Sync between inherited and displayed content
  React.useEffect(() => {
    setContent(post.content)
  }, [post.content])

  return (
    <Container maxWidth="sm" sx={{display: "flex", flexDirection: "column", gap: 1, mt: 1}}>
      {postStatus === "ready" ? <>
        {/* Edit Modal */}
        <EditPostModal post={post} currContent={content} setCurrContent={setContent}/>
        {/* Post */}
        <PostFullCard post={post} content={content}/> 
        {/* New comment form */}
        <NewCommentForm postID={post.id}/>
        {commentsStatus === "ready" ?
            // Comments section
            <CommentsSection/> :
            // Show loading status while comments section fetching
            <InfoBox text={commentsStatusMessage[commentsStatus]}/>}
        </> :
          // Show loading status while comments section fetching
          <InfoBox text={postStatusMessage[postStatus]}/>}
    </Container>
  )
}
