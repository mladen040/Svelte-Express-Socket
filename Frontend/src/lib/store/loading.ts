import { writable } from 'svelte/store';

export type ApiResponse = {
  data?: any;
  status: number;
  statusText: string;
  dismissable?: boolean;
};

export enum QueryMode {
  Qlx,
  Hide,
  Default
}

export type QueryType = {
  mode: QueryMode;
  method: string;
  endpoint: string;
};

function initPendingQuery() {
  const queryList: QueryType[] = [];

  const { subscribe, update, set } = writable(queryList);

  return {
    subscribe,
    update,
    set
  };
}

export const queryList = initPendingQuery();
// The queryList is used to keep the api queries in progressing.

function initLoading() {
  const loading = false;

  const { subscribe, update, set } = writable(loading);

  return {
    subscribe,
    update,
    set
  };
}

export const loading = initLoading();

function initQlxLoading() {
  const qlxloading = false;

  const { subscribe, update, set } = writable(qlxloading);

  return {
    subscribe,
    update,
    set
  };
}

export const qlxLoading = initQlxLoading();
