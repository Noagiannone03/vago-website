import { AuthProvider } from '@refinedev/core';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: error.message || 'Invalid email or password',
        },
      };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      return {
        success: true,
        redirectTo: '/login',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'LogoutError',
          message: error.message,
        },
      };
    }
  },

  check: async () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve({
            authenticated: true,
          });
        } else {
          resolve({
            authenticated: false,
            redirectTo: '/login',
            logout: true,
          });
        }
      });
    });
  },

  getPermissions: async () => {
    const user = auth.currentUser;
    if (user) {
      return ['admin']; // You can implement role-based permissions here
    }
    return null;
  },

  getIdentity: async () => {
    const user = auth.currentUser;
    if (user) {
      return {
        id: user.uid,
        name: user.displayName || user.email || 'Admin',
        avatar: user.photoURL,
        email: user.email,
      };
    }
    return null;
  },

  onError: async (error) => {
    console.error('Auth error:', error);
    return { error };
  },
};
