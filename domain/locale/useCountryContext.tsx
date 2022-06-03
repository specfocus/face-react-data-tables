import React from 'react';
import type { CountryCode  } from './Country';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

export declare interface CountryState {
  code?: CountryCode;
}

export declare interface CountryValue extends CountryState {
  set: (state?: CountryState) => void;
}

export const atomGlobalCountry = atom<CountryState>({
  key: 'atomGlobalCountry',
  default: { }
});

const DEFAULT_VALUE = { set: () => { throw 'not implemented'; } };


export const CountryContext = React.createContext<CountryValue>(DEFAULT_VALUE);

export const CountryProvider: React.FC<{ children?: React.ReactNode | undefined }> = ({ children }) => {
  const globalState = useRecoilValue(atomGlobalCountry);
  const [state, set] = React.useState<CountryState>(globalState);
  return (
    <CountryContext.Provider value={{...state, set }}>
      {children}
    </CountryContext.Provider>
  );
};

const useCountryContext = (): CountryValue => {
  const [state, set] = useRecoilState(atomGlobalCountry);
  const value = React.useContext(CountryContext);
  if (value !== DEFAULT_VALUE) {
    return value;
  }
  return {
    ...state,
    set
  };
}

export default useCountryContext;
