import React, { useState, useCallback, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { usePostContext } from './usePostContext';
import axios from 'axios';
import {API} from '../API';

const CommentsContext = React.createContext({});

export function CommentsContextProvider(props) {
  // Debug
  // console.log("CommentsContextProvider: Initalizing")

  // Current context provider depends on both AuthContext and usePostContext
  const {bearerToken, authStatus} = useAuthContext()
  const {post, postStatus, setCommentCount} = usePostContext()

  // Comments pool state
  const [comments, setComments] = useState([])
  const [commentsStatus, setCommentsStatus] = useState("")
  const [loadingMoreComments, setLoadingMoreComments] = useState(false)
  const [showLoadMoreComments, setShowLoadMoreComments] = useState(false)

  // Selected comment ID is used for menus/modals
  const [selectedCommentID, setSelectedCommentID] = useState("")

  // Function to select a comment
  const selectComment = useCallback(id => setSelectedCommentID(id),[])

  // Function to push comment to comment pool
  const onAddComment = useCallback(c => {
    setComments(state => [c, ...state])
    setCommentCount(state => state += 1)
  }, [setCommentCount])
  
  // Function to remove comment from comment pool
  const onDeleteComment = useCallback((commentID) => {
    setComments(state => state.filter(c => c.id !== commentID))
    setCommentCount(state => state -= 1)
  }, [setCommentCount])

  // Function to load more comments
  const onLoadMoreComments = useCallback(() => {
    if (!bearerToken || !post.id) return
    
    const limit = API.fetchLimit

    setLoadingMoreComments(true)
    axios.get(
      API.host + `/posts/${post.id}/comments?offset=${comments.length}&limit=${limit}`,
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      // TODO: find cleaner implementation
      if (authStatus !== "ready") return
      // Join new comments with current comments
      setComments(state => [...state, ...res.data])
      if (res.data.length === limit) setShowLoadMoreComments(true)
      else setShowLoadMoreComments(false)
      setLoadingMoreComments(false)
    }).catch(err => {
      // Debug
      // console.log(err)
      alert("Something went wrong!")
      setLoadingMoreComments(false)
    })
  }, [bearerToken, post.id, comments.length, authStatus])

  // Fetch comments whenever post is in status "ready"
  useEffect(() => {
    if (!bearerToken || postStatus !== "ready") return
    // Debug
    // console.log("useEffect: Fetch comments")

    // Set comments status to "loading"
    setCommentsStatus("loading")

    const limit = API.fetchLimit

    // Request fetch current post comments
    axios.get(
      // Debug
      API.host + `/posts/${post.id}/comments?limit=${limit}`,
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      // TODO: find cleaner implementation
      if (authStatus !== "ready") return
      setComments(res.data)
      if (res.data.length === limit) setShowLoadMoreComments(true)
      else setShowLoadMoreComments(false)
      setCommentsStatus("ready")
      // Debug
      // console.log("useEffect: Fetch comments - success")
    }).catch(err => {
      setCommentsStatus("error")
      // Debug
      // console.log(err)
      // console.log("useEffect: Fetch comments - error")
    })
  }, [bearerToken, post.id, postStatus, authStatus])

  return (
    <CommentsContext.Provider value={{
      comments,
      commentsStatus, selectComment,
      selectedCommentID,
      onLoadMoreComments,
      loadingMoreComments,
      onAddComment, onDeleteComment,
      showLoadMoreComments
    }}>
      {props.children}
    </CommentsContext.Provider>
  );
}

export const useCommentsContext = () => React.useContext(CommentsContext);