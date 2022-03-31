import React, { useState, useCallback, useEffect } from 'react';
import axios from "axios";
import {API} from '../API';
import { useAuthContext } from './useAuthContext';

const FeedContext = React.createContext({});

export function FeedContextProvider(props) {

  // Debug
  // console.log("FeedContextProvider: Initalizing")

  // Current context provider depends on AuthContext
  const {bearerToken, authStatus} = useAuthContext()
  
  // Posts pool state
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState("loading")
  const [showLoadMorePosts, setShowLoadMorePosts] = useState(false)
  const [loadingMorePosts, setLoadingMorePosts] = useState(false)

  // Selected post ID is used for menus/modals
  const [selectedPostID, setSelectedPostID] = useState("")
  
  // DEBUG
  // console.log("Feed status: " + status)
  // console.log(bearerToken)

  // Function to select a post
  const selectPost = useCallback(id => setSelectedPostID(id), [])
  
  // Function to fetch more posts into posts pool
  const loadMorePosts = useCallback(() => {
    if (!bearerToken) return

    const limit = API.fetchLimit

    setLoadingMorePosts(true)
    // Fetch latest feed posts
    axios.get(
      API.host + `/posts?offset=${posts.length}&limit=${limit}`,
      {headers: {Authorization: "Bearer " + bearerToken}}
      ).then(res => {
        // TODO: find cleaner implementation
        if (authStatus !== "ready") return
        // Join fetched posts with current posts
        setPosts(state => [...state, ...res.data])
        // Conditionally display "Load More" button
        if (res.data.length === limit) setShowLoadMorePosts(true)
        else setShowLoadMorePosts(false)
        setLoadingMorePosts(false)
      }).catch(err => {
        // Debug
        // console.log(err)
        setLoadingMorePosts(false)
      })
    }, [posts.length, bearerToken, authStatus])
    
    // Function to push new post to pool
    const addPost = useCallback(post => {
      // DEBUG
      // console.log("Added post: " + post.id)
      
      setPosts(state => [post, ...state])
    }, [])
    
    // Function to remove a post from pool
    const removePost = useCallback(postID => {
      // DEBUG
      // console.log("Removed post: " + postID)
      
      setPosts(state => state.filter(p => p.id !== postID))
    }, [])
    
    // Initial feed fetch
    useEffect(() => {
      if (status !== "loading") return
      
      const limit = API.fetchLimit
      
      // DEBUG
      // console.log("Fetching feed")
      axios.get(
        API.host + `/posts?limit=${limit}`,
        {headers: {Authorization: "Bearer " + bearerToken}}
      ).then(res => {
        // TODO: find cleaner implementation
        if (authStatus !== "ready") return
        setPosts(res.data)
        // Conditionally display "Load More" button
        if (res.data.length === limit) setShowLoadMorePosts(true)
        setLoadingMorePosts(false)
        setStatus("ready")
        // DEBUG
        // console.log("Fetched feed")
      }).catch(err => {
        setStatus("error")
        
        // DEBUG
        throw new Error(err)
      })
    }, [status, bearerToken, authStatus])

    return <FeedContext.Provider value={{
      status, posts,
      loadMorePosts, loadingMorePosts,
      addPost, removePost, selectPost,
      selectedPostID,
      showLoadMorePosts
    }}>
      {props.children}
    </FeedContext.Provider>;
}

export const useFeedContext = () => React.useContext(FeedContext);