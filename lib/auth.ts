import { User } from './types';

export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> => {
  try {
    const response = await fetch('http://localhost:7000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Erreur d’authentification');
    }

    const data = await response.json();

    return {
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Erreur dans authenticateUser:', error);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) as User : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du user depuis localStorage :', error);
    return null;
  }
};

export const saveAuthData = (user: User, token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('authToken', token);
  localStorage.setItem('userRole', user.role);
};

export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
};

