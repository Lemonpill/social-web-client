import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useAuthContext } from './useAuthContext';
import {API} from '../API';

const PostContext = React.createContext({});

export function PostContextProvider(props) {

  // Debug
  // console.log("PostContextProvider: Initalizing")

  const params = useParams()
  const {bearerToken, authStatus} = useAuthContext()

  const [postID, setPostID] = useState(params.id)
  const [post, setPost] = useState({})
  const [postStatus, setPostStatus] = useState("")
  const [commentCount, setCommentCount] = useState("")

  // Fetch post
  useEffect(() => {
    if (!bearerToken || !postID) return
    setPostStatus("loading")
    // Debug
    // console.log("PostContextProvider: useEffect: Fetch post")
    axios.get(
      API.host + "/posts/" + postID,
      {headers: {Authorization: "Bearer " + bearerToken}}
    ).then(res => {
      // TODO: find cleaner implementation
      if (authStatus !== "ready") return
      setPost(res.data)
      setPostStatus("ready")
      setCommentCount(res.data.comments)
      // Debug
      // console.log("useEffect: Fetch post - success")
    }).catch(err => {
      setPostStatus("error")
      // Debug
      // console.log(err)
      // console.log("useEffect: Fetch post - error")
    })
  }, [bearerToken, postID, authStatus])

  return (
    <PostContext.Provider value={{
      post, postStatus,
      commentCount, setCommentCount,
      postID, setPostID
    }}>
      {props.children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => React.useContext(PostContext);