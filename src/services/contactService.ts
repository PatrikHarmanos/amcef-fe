import axios from "axios";
import { API_ROUTES } from '../utils/constants';
import { getTokenFromLocalStorage } from '../lib/common';
import { Contact } from '../interfaces/Contact';

class ContactsService {

    getContacts = () => {
        let token = getTokenFromLocalStorage();
        return axios({
            method: 'GET',
            url: API_ROUTES.CONTACTS,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    deleteContact = (id: number) => {
        let token = getTokenFromLocalStorage();
        return axios({
            method: 'DELETE',
            url: API_ROUTES.CONTACTS + '/' + id,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    editContact = (contact: Contact, id: number) => {
        let token = getTokenFromLocalStorage();
        return axios({
            method: 'PUT',
            url: API_ROUTES.CONTACTS + "/" + id,
            data: contact,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });        
    }


}

export default new ContactsService();