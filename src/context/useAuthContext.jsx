import axios from 'axios';
import React, { useState, useCallback, useEffect } from 'react';
import useFetchMe from '../hooks/useFetchMe';
import {API} from '../API';

const AuthContext = React.createContext({});

export function AuthContextProvider(props) {

  // Debug
  // console.log("AuthContextProvider: Rendering")

  // Authentication status
  const [authStatus, setAuthStatus] = useState("none")

  // Tokens state
  const [bearerToken, setBearerToken] = useState(props.localBearer)
  const [bearerTokenExp, setBearerTokenExp] = useState(props.localBearerExp)
  const [refreshToken, setRefreshToken] = useState(props.localRefresh)
  const [, setRefreshTokenExp] = useState(props.localRefreshExp)

  // Current user state
  const [user, setUser] = useState()

  // Hook to fetch current user info
  const {userData, userStatus, setUserStatus} = useFetchMe(bearerToken)
  
  // DEBUG
  // console.log("AuthContextProvider: Auth status: " + authStatus)
  // console.log("AuthContextProvider: User status: " + userStatus)
  
  // Function to login user
  const loginUser = useCallback(data => {
    // DEBUG
    // console.log("AuthContextProvider: useCallback: Logging in user")

    // Save all received data to local storage
    localStorage.setItem("bearerToken", data.bearer.token)
    localStorage.setItem("bearerTokenExp", data.bearer.expires)
    localStorage.setItem("refreshToken", data.refresh.token)
    localStorage.setItem("refreshTokenExp", data.refresh.expires)
    
    // Update relevant state
    setBearerToken(data.bearer.token)
    setBearerTokenExp(data.bearer.expires)
    setRefreshToken(data.refresh.token)
    setRefreshTokenExp(data.refresh.expires)
  }, [])
  
  // Function to logout user
  const logoutUser = useCallback(() => {
    // DEBUG
    // console.log("AuthContextProvider: useCallback: Logging out user")

    // Reset authentication status
    setAuthStatus("none")

    // Reset user status
    setUserStatus("pending")

    // Reset Tokens state
    setBearerToken("")
    setBearerTokenExp("")
    setRefreshToken("")
    setRefreshTokenExp("")

    // Reset user
    setUser()
    
    // Clear auth related stuff from localstorage
    localStorage.removeItem("bearerToken")
    localStorage.removeItem("bearerTokenExp")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("refreshTokenExp")
  }, [setUser, setUserStatus])
  
  // userStatus listener
  React.useEffect(() => {
    
    // Set authStatus to "ready" if userStatus is "ready"
    if (userStatus === "ready") {
      setAuthStatus("ready")
      setUser(userData)
    }

    // Set authStatus to "loading" if userStatus if "loading"
    userStatus === "loading" && setAuthStatus("loading")

    // Set authStatus to "error" if user fails to fetch
    userStatus === "error" && setAuthStatus("error")
  }, [userStatus, userData])

  // authStatus listener
  React.useEffect(() => {
    // Logout user in case authentication fails
    if (authStatus === "error") {
      alert("please relogin")
      logoutUser()
    }
  }, [authStatus, logoutUser])
  
  // Auto refresh Bearer token
  useEffect(() => {
    
    if (!bearerTokenExp || !refreshToken) return
    
    // Set interval for refreshing the token (exp time - 60s)
    const Interval = setInterval(() => {
      // Request to refresh token
      axios.post(
        API.host + "/auth/refresh",
      null,
      {headers: {Authorization: "Bearer " + refreshToken}}
    ).then(res => {
      setBearerToken(res.data.token)
      setBearerTokenExp(res.data.expires)
    }).catch(err => {
      setAuthStatus("error")
    })
  }, (bearerTokenExp - 60) * 1000)

  // Cleanup
  return () => clearInterval(Interval)

  }, [refreshToken, bearerTokenExp])

  return (
    <AuthContext.Provider value={{
      bearerToken, 
      user, loginUser, logoutUser, 
      authStatus, setAuthStatus
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => React.useContext(AuthContext);