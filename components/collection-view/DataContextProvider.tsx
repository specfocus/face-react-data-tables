import React from 'react';
import { ReactElement, ReactNode } from 'react';
import DataContext, { DataContextValue } from './DataContext';

const DataContextProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: DataContextValue;
}): ReactElement => (
  <DataContext.Provider value={value}>
    {children}
  </DataContext.Provider>
);

export default DataContextProvider;
