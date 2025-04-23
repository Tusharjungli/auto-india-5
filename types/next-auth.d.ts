import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      isAdmin?: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    isAdmin?: boolean;
  }
}
