import { render } from '@testing-library/react';
import PropTypes from 'prop-types';
import DataCell from './DataCell';

const renderWithTable = element =>
  render(
    <table>
      <tbody>
        <tr>{element}</tr>
      </tbody>
    </table>
  );

describe('<DataCell />', () => {
  const Field = ({ basePath }) => <div>{basePath}</div>;
  Field.propTypes = {
    type: PropTypes.string,
    basePath: PropTypes.string,
  };

  Field.defaultProps = {
    type: 'foo',
  };

  it('should render as a mui <TableCell /> component', () => {
    const { getByRole } = renderWithTable(
      <DataCell field={<Field />} />
    );
    expect(getByRole('cell').className).toEqual('MuiTableCell-root');
  });

  it('should pass the DataView basePath by default', () => {
    const { queryByText } = renderWithTable(
      <DataCell basePath="default" field={<Field />} />
    );
    expect(queryByText('default')).not.toBeNull();
  });

  it('should allow to overwrite the `basePath` field', () => {
    const { queryByText } = renderWithTable(
      <DataCell basePath="default" field={<Field basePath="new" />} />
    );
    expect(queryByText('new')).not.toBeNull();
  });
});
