import React, { useCallback, useState } from 'react';
import Copyright from "../Copyright";
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LockOutlined from '@mui/icons-material/LockOutlined';
import {Button, TextField, Link, Grid, Box, Typography, Container, Card, InputAdornment, Avatar} from "@mui/material";
import axios from 'axios';
import {useAuthContext} from "../../context/useAuthContext";
import {API} from "../../API";
import { useNavigate } from "react-router-dom";

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  p: 4,
  boxShadow: 0
};

const avatarStyle = { m: 1.2, p: 3.4, bgcolor: 'primary.main' };

const titleStyle = {
  fontWeight: 400,
  opacity: .9
};

const buttonStyle = { mt: 3, mb: .5, py: 1.5 };

const signupLinkStyle = {
  textAlign: "center",
  display: "block",
  mt: 2
};

export default function LoginPage() {

  // DEBUG
  // console.log("Rendering: LoginPage")

  const navigate = useNavigate()
  const {loginUser} = useAuthContext()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const [pass, setPass] = useState("")
  const [passError, setPassError] = useState("")

  const clearErrors = useCallback(() => {
    setEmailError("")
    setPassError("")
  }, [])

  const clearFields = useCallback(() => {
    setEmail("")
    setPass("")
  }, [])

  const handleSubmit = React.useCallback(e => {
    e.preventDefault();
    clearErrors()
    
    axios.post(
      API.host + "/auth/token",
      {
        email: email,
        password: pass
      } 
      ).then(res => {
        clearFields()
        loginUser(res.data)
        navigate('/')
      }).catch(err => {
        if (err.response) {
          if (err.response.data.errors) {
            setEmailError(err.response.data.errors.email)
            setPassError(err.response.data.errors.password)
          }
        else setEmailError(err.response.data.error)
      }
      else {
        alert("Something went wrong ...")
      }
      // Clear password on failed submit
      setPass("")
    })
  }, [
    clearErrors,
    clearFields,
    email,
    loginUser,
    pass,
    navigate
  ]);

  return (
      <Container
        component="main"
        maxWidth="xs"
        sx={{pt: 2}}
      >
        <Card sx={cardStyle}>
          <Avatar sx={avatarStyle}>
            <AccountCircleOutlined fontSize="large" sx={{color: "#fff"}}/>
          </Avatar>
          <Typography component="h1" variant="h5" sx={titleStyle}>
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  autoFocus
                  variant="outlined"
                  type="email"
                  label="Email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  error={emailError ? true : false}
                  helperText={emailError ? emailError : " "}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{opacity: .8}}/>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant='outlined'
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  error={passError ? true : false}
                  helperText={passError ? passError : " "}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{opacity: .8}}/>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonStyle}
            >
              Login
            </Button>
            <Link href="/signup" variant="body2" sx={signupLinkStyle}>
              Don't have an account? Signup here!
            </Link>
          </Box>
        </Card>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}