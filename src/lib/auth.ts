import { loginStart, loginSuccess, loginFailure } from '@/redux/slices/authSlice';
import type { AppDispatch } from '@/redux/store';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  _id: string;
  email: string;
  name: string;
  token: string;
  refreshToken: string;
}

interface ErrorResponse {
  success: boolean;
  message: string;
}

export const handleLogin = async (
  credentials: LoginCredentials,
  dispatch: AppDispatch
) => {
  try {
    dispatch(loginStart());

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json() as AuthResponse;

    // Store tokens
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    // Update Redux state
    dispatch(loginSuccess({
      _id: data._id,
      email: data.email,
      name: data.name,
      token: data.token,
    }));

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    dispatch(loginFailure(message));
    throw error;
  }
};

export const handleRegister = async (
  credentials: RegisterCredentials,
  dispatch: AppDispatch
) => {
  try {
    dispatch(loginStart());

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json() as AuthResponse;

    // Store tokens
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    // Update Redux state
    dispatch(loginSuccess({
      _id: data._id,
      email: data.email,
      name: data.name,
      token: data.token,
    }));

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    dispatch(loginFailure(message));
    throw error;
  }
};

export const handleLogout = (dispatch: AppDispatch) => {
  // Clear stored tokens
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  
  // Update Redux state
  dispatch({ type: 'auth/logout' });
};

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Add auth header setup
export const setupAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return {};
};