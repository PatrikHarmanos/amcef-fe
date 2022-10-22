import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// MUI components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// icons
import { faEdit, faTrash, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// other imports
import { useUser } from '../lib/customHooks';
import { APP_ROUTES } from '../utils/constants';
import contactService from '../services/contactService';
import { Contact } from '../interfaces/Contact';
import EditModal from './EditModal';
import "./../styles/DashboardStyles.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  // check if user is logged in
  useUser();

  // states
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [reload, setReload] = useState<boolean>(false);
  const [language, setLanguage] = useState<string | null>('en');
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('')

  const handleOpen = (contact: Contact) => {
    setSelectedContact(contact)
    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  useEffect(() => {
    contactService
      .getContacts()
      .then(res => {
        setContacts(res.data)
        setQuery('')
        setFilteredContacts(res.data)
      })
      .catch(() => {});
  }, [reload])

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const results = contacts.filter(contact => {
      if (event.target.value === "") return contacts
      return contact.firstName.toLowerCase().includes(event.target.value.toLowerCase()) || contact.lastName.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setQuery(event.target.value)
    setFilteredContacts(results)
  }

  const logout = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    localStorage.removeItem('token');
    navigate(APP_ROUTES.SIGN_IN);
  }

  const deleteContact = (id: number) => {
    contactService
      .deleteContact(id)
      .then(() => {
        const newContacts = contacts.filter(contact => contact.id !== id);
        setContacts(newContacts)
        setQuery('')
        setFilteredContacts(newContacts)
      })
      .catch(() => {});
  }

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang).then(() => {
      localStorage.setItem('language', lang)
    });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('title')}
          </Typography>
          <Select
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
          <Button onClick={logout} style={{color: 'white'}} endIcon={<FontAwesomeIcon icon={faRightFromBracket} />}>
          {t('logout')}
          </Button>
        </Toolbar>
      </AppBar>
      <div className="dashboardContent p-16 bg-gray-800 h-screen w-screen">
        { open ? 
            <EditModal open={open} onClose={handleClose} contact={selectedContact} reload={() => setReload(!reload)} /> : ''
        }
        <form className='searchInput'>
          <TextField id="outlined-search" label={t('search')} type="search" onChange={search} value={query} />
        </form>
        {(!filteredContacts.length ? "Your query did not return any results" : (
          <TableContainer className='tableContainer' component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('firstName')}</TableCell>
                  <TableCell align="right">{t('lastName')}</TableCell>
                  <TableCell align="right">{t('phoneNumber')}</TableCell>
                  <TableCell align="right">{t('email')}</TableCell>
                  <TableCell align="right">{t('address')}</TableCell>
                  <TableCell align="right">{t('note')}</TableCell>
                  <TableCell align="right">{t('edit')}</TableCell>
                  <TableCell align="right">{t('delete')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContacts.map(contact => {
                  return (
                    <TableRow
                      className='table-row'
                      key={contact.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {contact.firstName}
                      </TableCell>
                      <TableCell align="right">{contact.lastName}</TableCell>
                      <TableCell align="right">{contact.phoneNumber}</TableCell>
                      <TableCell align="right">{contact.email}</TableCell>
                      <TableCell align="right">{contact.address}</TableCell>
                      <TableCell align="right">{contact.note}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" aria-label="add an alarm" onClick={() => handleOpen(contact)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" aria-label="add an alarm" onClick={() => deleteContact(contact.id)} >
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
      </div>
    </Box>
  );
}

export default Dashboard;