import { User } from './types';

const API_BASE_URL = 'https://backendeva.onrender.com'; // à adapter si besoin

// Authentifie l'utilisateur auprès du backend Express
export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.warn("Échec de l'authentification:", response.status);
      return null;
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

// Récupère l'utilisateur courant depuis localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    const parsed = JSON.parse(userData);

    // Vérifie que c’est bien un objet avec les clés attendues
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'email' in parsed &&
      'role' in parsed
    ) {
      return parsed as User;
    } else {
      console.warn('Structure inattendue pour user dans localStorage.');
      localStorage.removeItem('user');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du user:', error);
    localStorage.removeItem('user');
    return null;
  }
};

// Enregistre user + token + rôle dans localStorage
export const saveAuthData = (user: User, token: string) => {
  if (typeof window === 'undefined') return;
  

  try
  {
    localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('authToken', token);
  localStorage.setItem('userRole', user.role);
} catch (error) {
    console.error('Erreur lors de la sauvegarde des données d\'authentification:', error);
  }
};

// Supprime les données d'authentification
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
};

// Récupère le token actuel
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Récupère le rôle de l'utilisateur
export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole');
};
