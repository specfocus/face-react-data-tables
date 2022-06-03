import { isNil } from '@specfocus/spec-focus/maybe';
import { useCallback, useEffect } from 'react';
import { atom, DefaultValue, selectorFamily, useRecoilState } from 'recoil';
import { Resource, View } from './resource';
import { Shape } from './shape';

type State = Record<string, Resource<Shape>>;

const store = atom<State>({ key: 'store', default: {} });

export const select = selectorFamily<Resource<Shape>, string>({
  key: 'resource',
  get: (key: string) => async ({ get }): Promise<Resource<Shape>> => {
    const { [key]: entry } = get(store);
    if (!(entry instanceof DefaultValue || isNil(entry))) {
      return entry;
    }
  },
  set: (key: string) => ({ get, set }, entry) => set(
    store,
    {
      ...get(store),
      [key]: entry
    }
  )
});

export const useResource = <S extends Shape>(key: string, initialValue: Resource<S>) => {
  const state = select(key);
  const [value, update] = useRecoilState(state);

  const clear = useCallback(
    () => update({
      ...value,
      buffer: []
    }),
    [value, update]
  );

  const reset = useCallback(
    () => update(initialValue),
    [initialValue, update]
  );

  useEffect(
    () => {
      if (isNil(value)) {
        reset();
      }
    },
    [value, reset]
  );

  const view = useCallback(
    ({ only, sort }: Pick<View<S>, 'only' | 'sort'>) => {
    },
    [value, update]
  );

  return {
    value: <Resource<S>>value,
    clear,
    reset,
    view
  };
};