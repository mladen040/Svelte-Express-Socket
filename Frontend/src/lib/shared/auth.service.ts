import axios from 'axios';
import { navigate } from 'svelte-routing';
import { varEnv } from '../env';
import type { UserDto } from '../models';
import { clearAll, getToken } from './utils';

export const login = async (email: string, password: string) => {
  const url = `${varEnv.api_url}/login`;

  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    return await axios.post(url, { email, password }, { headers });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log('login error : ', err);
    }
  }

  return null;
};

export const register = async (params: UserDto) => {
  const url = `${varEnv.api_url}/signup`;

  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    return await axios.post(url, params, { headers });
  } catch (err) {
    if (axios.isAxiosError(err)) {
    }
  }

  return null;
};

export const logout = async () => {
  const url = `${varEnv.api_url}/logout`;

  try {
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    await axios.post(url, {}, { headers });
  } catch (err) {
    if (axios.isAxiosError(err)) {
    }
  }

  clearAll();
  navigate('/login');
};
