import type { Fieldset, Shape, Value } from './shape';

export type Range<V extends Value> = [V, V];

export type Filter<S extends Shape> = {
  [K in keyof S]: S[K] extends null ? S[K] : S[K] | Range<S[K]>;
};

export type Sort<S extends Shape> = Record<keyof S, -1 | 1>

// Sorted selection
export interface View<S extends Shape> {
  keys: Array<number>;
  only: Filter<S>;
  seen?: number; // timestamp, can be used to free memory, undefined means new or open
  sort: Sort<S>;
}

export type Nullable<S extends Shape> = {
  [K in keyof S]: S[K] | null;
};

export interface Resource<S extends Shape = Shape, K extends number | string = string> {
  // Stored entries by key
  buffer: Record<K, S>;

  // Shape of the resource
  fields: Fieldset<S>;

  // Map of filtered and sorted array of keys
  lineup: Record<string, View<S>>;
}
