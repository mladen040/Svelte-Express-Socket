import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  authToken: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
