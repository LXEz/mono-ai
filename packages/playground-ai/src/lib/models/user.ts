import { ACCESS_TOKEN } from '@/lib/constants/define';

export interface User {
  id?: string;
  nickname: string;
  avatar: string;
  accessToken?: string;
}

// Storage key constant
const USER_STORAGE_KEY = 'playground_user';

const defaultUser: User = {
  id: '1',
  nickname: 'reader',
  accessToken: ACCESS_TOKEN,
  avatar:
    'https://thirdwx.qlogo.cn/mmopen/vi_32/hBcQpxRLuzBibFnLrm6QCpicdJlV9vRKfKu0wDU5iaian4cOUPIicOR7AuRjVtgpe9RA8RC6rkwXjczSuganDs5w4gQ/132',
};

// User related utility functions
const userUtils = {
  // Get user from session storage
  getUser: (): User | null => {
    if (!sessionStorage) {
      return null;
    }
    const userStr = sessionStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Save user to session storage
  saveUser: (user: User): void => {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  // Clear user from session storage
  clearUser: (): void => {
    sessionStorage.removeItem(USER_STORAGE_KEY);
  },

  // Check if user exists in session storage
  hasUser: (): boolean => {
    return !!sessionStorage.getItem(USER_STORAGE_KEY);
  },
};

if (sessionStorage) {
  userUtils.saveUser(defaultUser);
}

export default userUtils;
