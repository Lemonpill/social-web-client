import { useCallback, useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LockOutlined from '@mui/icons-material/LockOutlined';
import {Button, TextField, Link, Grid, Box, Typography, Container, Card, InputAdornment, Avatar} from "@mui/material"
import axios from 'axios';
import Copyright from '../Copyright';
import {API} from '../../API';
import { useNavigate } from 'react-router';

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

const disclaimerStyle = {textAlign: "center", fontSize: "80%"};

const loginLinkStyle = {
  textAlign: "center",
  display: "block",
  mt: 2
};

const buttonStyle = { mt: 3, mb: .5, py: 1.5};

export default function SignUpPage() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const [pass, setPass] = useState("")
  const [passError, setPassError] = useState("")

  const [passConf, setPassConf] = useState("")
  const [passConfError, setPassConfError] = useState("")

  const clearErrors = useCallback(() => {
    setNameError("")
    setEmailError("")
    setPassError("")
    setPassConfError("")
  }, [])

  const clearFields = useCallback(() => {
    setName("")
    setEmail("")
    setPass("")
    setPassConf("")
  }, [])

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    clearErrors()

    if (pass !== passConf) {
      setPassError("Passwords do not match")
      setPass("")
      setPassConf("")
      return
    }

    axios.post(
      API.host + "/auth/signup",
      {
        display_name: name,
        email: email,
        password: pass
      } 
    ).then(res => {
      // DEBUG
      alert("Successfully signed up!")
      clearFields()
      navigate('/login')
    }).catch(err => {
      if (err.response) {
        setNameError(err.response.data.errors.display_name)
        setEmailError(err.response.data.errors.email)
        setPassError(err.response.data.errors.password)
      }
      else {
        alert("Something went wrong ...")
      }
      // Reset password confirmation
      setPassConf("")
    })
  }, [clearErrors, clearFields, email, name, navigate, pass, passConf])

  return (
      <Container
        component="main"
        maxWidth="xs"
        sx={{pt: 2}}
      >
        <Card
          sx={cardStyle}
        >
          <Avatar sx={avatarStyle}>
            <LockOutlinedIcon fontSize="large"/>
          </Avatar>
          <Typography component="h1" variant="h5" sx={titleStyle}>
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant='outlined'
                  label="Public name"
                  autoComplete="user-name"
                  name="name"
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  error={nameError ? true : false}
                  helperText={nameError ? nameError : " "}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleOutlined sx={{opacity: .8}}/>
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant='outlined'
                  label="Confirm password"
                  type="password"
                  value={passConf}
                  onChange={e => setPassConf(e.target.value)}
                  error={passConfError ? true : false}
                  helperText={passConfError ? passConfError : " "}
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
              Sign Up
            </Button>
            <Typography variant="body2" sx={disclaimerStyle}>
              By clicking Sign Up, you agree to <Link href="/terms">Terms of use</Link>
            </Typography>
            <Link href="/login" variant="body2" sx={loginLinkStyle}>
              Already have an account? Login here!
            </Link>
          </Box>
        </Card>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}