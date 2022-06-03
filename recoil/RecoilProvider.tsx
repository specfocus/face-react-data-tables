import React from 'react';
import { RecoilRoot, RecoilRootProps, RecoilState, RecoilValue, useRecoilCallback } from 'recoil';

interface RecoilStaticContext {
  get?: <T>(atom: RecoilValue<T>) => T;
  getPromise?: <T>(atom: RecoilValue<T>) => Promise<T>;
  set?: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void;
  reset?: (atom: RecoilState<any>) => void;
}

const _context: RecoilStaticContext = {};

type RecoilProviderProps = RecoilRootProps;

const RecoilProvider = (props: RecoilProviderProps) => {
  _context.get = useRecoilCallback<[atom: RecoilValue<any>], any>(({ snapshot }) =>
    function <T>(atom: RecoilValue<T>) {
      return snapshot.getLoadable(atom).contents;
    }, []);

  _context.getPromise = useRecoilCallback<[atom: RecoilValue<any>], Promise<any>>(({ snapshot }) =>
    function <T>(atom: RecoilValue<T>) {
      return snapshot.getPromise(atom);
    }, []);

  _context.set = useRecoilCallback(({ set }) => set, []);

  _context.reset = useRecoilCallback(({ reset }) => reset, []);

  return (<RecoilRoot {...props} />);
};

export default RecoilProvider;

export function getRecoil<T>(atom: RecoilValue<T>): T {
  return _context.get!(atom);
}

export function getRecoilPromise<T>(atom: RecoilValue<T>): Promise<T> {
  return _context.getPromise!(atom);
}

export function setRecoil<T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) {
  _context.set!(atom, valOrUpdater);
}

export function resetRecoil(atom: RecoilState<any>) {
  _context.reset!(atom);
}