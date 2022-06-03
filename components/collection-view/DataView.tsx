import * as React from 'react';
import {
  cloneElement,
  createElement,
  isValidElement,
  useCallback,
  useRef,
  useEffect,
  FC,
  ComponentType,
  ReactElement,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  sanitizeListRestProps,
  useListContext,
  useVersion,
  Identifier,
  Record,
  RecordMap,
  SortPayload,
} from '../core';
import { Table, TableProps } from '@mui/material';
import classnames from 'classnames';
import union from 'lodash/union';
import difference from 'lodash/difference';

import { DataHeader } from './DataHeader';
import DataLoading from './DataLoading';
import DataBody, { PureDataBody } from './DataBody';
import useDataViewStyles from './useDataViewStyles';
import { ClassesOverride } from '../types';
import { RowClickFunction } from './DataRow';
import DataContextProvider from './DataContextProvider';

/**
 * The DataView component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - rowStyle
 *
 * @example Display all posts as a datagrid
 * const postRowStyle = (record, index) => ({
 *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = (props) => (
 *     <List {...props}>
 *         <DataView rowStyle={postRowStyle}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="body" />
 *             <EditButton />
 *         </DataView>
 *     </List>
 * );
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <DataView>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </DataView>
 * </ReferenceManyField>
 *
 *
 * @example Usage outside of a <List> or a <ReferenceManyField>.
 *
 * const currentSort = { field: 'published_at', order: 'DESC' };
 *
 * export const MyCustomList = (props) => {
 *     const { ids, data, total, loaded } = useGetList(
 *         'posts',
 *         { page: 1, perPage: 10 },
 *         currentSort
 *     );
 *
 *     return (
 *         <DataView
 *             basePath=""
 *             currentSort={currentSort}
 *             data={data}
 *             ids={ids}
 *             selectedIds={[]}
 *             loaded={loaded}
 *             total={total}
 *             setSort={() => {
 *                 console.log('set sort');
 *             }}
 *             onSelect={() => {
 *                 console.log('on select');
 *             }}
 *             onToggleItem={() => {
 *                 console.log('on toggle item');
 *             }}
 *         >
 *             <TextField source="id" />
 *             <TextField source="title" />
 *         </DataView>
 *     );
 * }
 */
const DataView: FC<DataProps> = React.forwardRef((props, ref) => {
  const classes = useDataViewStyles(props);
  const {
    optimized = false,
    body = optimized ? PureDataBody : DataBody,
    header = DataHeader,
    children,
    classes: classesOverride,
    className,
    empty,
    expand,
    hasBulkActions = false,
    hover,
    isRowSelectable,
    isRowExpandable,
    resource,
    rowClick,
    rowStyle,
    size = 'small',
    ...rest
  } = props;

  const {
    basePath,
    currentSort,
    data,
    ids,
    loaded,
    onSelect,
    onToggleItem,
    selectedIds,
    setSort,
    total,
  } = useListContext(props);
  const version = useVersion();

  const contextValue = useMemo(() => ({ isRowExpandable }), [
    isRowExpandable,
  ]);

  const lastSelected = useRef(null);

  useEffect(() => {
    if (!selectedIds || selectedIds.length === 0) {
      lastSelected.current = null;
    }
  }, [JSON.stringify(selectedIds)]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleItem = useCallback(
    (id, event) => {
      const lastSelectedIndex = ids.indexOf(lastSelected.current);
      lastSelected.current = event.target.checked ? id : null;

      if (event.shiftKey && lastSelectedIndex !== -1) {
        const index = ids.indexOf(id);
        const idsBetweenSelections = ids.slice(
          Math.min(lastSelectedIndex, index),
          Math.max(lastSelectedIndex, index) + 1
        );

        const newSelectedIds = event.target.checked
          ? union(selectedIds, idsBetweenSelections)
          : difference(selectedIds, idsBetweenSelections);

        onSelect(
          isRowSelectable
            ? newSelectedIds.filter((id: Identifier) =>
              isRowSelectable(data[id])
            )
            : newSelectedIds
        );
      } else {
        onToggleItem(id);
      }
    },
    [data, ids, isRowSelectable, onSelect, onToggleItem, selectedIds]
  );

  /**
   * if loaded is false, the list displays for the first time, and the dataProvider hasn't answered yet
   * if loaded is true, the data for the list has at least been returned once by the dataProvider
   * if loaded is undefined, the DataView parent doesn't track loading state (e.g. ReferenceArrayField)
   */
  if (loaded === false) {
    return (
      <DataLoading
        classes={classes}
        className={className}
        expand={expand}
        hasBulkActions={hasBulkActions}
        nbChildren={React.Children.count(children)}
        size={size}
      />
    );
  }

  /**
   * Once loaded, the data for the list may be empty. Instead of
   * displaying the table header with zero data rows,
   * the datagrid displays nothing or a custom empty component.
   */
  if (loaded && (ids.length === 0 || total === 0)) {
    if (empty) {
      return empty;
    }

    return null;
  }

  /**
   * After the initial load, if the data for the list isn't empty,
   * and even if the data is refreshing (e.g. after a filter change),
   * the datagrid displays the current data.
   */
  return (
    <DataContextProvider value={contextValue}>
      <Table
        ref={ref}
        className={classnames(classes.table, className)}
        size={size}
        {...sanitizeListRestProps(rest)}
      >
        {createOrCloneElement(
          header,
          {
            children,
            classes,
            className,
            currentSort,
            data,
            hasExpand: !!expand,
            hasBulkActions,
            ids,
            isRowSelectable,
            onSelect,
            resource,
            selectedIds,
            setSort,
          },
          children
        )}
        {createOrCloneElement(
          body,
          {
            basePath,
            className: classes.tbody,
            classes,
            expand,
            rowClick,
            data,
            hasBulkActions,
            hover,
            ids,
            onToggleItem: handleToggleItem,
            resource,
            rowStyle,
            selectedIds,
            isRowSelectable,
            version,
          },
          children
        )}
      </Table>
    </DataContextProvider>
  );
});

const createOrCloneElement = (element, props, children) =>
  isValidElement(element)
    ? cloneElement(element, props, children)
    : createElement(element, props, children);

DataView.propTypes = {
  basePath: PropTypes.string,
  // @ts-ignore
  body: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  children: PropTypes.node.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string,
  currentSort: PropTypes.exact({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  data: PropTypes.any,
  empty: PropTypes.element,
  // @ts-ignore
  expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  hasBulkActions: PropTypes.bool,
  // @ts-ignore
  header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  hover: PropTypes.bool,
  ids: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.bool,
  onSelect: PropTypes.func,
  onToggleItem: PropTypes.func,
  resource: PropTypes.string,
  rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowStyle: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.any),
  setSort: PropTypes.func,
  total: PropTypes.number,
  version: PropTypes.number,
  isRowSelectable: PropTypes.func,
  isRowExpandable: PropTypes.func,
};

export interface DataProps<RecordType extends Record = Record>
  extends Omit<TableProps, 'size' | 'classes' | 'onSelect'> {
  body?: ReactElement | ComponentType;
  classes?: ClassesOverride<typeof useDataViewStyles>;
  className?: string;
  expand?:
  | ReactElement
  | FC<{
    basePath: string;
    id: Identifier;
    record: Record;
    resource: string;
  }>;
  hasBulkActions?: boolean;
  header?: ReactElement | ComponentType;
  hover?: boolean;
  empty?: ReactElement;
  isRowSelectable?: (record: Record) => boolean;
  isRowExpandable?: (record: Record) => boolean;
  optimized?: boolean;
  rowClick?: string | RowClickFunction;
  rowStyle?: (record: Record, index: number) => any;
  size?: 'medium' | 'small';
  // can be injected when using the component without context
  basePath?: string;
  currentSort?: SortPayload;
  data?: RecordMap<RecordType>;
  ids?: Identifier[];
  loaded?: boolean;
  onSelect?: (ids: Identifier[]) => void;
  onToggleItem?: (id: Identifier) => void;
  setSort?: (sort: string, order?: string) => void;
  selectedIds?: Identifier[];
  total?: number;
}

DataView.displayName = 'DataView';

export default DataView;
