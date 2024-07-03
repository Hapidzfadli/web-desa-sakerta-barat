import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export const getDecodedToken = (): DecodedToken | null => {
    const token = localStorage.getItem('token') || Cookies.get('session');
    if (!token) return null;
    
    try {
      return jwtDecode(token) as DecodedToken;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };