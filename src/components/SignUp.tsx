import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// mui components
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import authService from '../services/authService';
import { APP_ROUTES } from '../utils/constants';
import '../styles/FormStyles.scss';

type FormValues = {
    username: string;
    password: string;
    email: string;
};

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().min(5).required(),
    email: yup.string().email().required(),
}).required();

const SignUp = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [language, setLanguage] = useState<string | null>(localStorage.getItem('language'));

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema)
  }); 

  const signUp = handleSubmit(() => {
    authService
      .signUp(email, username, password)
      .then(response => {
        if (!response?.data?.success) {
            console.log('Something went wrong during signing up: ', response);
            return;
        }
        navigate(APP_ROUTES.SIGN_IN);
      })
      .catch(() => {});
  });

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
                        {t('registerTitle')}
                    </Typography>
                    <Box component="form" onSubmit={signUp} sx={{ mt: 5 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    {...register("username")}
                                    fullWidth
                                    id="username"
                                    label={t('loginUsername')}
                                    autoFocus
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </Grid>
                            {errors?.username && <p className='form-error'>{errors.username.message}</p>}
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                id="email"
                                label={t('registerEmail')}
                                {...register("email")}
                                autoComplete="email"
                                onChange={e => setEmail(e.target.value)}
                                />
                            </Grid>
                            {errors?.email && <p className='form-error'>{errors.email.message}</p>}
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                {...register("password")}
                                label={t('loginPassword')}
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={e => setPassword(e.target.value)}
                                />
                            </Grid>
                            {errors?.password && <p className='form-error'>{errors.password.message}</p>}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {t('registerButton')}
                        </Button>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <a href="/login">
                                {t('registerLink')}
                            </a>
                        </div>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default SignUp;