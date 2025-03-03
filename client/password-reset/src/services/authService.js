import axios from 'axios';
import {API_URL} from '../utils/config';

export const register = async (userData) => {
    return await axios.post(`${API_URL}/auth/register`, userData);
  };

  export const forgotPassword = async (email) => {
    return await axios.post(`${API_URL}/password/forgot-password`, { email });
  };

export const resetPassword = async (token, newPassword)=>{
    return await axios.post(`${API_URL}/password/reset-password`,
        {token, newPassword}
    )
};