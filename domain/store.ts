import { MaybePromise, isNil } from '@specfocus/spec-focus/maybe';
import React from 'react';
import { atom, DefaultValue, selectorFamily, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import type { Domain } from './Domain';
import { selectorDomainFetcher } from './fetcher';
// import { isPromise } from '@specfocus/spec-focus/promise';

export declare type DomainStore = Record<string, MaybePromise<Domain>>;

export const atomDomainStore = atom<DomainStore>({
  key: 'atomDomainStore',
  default: {}
});

export const selectorDomain = selectorFamily<Domain, string>({
  key: 'selectorDomain',
  get: (key: string) => async ({ get }): Promise<Domain> => {
    const { [key]: entry } = get(atomDomainStore);
    if (!(entry instanceof DefaultValue || isNil(entry))) {
      return entry;
    }
  },
  set: (key: string) => ({ get, set }, entry) => set(
    atomDomainStore,
    {
      ...get(atomDomainStore),
      [key]: entry
    }
  )
});

export const selectorDomains = selectorFamily<Record<string, Domain>, string[]>({
  key: 'selectorDomains',
  get: (keys: string[]) => ({ get }) => keys.reduce(
    (acc, key) => {
      const { [key]: entry } = get(atomDomainStore);
      if (!(entry instanceof DefaultValue || isNil(entry))) {
        Object.assign(acc, { [key]: entry });
      }
      return acc;
    },
    {}
  )
});

export const useDomainFetch = () => useRecoilCallback(({ snapshot, set }) => async (key: string) => {
  const loadable = snapshot.getLoadable(selectorDomainFetcher(key));
  const { state } = loadable;
  let domain: Domain;
  switch (state) {
    case 'loading':
      const promise = Promise.resolve(loadable.toPromise());
      set(atomDomainStore, store => ({
        ...store,
        [key]: promise
      }));
      domain = await promise;
      set(selectorDomain(key), domain);
      break;
    case 'hasValue':
      domain = loadable.getValue();
      break;
    case 'hasError':
      break;
  }
  return domain;
});

export const useDomain = <T = any>(key: string, timespan?: number) => {
  const fetcher = useDomainFetch();
  const [entry, set] = useRecoilState(selectorDomain(key));
  React.useEffect(
    () => {
      const expireTime = typeof timespan === 'number' && Number.isSafeInteger(timespan) ? Date.now() : 0;
      if (key && !entry || (expireTime > 0 && entry.expireTime > 0 && expireTime > entry?.expireTime)) {
        fetcher(key).then(domain => set({ ...domain, expireTime: timespan ? Date.now() + timespan : -1 }));
      }
    },
    [entry, fetcher, set]
  );
  return entry || { type: key, values: [] };
};

export const isPromise = <T>(val: unknown): val is Promise<T> =>
  Promise.resolve(val) == val;

export const useDomain2 = (key: string): Domain => {
  const requireDomain = useDomainFetch();
  const value = useRecoilValue(selectorDomain(key));
  if (!key) {
    return null;
  }
  if (isPromise(value)) {
    return { type: key, values: [] };
  } else if (isNil(value)) {
    requireDomain(key);
    return { type: key, values: [] };
  }
  return value;
};


export const useDomains = (keys: string[]): Record<string, Domain> => {
  const requireDomain = useDomainFetch();
  const ready = useRecoilValue(selectorDomains(keys));
  console.log({ store: ready });
  keys.forEach(key => {
    if (!(key in ready)) {
      console.log({ require: key });
      requireDomain(key);
    }
  });
  return ready;
};