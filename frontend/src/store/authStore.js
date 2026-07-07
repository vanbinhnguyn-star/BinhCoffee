import { defineStore } from 'pinia';

const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
};
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    login(user, token) {
      this.user = user;
      this.token = token;
      setCookie('token', token);
      setCookie('user', JSON.stringify(user));
    },

    logout() {
      this.user = null;
      this.token = null;
      deleteCookie('token');
      deleteCookie('user');
    },

    loadFromStorage() {
      try {
        const token = getCookie('token');
        const user = JSON.parse(getCookie('user'));
        if (token && user) {
          this.token = token;
          this.user = user;
        }
      } catch {
        deleteCookie('token');
        deleteCookie('user');
      }
    }
  }
});