import { LocalStorage } from '../repository/localStorage';
import { User } from '../models/user';

export function createAuthStore() {
  // note the use of this which refers to observable instance of the store
  return {
    token: new LocalStorage<string>('token').value,
    user: undefined as User | undefined,
    async fetchUserData() {
      const { data } = { data: {} };
      const user = data as any;
      this.user = user;
      return user;
    },
    setUser(user: User) {
      this.user = user;
    },
    setToken(token: string) {
      this.token = token;
      new LocalStorage<string>('token').value = token;
    },
    logout() {
      this.token = null;
      this.user = undefined;
      new LocalStorage('token').clear();
    },
    get isAuthenticated() {
      return !!this.token;
    },
  };
}

export type ThemeStore = ReturnType<typeof createAuthStore>;
