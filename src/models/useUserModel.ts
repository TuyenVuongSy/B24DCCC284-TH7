import { useState } from 'react';

export interface UserAccount {
  username: string;
  password?: string;
  role: string;
}

const DEFAULT_ACCOUNTS: UserAccount[] = [
  { username: 'admin', password: '123', role: 'Quản trị viên' },
  { username: 'user1', password: '123', role: 'Nhân viên 1' },
  { username: 'user2', password: '123', role: 'Nhân viên 2' },
];

const LOCAL_STORAGE_KEY = 'userAccountsData';

export default () => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const storedAccounts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAccounts) {
      try {
        return JSON.parse(storedAccounts);
      } catch (error) {
        return DEFAULT_ACCOUNTS;
      }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  });

  const saveAccounts = (newAccounts: UserAccount[]) => {
    setAccounts(newAccounts);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAccounts));
  };

  const addAccount = (account: UserAccount) => {
    saveAccounts([...accounts, account]);
  };

  return {
    accounts,
    addAccount,
    saveAccounts,
  };
};
