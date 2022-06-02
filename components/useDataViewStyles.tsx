import { Theme } from '@mui/material/styles/createTheme';
import { makeStyles } from '@mui/styles';

const useDataViewStyles = makeStyles(
  (theme: Theme) => ({
    table: {
      tableLayout: 'auto',
      backgroundColor: theme.palette.mode !== 'dark' ? '#DDD' : '#555'
    },
    thead: {
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
      height: theme.spacing(6),
      zIndex: 2,
    },
    tbody: {
    },
    headerRow: {
      borderBottom: '0px solid transparent',
      backgroundColor: '#FFF'
    },
    headerCell: {
      borderBottom: '0px solid transparent',
      height: theme.spacing(6),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      wordWrap: 'break-word',
      '&:first-child': {
        borderTopLeftRadius: theme.shape.borderRadius,
      },
      '&:last-child': {
        borderTopRightRadius: theme.shape.borderRadius,
      },
    },
    checkbox: {},
    row: {
      backgroundColor: '#FFF'
    },
    clickableRow: {
      cursor: 'pointer',
    },
    rowEven: {},
    rowOdd: {},
    rowCell: {},
    expandHeader: {
      padding: 0,
      width: theme.spacing(6),
    },
    expandIconCell: {
      width: theme.spacing(6),
    },
    expandIcon: {
      padding: theme.spacing(1),
      transform: 'rotate(-90deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expanded: {
      transform: 'rotate(0deg)',
    }
  }),
  { name: 'DataView' }
);

export default useDataViewStyles;
