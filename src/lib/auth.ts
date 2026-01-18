import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3113/api';

export const getUserSession = createServerFn({ method: 'GET' })
  .handler(async () => {
    const request = getRequest();
    const cookieHeader = request.headers.get('cookie') || '';

    try {
      const response = await axios.get(`${API_URL}/auth/get-session`, {
        headers: {
          Cookie: cookieHeader,
          Accept: 'application/json',
        },
        validateStatus: (status) => status < 500, 
      });

      if (response.status === 401 || response.status === 403) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Failed to fetch session:', error);
      return null;
    }
  });
