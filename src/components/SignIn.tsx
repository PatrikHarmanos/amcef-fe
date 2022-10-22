import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeTokenInLocalStorage } from '../lib/common';

// mui components
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTranslation } from "react-i18next";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { APP_ROUTES } from '../utils/constants';
import { useUser } from '../lib/customHooks';
import authService from '../services/authService';

const SignIn = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // check if user is authentificated => navigate to dashboard
  const { user, authenticated } = useUser();
  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD)
  }

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [language, setLanguage] = useState<string | null>(localStorage.getItem('language'));

  const login = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    authService
      .signIn(username, password)
      .then(response => {
        if (!response?.data?.accessToken) {
          console.log('Something went wrong during signing in: ', response);
          return;
        }
        storeTokenInLocalStorage(response.data.accessToken);
        navigate(APP_ROUTES.DASHBOARD)
      })
      .catch(() => {});
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang).then(() => {
      localStorage.setItem("language", lang)
    });
  }

  return (
    <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {t('title')}
            </Typography>
            <Select
              style={{marginRight: '10px', color: '#fff'}}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              defaultValue={'en'}
              label="Language"
              onChange={(event) => changeLanguage(String(event.target.value))}
            >
              <MenuItem value={'en'}>EN</MenuItem>
              <MenuItem value={'sk'}>SK</MenuItem>
            </Select>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                  {t('loginTitle')}
                </Typography>
                <Box component="form" onSubmit={login} noValidate sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="username"
                        label={t('loginUsername')}
                        name="username"
                        onChange={e => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label={t('loginPassword')}
                        type="password"
                        id="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {t('loginButton')}
                    </Button>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <a href="/register">
                          {t('loginLink')}
                        </a>
                    </div>
                </Box>
            </Box>
        </Container>
    </div>
  );
}

export default SignIn;