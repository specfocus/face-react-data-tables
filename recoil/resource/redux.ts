import { atom, DefaultValue, RecoilState, selector, selectorFamily, useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { Dispatch } from 'react';
import { SimpleType } from '@specfocus/main-focus/object';
import { isNil } from '@specfocus/main-focus/maybe';

export declare type Action = string | [string] | [string, SimpleType];
export declare type State = SimpleType;
export declare type Store = Record<string, State>;
export declare type Reducer = (store: Store, action: Action) => Store;

export const atomActionQueue = atom<Action[]>({
  key: 'atomActionQueue',
  default: []
});

export const atomReducerStack = atom<[string, SimpleType][]>({
  key: 'atomReducerStack',
  default: []
});

export const atomStateStore = atom<Record<string, SimpleType>>({
  key: 'atomStateStore',
  default: {}
});

export const selectorState = selectorFamily<SimpleType, string>({
  key: 'selectorState',
  get: (key: string) => ({ get }): SimpleType | undefined => {
    const { [key]: entry } = get(atomStateStore);
    return entry instanceof DefaultValue ? undefined : entry;
  },
  set: (key: string) => ({ get, set }, state) => {
    if (state instanceof DefaultValue || isNil(state)) {
      const { [key]: entry, ...next } = get(atomStateStore);
      set(atomStateStore, next);
    } else {
      set(atomStateStore, {
        ...get(atomStateStore),
        [key]: state
      });
    }
  }
});

export const selectorAction = selector<Action>({
  key: 'selectorAction',
  get: ({ get }): Action => {
    const [top] = get(atomActionQueue);
    return top;
  },
  set: ({ get, set }, action) => {
    if (action instanceof DefaultValue) return;
    const queue = get(atomActionQueue);
    set(atomActionQueue, [...queue, action]);
  }
});

export const useDequeueAction = (): Action | undefined => {
  const [[top], setter] = useRecoilState(atomActionQueue);
  setter(([rem, ...next]) => next);
  return top;
}

export const useEnqueueAction = (action: Action) => {
  const setter = useSetRecoilState(atomActionQueue);
  setter(queue => [...queue, action]);
}

export const usePushReducer = (reducer: Reducer) => {
  
}

const reuce = <A = any>(state: RecoilState<Record<string, SimpleType>>) => {
  return state;
};

const useDispatch = <A = any>(state: RecoilState<Record<string, SimpleType>>): Dispatch<Action> => {
  
  const dispatch = (action: Action): void => {
  };

  return dispatch;
};
