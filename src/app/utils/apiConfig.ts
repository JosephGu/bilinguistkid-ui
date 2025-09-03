
export const getBaseUrl = (): string => {

  if (process.env.NODE_ENV === 'production') {
    return ''; 
  }
  
  return 'http://localhost:3000';
};


export const API_BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {

  AUTH: {
    LOGIN: '/api/v1/auth/authenticate',
    REGISTER: '/api/v1/auth/register',
    VERIFY_CODE: '/api/v1/auth/verify-code/email',
  },
  

  PROFILE: {
    RETRIEVE: '/api/v1/profile/retrieve',
    UPDATE: '/api/v1/profile/update',
  },
};


export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};