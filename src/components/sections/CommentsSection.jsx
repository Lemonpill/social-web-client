import CommentCard from "../cards/CommentCard";
import { usePostContext } from "../../context/usePostContext";
import { Box } from "@mui/material";
import { useCommentsContext } from "../../context/useCommentsContext";
import LoadMoreButton from "../buttons/LoadMoreButton";
import InfoBox from "../InfoBox";

const mainBoxStyle = {display: "flex", flexDirection: "column", gap: 1};

export default function CommentsSection() {
  // Debug
  // console.log("Rendering CommentsSection")

  const {commentCount} = usePostContext()
  const {comments, onLoadMoreComments, loadingMoreComments, showLoadMoreComments} = useCommentsContext()

  return (
    <Box sx={mainBoxStyle}>
      <InfoBox text={commentCount > 0 ? `${commentCount} Comments` : "No comments yet"}/>
      {comments.map(c => <CommentCard key={c.id} comment={c}/>)}
      {showLoadMoreComments && <LoadMoreButton handleClick={onLoadMoreComments} isLoading={loadingMoreComments}/>}
    </Box>
  )
}
