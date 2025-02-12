import { createContext } from 'react';

export type UserDetailType = {
  id: number;
  name: string;
  username: string;
  admin: boolean;
  avatar: string;
};

export type UserDetailContextType = {
  userDetails: UserDetailType | null;
  setUserDetails: (userDetail: UserDetailType | null) => void;
};

export const UserDetailContext = createContext<UserDetailContextType>({
  userDetails: {
    id: 0,
    name: '',
    username: '',
    admin: false,
    avatar: '',
  },
  setUserDetails: () => {},
});
