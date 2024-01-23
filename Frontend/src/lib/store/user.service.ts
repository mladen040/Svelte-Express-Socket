import { writable } from 'svelte/store';
import type { User } from '../models';

export class UserService {
  public usersInGroup: User[] = [];
  public AuthedUser: User;
}

function createUserService() {
  const service: UserService = new UserService();

  const { subscribe, update, set } = writable(service);

  return {
    subscribe,
    update,
    set
  };
}

export const userService = createUserService();
