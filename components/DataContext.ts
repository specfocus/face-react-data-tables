import { createContext } from 'react';
import { Record as RaRecord } from '../core';

const DataContext = createContext<DataContextValue>({});

DataContext.displayName = 'DataContext';

export type DataContextValue = {
  isRowExpandable?: (record: RaRecord) => boolean;
};

export default DataContext;
