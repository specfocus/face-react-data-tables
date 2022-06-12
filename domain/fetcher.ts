import { atom, selectorFamily, useRecoilCallback } from 'recoil';
import type { Domain } from './Domain';
// import type { Domain } from '@specfocus/spec-focus/domain';
import supplant from '@specfocus/spec-focus/expressions/supplant';

export const CONTENT_TYPE = 'content-type';

export interface FetchConfig {
  urlTemplate: string;
  lifeSpan?: number;
}

export const atomDomainConfig = atom<Record<string, FetchConfig>>({
  key: 'atomDomainFetcherConfig', // unique ID (with respect to other atoms/selectors)
  default: {}
});

export const requestOptions: RequestInit = {
  method: 'GET',
  // mode: 'no-cors',
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
};

export const useDomainConfig = () => useRecoilCallback(
  ({ snapshot, set }) => async (config: Record<string, FetchConfig>) => {
    const state = await snapshot.getPromise(atomDomainConfig);
    set(atomDomainConfig, { ...state, ...config });
  }
);

export const match = (arr: string[], s: string): string => {
  if (!s) {
    return '*';
  }
  let best: string;
  for (let item of arr) {
    if (s.startsWith(item) && (!best || best.length < s.length)) {
      best = item;
    }
  }
  return best ?? '*';
};

export const selectorDomainFetcher = selectorFamily<Domain, string>({
  key: 'selectorDomainFetcher',
  get: (key: string) => async ({ get }): Promise<Domain> => {
    const config = get(atomDomainConfig);
    const k = match(Object.keys(config), key);
    const { urlTemplate } = config[k] || { urlTemplate: '/domains/{key}.json' };
    const url = supplant(urlTemplate, { key });
    return fetch(url, requestOptions)
      .then(response => {
        if (response.headers.has(CONTENT_TYPE) && response.headers.get(CONTENT_TYPE).indexOf('application/json') !== -1) {
          return response.json() as Promise<Domain>;
        }
        return { type: key, values: [] } as Domain;
      })
      .catch(err => {
        console.error(err);
        return { type: key, values: [] } as Domain;
      });
  }
});
