import React from 'react';
import PropTypes from 'prop-types';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import classnames from 'classnames';
import { Record } from '../core';

const DataCell: React.FC<DataCellProps> = React.forwardRef<HTMLTableCellElement, DataCellProps>(
  ({ className, field, record, basePath, resource, ...rest }, ref) => (
    <TableCell
      className={classnames(className, field.props.cellClassName)}
      align={field.props.textAlign}
      ref={ref}
      {...rest}
    >
      {React.cloneElement(field, {
        record,
        basePath: field.props.basePath || basePath,
        resource,
      })}
    </TableCell>
  )
);

DataCell.propTypes = {
  className: PropTypes.string,
  field: PropTypes.element,
  // @ts-ignore
  record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  basePath: PropTypes.string,
  resource: PropTypes.string,
};

export interface DataCellProps extends TableCellProps {
  basePath?: string;
  className?: string;
  field?: JSX.Element;
  record?: Record;
  resource?: string;
}

// What? TypeScript loses the displayName if we don't set it explicitly
DataCell.displayName = 'DataCell';

export default DataCell;
