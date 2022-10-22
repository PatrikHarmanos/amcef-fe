import axios from "axios";
import { API_ROUTES } from '../utils/constants';
import { getTokenFromLocalStorage } from '../lib/common';

class AuthService {

    signIn = (username: string, password: string) => {
        let token = getTokenFromLocalStorage();
        return axios({
            method: 'POST',
            url: API_ROUTES.SIGN_IN,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                username: username,
                password: password,
            }
        });
    }

    signUp = (email: string, username: string, password: string) => {
        let token = getTokenFromLocalStorage();
        return axios({
            method: 'POST',
            url: API_ROUTES.SIGN_UP,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                email: email,
                username: username,
                password: password,
            }
        });
    }

}

export default new AuthService();