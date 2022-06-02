import * as React from 'react';
import { makeStyles } from '@mui/styles';
import classnames from 'classnames';
import { Theme } from '@mui/material/styles/createTheme';

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            backgroundColor: theme.palette.grey[300],
            display: 'flex',
        },
    }),
    { name: 'RaPlaceholder' }
);

interface Props {
    className?: string;
    classes?: Record<'root', string>;
}

const Placeholder = (props: Props) => {
    const classes = useStyles(props);
    return (
        <span className={classnames(classes.root, props.className)}>
            &nbsp;
        </span>
    );
};

export default Placeholder;
