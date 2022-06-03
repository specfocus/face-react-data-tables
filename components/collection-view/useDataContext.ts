import { useContext, useMemo } from 'react';
import { DataProps } from './DataView';
import DataContext, { DataContextValue } from './DataContext';
import defaults from 'lodash/defaults';

export const useDataContext = (
  props?: DataProps
): DataContextValue => {
  const context = useContext(DataContext);

  return useMemo(
    () =>
      defaults(
        {},
        props != null ? { isRowExpandable: props.isRowExpandable } : {},
        context
      ),
    [context, props]
  );
};
