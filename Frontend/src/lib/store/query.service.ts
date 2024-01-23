import { writable } from 'svelte/store';
import type { User } from '../models';

export class QueryService {
  public getQueryForGroup(group: string) {
    return `SELECT * FROM public.user_entity WHERE "group"='${group}'`;
  }

  public getQueryForProducts(user: User) {
    let query = '';

    if (user.role === 'Admin') {
      query = `SELECT * FROM public.product_entity WHERE "userGroup"='${user.group}'`;
    } else {
      query = `SELECT * FROM public.product_entity WHERE "userGroup"='${user.group}'`;
    }

    query = `${query} ORDER BY id ASC`;
    return query;
  }
}

function createQueryService() {
  const service: QueryService = new QueryService();

  const { subscribe, update, set } = writable(service);

  return {
    subscribe,
    update,
    set
  };
}

export const queryService = createQueryService();
