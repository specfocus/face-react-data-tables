import * as React from 'react';
import { fireEvent } from '@testing-library/react';
import { linkToRecord } from '../../core';
import { renderWithRedux } from '../../test';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import DataRow from './DataRow';
import DataContextProvider from './DataContextProvider';

const TitleField = ({ record }: any): JSX.Element => (
    <span>{record.title}</span>
);
const ExpandPanel = () => <span>expanded</span>;

// remove validateDomNesting warnings by react-testing-library
const render = element =>
    renderWithRedux(
        <table>
            <tbody>{element}</tbody>
        </table>,
        {
            admin: {
                resources: {
                    posts: {
                        list: {
                            expanded: [],
                        },
                    },
                },
            },
        }
    );

describe('<DataRow />', () => {
    const defaultProps = {
        id: 15,
        basePath: '/blob',
        record: { id: 15, title: 'hello' },
        resource: 'posts',
    };

    const renderWithRouter = children => {
        const history = createMemoryHistory();

        return {
            history,
            ...render(<Router location="/" navigator={history}>{children}</Router>),
        };
    };

    describe('isRowExpandable', () => {
        it('should show the expand button if it returns true', () => {
            const contextValue = { isRowExpandable: () => true };

            const { queryAllByText, getByText } = renderWithRouter(
                <DataContextProvider value={contextValue}>
                    <DataRow
                        {...defaultProps}
                        rowClick="expand"
                        expand={<ExpandPanel />}
                    >
                        <TitleField />
                    </DataRow>
                </DataContextProvider>
            );
            expect(queryAllByText('expanded')).toHaveLength(0);
            fireEvent.click(getByText('hello'));
            expect(queryAllByText('expanded')).toHaveLength(1);
        });

        it('should not show the expand button if it returns false', () => {
            const contextValue = { isRowExpandable: () => false };

            const { queryAllByText, getByText } = renderWithRouter(
                <DataContextProvider value={contextValue}>
                    <DataRow
                        {...defaultProps}
                        rowClick="expand"
                        expand={<ExpandPanel />}
                    >
                        <TitleField />
                    </DataRow>
                </DataContextProvider>
            );
            expect(queryAllByText('expanded')).toHaveLength(0);
            fireEvent.click(getByText('hello'));
            expect(queryAllByText('expanded')).toHaveLength(0);
        });
    });

    describe('rowClick', () => {
        it("should redirect to edit page if the 'edit' option is selected", () => {
            const { getByText, history } = renderWithRouter(
                <DataRow {...defaultProps} rowClick="edit">
                    <TitleField />
                </DataRow>
            );
            fireEvent.click(getByText('hello'));
            expect(history.location.pathname).toEqual(
                linkToRecord(defaultProps.basePath, defaultProps.id)
            );
        });

        it("should redirect to show page if the 'show' option is selected", () => {
            const { getByText, history } = renderWithRouter(
                <DataRow {...defaultProps} rowClick="show">
                    <TitleField />
                </DataRow>
            );
            fireEvent.click(getByText('hello'));
            expect(history.location.pathname).toEqual(
                linkToRecord(defaultProps.basePath, defaultProps.id, 'show')
            );
        });

        it("should change the expand state if the 'expand' option is selected", () => {
            const { queryAllByText, getByText } = renderWithRouter(
                <DataRow
                    {...defaultProps}
                    rowClick="expand"
                    expand={<ExpandPanel />}
                >
                    <TitleField />
                </DataRow>
            );
            expect(queryAllByText('expanded')).toHaveLength(0);
            fireEvent.click(getByText('hello'));
            expect(queryAllByText('expanded')).toHaveLength(1);
            fireEvent.click(getByText('hello'));
            expect(queryAllByText('expanded')).toHaveLength(0);
        });

        it("should execute the onToggleItem function if the 'toggleSelection' option is selected", () => {
            const onToggleItem = jest.fn();
            const { getByText } = renderWithRouter(
                <DataRow
                    {...defaultProps}
                    onToggleItem={onToggleItem}
                    rowClick="toggleSelection"
                >
                    <TitleField />
                </DataRow>
            );
            fireEvent.click(getByText('hello'));
            expect(onToggleItem.mock.calls.length).toEqual(1);
        });

        it('should not execute the onToggleItem function if the row is not selectable', () => {
            const onToggleItem = jest.fn();
            const { getByText } = renderWithRouter(
                <DataRow
                    {...defaultProps}
                    selectable={false}
                    onToggleItem={onToggleItem}
                    rowClick="toggleSelection"
                >
                    <TitleField />
                </DataRow>
            );
            fireEvent.click(getByText('hello'));
            expect(onToggleItem).not.toHaveBeenCalled();
        });

        it('should redirect to the custom path if onRowClick is a string', () => {
            const path = '/foo/bar';
            const { getByText, history } = renderWithRouter(
                <DataRow {...defaultProps} rowClick={path}>
                    <TitleField />
                </DataRow>
            );
            fireEvent.click(getByText('hello'));
            expect(history.location.pathname).toEqual(path);
        });

        it('should evaluate the function and redirect to the result of that function if onRowClick is a custom function', async () => {
            const customRowClick = () => '/bar/foo';
            const { getByText, history } = renderWithRouter(
                <DataRow {...defaultProps} rowClick={customRowClick}>
                    <TitleField />
                </DataRow>
            );
            fireEvent.click(getByText('hello'));
            await new Promise(setImmediate); // waitFor one tick
            expect(history.location.pathname).toEqual('/bar/foo');
        });

        it('should not call push if onRowClick is falsy', () => {
            const { getByText, history } = renderWithRouter(
                <DataRow {...defaultProps} rowClick="">
                    <TitleField />
                </DataRow>
            );
            fireEvent.click(getByText('hello'));
            expect(history.location.pathname).toEqual('/');
        });
    });
});
