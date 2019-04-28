import { assoc, lensProp, over } from 'ramda';

export type Store = {
  name: string;
  vote: number;
  scrollValue: string;
};

export type StoreAction = (s: Store) => Store;

export const initialStore: Store = Object.freeze({
  name: '',
  vote: 0,
  scrollValue: '',
});

export function makeUpdateNameAction(name: string): StoreAction {
  return assoc('name', name);
}

export function makeUpdateVoteAction(value: number): StoreAction {
  return over(lensProp('vote'), acc => acc + value);
}

export function makeUpdateScrollValue(scrollValue: string): StoreAction {
  return assoc('scrollValue', scrollValue);
}
