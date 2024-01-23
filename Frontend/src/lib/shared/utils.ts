import axios from 'axios';
import { queryList, QueryMode, type ApiResponse } from '../store';

const hasLocalStorage = () => {
  return navigator.cookieEnabled && window.localStorage;
};

export function getItem(key) {
  if (hasLocalStorage()) {
    const item = localStorage.getItem(key);
    if (item) {
      return item;
    }
  }

  return null;
}

export function setItem(key, value) {
  if (hasLocalStorage()) {
    localStorage.setItem(key, value);
  }
}

export function removeItem(key) {
  if (hasLocalStorage()) {
    localStorage.removeItem(key);
  }
}

export function clearAll() {
  if (hasLocalStorage()) {
    localStorage.clear();
  }
}

export const getToken = () => {
  if (hasLocalStorage()) {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const saveToken = (token: string) => {
  if (hasLocalStorage()) {
    return localStorage.setItem('authToken', token);
  }
  return null;
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// API wrap function
const apiWrap = (f, method) => {
  return async (baseUrl: string, endpoint: string, body: Record<string, any> | null = null, mode = QueryMode.Default, showToast = true) => {
    queryList.update((value) => {
      value.push({ mode: mode, method, endpoint: endpoint });
      return value;
    });

    const response = await f(baseUrl, endpoint, body);

    queryList.update((value) => {
      return value.filter((e) => e.endpoint !== endpoint);
    });

    return response;
  };
};

export const post = apiWrap(async (baseUrl: string, endpoint: string, body) => {
  const url = `${baseUrl}${endpoint}`;

  const response = {
    data: null,
    endpoint: endpoint,
    status: 0,
    statusText: ''
  };

  try {
    const token = getToken();
    if (!token) throw new Error('token is not available');

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    const res = await axios.post(url, body, { headers });
    response.data = res.data;
    response.status = res.status;
    response.statusText = res.statusText;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        response.status = err.response.status;
        const data: any = err.response.data;
        response.statusText = data?.error_message || err.message;
      }
    }
  }

  return response;
}, 'POST');

export const put = apiWrap(async (baseUrl: string, endpoint: string, body): Promise<ApiResponse> => {
  const url = `${baseUrl}${endpoint}`;

  const response = {
    data: null,
    endpoint: endpoint,
    status: 0,
    statusText: ''
  };

  try {
    const token = await getToken();
    if (!token) throw new Error('token is not available');

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    const res = await axios.put(url, body, { headers });
    response.data = res.data;
    response.status = res.status;
    response.statusText = res.statusText;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        response.status = err.response.status;
        const data: any = err.response.data;
        response.statusText = data?.error_message || err.message;
      }
    }
  }

  return response;
}, 'PUT');

export const del = apiWrap(async (baseUrl: string, endpoint: string, body): Promise<ApiResponse> => {
  const url = `${baseUrl}${endpoint}`;

  const response = {
    data: null,
    endpoint: endpoint,
    status: 0,
    statusText: ''
  };

  try {
    const token = await getToken();
    if (!token) throw new Error('token is not available');

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    const res = await axios.delete(url, { headers });
    response.data = res.data;
    response.status = res.status;
    response.statusText = res.statusText;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        response.status = err.response.status;
        const data: any = err.response.data;
        response.statusText = data?.error_message || err.message;
      }
    }
  }

  return response;
}, 'DELETE');

export const get = apiWrap(async (baseUrl: string, endpoint: string, params: Record<string, string> | null = null): Promise<ApiResponse> => {
  const url = `${baseUrl}${endpoint}`;

  const response = {
    data: null,
    endpoint: endpoint,
    status: 0,
    statusText: '',
    hideToast: false
  };

  try {
    const token = await getToken();
    if (!token) throw new Error('token is not available');

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    const res = await axios.get(url, { headers, params });

    response.data = res.data;
    response.status = res.status;
    response.statusText = res.statusText;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        response.status = err.response.status || 0;
        const data: any = err.response.data;

        if (data?.error) {
          response.statusText = data?.error;
          console.log(`[API]: ${endpoint} failed `, data?.error);
          response.hideToast = true; // hide toast for intended server errors
        } else {
          response.statusText = data?.error_message || err.message;
        }
      }
    }
  }

  return response;
}, 'GET');
