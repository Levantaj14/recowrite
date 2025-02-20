import { SocialType } from '@/apis/userApi';
import { createContext } from 'react';

export type UserDetailType = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  email: string;
  getEmail: boolean;
  language: string;
  socials: SocialType[];
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
    avatar: '',
    bio: '',
    email: '',
    getEmail: false,
    language: 'en',
    socials: [],
  },
  setUserDetails: () => {},
});
