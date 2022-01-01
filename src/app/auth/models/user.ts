import { Role } from './role';

export class User {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isSetSubscriber:boolean;
  role: Role;
  token?: string;
  username: string;
}
