import * as React from 'react';
import { waitFor } from '@testing-library/react';
import expect from 'expect';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { renderWithRedux } from '../../test';
import BaseAppRouter from './BaseAppRouter';
import AuthContext from '../auth/AuthContext';
import Resource from './Resource';

const Layout = ({ children }) => <div>Layout {children}</div>;

describe('<BaseAppRouter>', () => {
    const defaultProps = {
        customRoutes: [],
    };

    describe('With resources as regular children', () => {
        it('should render all resources in routes', () => {
            const history = createMemoryHistory();
            const { getByText } = renderWithRedux(
                <Router location="/" navigator={history}>
                    <BaseAppRouter {...defaultProps} layout={Layout}>
                        <Resource
                            name="posts"
                            list={() => <span>PostList</span>}
                        />
                        <Resource
                            name="comments"
                            list={() => <span>CommentList</span>}
                        />
                    </BaseAppRouter>
                </Router>
            );
            expect(getByText('Layout')).not.toBeNull();
            navigate('/posts');
            expect(getByText('PostList')).not.toBeNull();
            navigate('/comments');
            expect(getByText('CommentList')).not.toBeNull();
        });
    });

    describe('With no authProvider defined', () => {
        it('should render all resources with a render prop', async () => {
            const history = createMemoryHistory();
            const { getByText } = renderWithRedux(
                <Router location="/" navigator={history}>
                    <BaseAppRouter {...defaultProps} layout={Layout}>
                        {() => [
                            <Resource
                                name="posts"
                                list={() => <span>PostList</span>}
                            />,
                            <Resource
                                name="comments"
                                list={() => <span>CommentList</span>}
                            />,
                        ]}
                    </BaseAppRouter>
                </Router>
            );
            await waitFor(() => {
                expect(getByText('Layout')).not.toBeNull();
            });
            navigate('/posts');
            expect(getByText('PostList')).not.toBeNull();
            navigate('/comments');
            expect(getByText('CommentList')).not.toBeNull();
        });
    });

    describe('With resources returned from a function as children', () => {
        it('should render all resources with a registration intent', async () => {
            const history = createMemoryHistory();
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            const { queryByText } = renderWithRedux(
                <AuthContext.Provider value={authProvider}>
                    <Router location="/" navigator={history}>
                        <BaseAppRouter layout={Layout}>
                            {() => [
                                <Resource
                                    key="posts"
                                    name="posts"
                                    list={() => <span>PostList</span>}
                                />,
                                <Resource
                                    key="comments"
                                    name="comments"
                                    list={() => <span>CommentList</span>}
                                />,
                                null,
                            ]}
                        </BaseAppRouter>
                    </Router>
                </AuthContext.Provider>
            );
            // Timeout needed because of the authProvider call
            await waitFor(() => {
                expect(queryByText('Layout')).not.toBeNull();
            });
            navigate('/posts');
            expect(queryByText('PostList')).not.toBeNull();
            navigate('/comments');
            expect(queryByText('CommentList')).not.toBeNull();
        });

        it('should return loading while the resources are not resolved', async () => {
            const history = createMemoryHistory();
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };
            const Loading = () => <>Loading</>;
            const Custom = () => <>Custom</>;

            const { queryByText } = renderWithRedux(
                <AuthContext.Provider value={authProvider}>
                    <Router location="/" navigator={history}>
                        <BaseAppRouter
                            {...defaultProps}
                            layout={Layout}
                            loading={Loading}
                            customRoutes={[
                                <Route
                                    key="foo"
                                    noLayout
                                    path="/foo"
                                    component={Custom}
                                />,
                            ]}
                        >
                            {() => new Promise(() => {})}
                        </BaseAppRouter>
                    </Router>
                </AuthContext.Provider>
            );
            // Timeout needed because of the authProvider call
            await new Promise(resolve => setTimeout(resolve, 1010));
            navigate('/posts');
            expect(queryByText('Loading')).not.toBeNull();
            navigate('/foo');
            expect(queryByText('Loading')).toBeNull();
            expect(queryByText('Custom')).not.toBeNull();
        });
    });

    it('should render the custom routes with and without layout', () => {
        const history = createMemoryHistory();
        const { getByText, queryByText } = renderWithRedux(
            <Router location="/" navigator={history}>
                <BaseAppRouter
                    layout={Layout}
                    customRoutes={[
                        <Route
                            key="foo"
                            noLayout
                            path="/foo"
                            render={() => <div>Foo</div>}
                        />,
                        <Route
                            key="bar"
                            path="/bar"
                            element={() => <div>Bar</div>}
                        />,
                    ]}
                    location={{ pathname: '/custom' }}
                >
                    <Resource name="posts" />
                </BaseAppRouter>
            </Router>
        );
        navigate('/foo');
        expect(queryByText('Layout')).toBeNull();
        expect(getByText('Foo')).not.toBeNull();
        navigate('/bar');
        expect(getByText('Layout')).not.toBeNull();
        expect(getByText('Bar')).not.toBeNull();
    });
});
