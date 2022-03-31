import PostCompactCard from '../cards/PostCompactCard';
import { Box } from '@mui/material';
import LoadMoreButton from "../buttons/LoadMoreButton";
import { useFeedContext } from '../../context/useFeedContext';
import InfoBox from '../InfoBox';

export default function FeedSection() {
  // Debug
  // console.log("Rendering FeedSection")

  const {posts, loadMorePosts, loadingMorePosts, showLoadMorePosts} = useFeedContext()

  return (
    <Box component="section">
      {/* Display "No posts yet" if no posts are in state */}
      {!posts.length ? <InfoBox text="No posts yet"/> : 
        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
          {posts.map(p => (
            <PostCompactCard key={p.id} post={p}/>
          ))}
        </Box>}
      {showLoadMorePosts && <LoadMoreButton handleClick={loadMorePosts} isLoading={loadingMorePosts}/>}
    </Box>
  )
}
