import axios from 'axios';
import React from 'react';
import { API } from '../API';

export default function useFetchMe(token) {
  // Custom hook for fetching current user data

  const [userData, setUserData] = React.useState()
  const [userStatus, setUserStatus] = React.useState("pending")

  // Request current user info
  React.useEffect(() => {
    if (!token) return
    setUserStatus("loading")
    axios.get(
      API.host + "/users/me",
      {headers: {Authorization: "Bearer " + token}}
    ).then(res => {
      setUserData(res.data)
      setUserStatus("ready")
    })
    .catch(err => {
      setUserStatus("error")
    })
  }, [token])

  return {
    userData, userStatus, setUserStatus, setUserData
  }
}
