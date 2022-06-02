import React, { Children, cloneElement, createElement } from 'react';
import { Navigate, Route, RouteProps, Routes } from 'react-router';

import WithPermissions from '../auth/WithPermissions';
import {
  ResourceChildren,
  CustomRoutes,
  CatchAllComponent,
  TitleComponent,
  DashboardComponent,
} from '../types';

export interface RoutesWithLayoutProps {
  catchAll: CatchAllComponent;
  children: ResourceChildren;
  customRoutes?: CustomRoutes;
  dashboard?: DashboardComponent;
  title?: TitleComponent;
}

const defaultAuthParams = { route: 'dashboard' };

const RoutesWithLayout = (props: RoutesWithLayoutProps) => {
  const { catchAll, children, customRoutes, dashboard, title } = props;
  const childrenAsArray = React.Children.toArray(children);
  const firstChild: React.ReactElement<any> | null =
    childrenAsArray.length > 0
      ? (childrenAsArray[0] as React.ReactElement<any>)
      : null;

  const wrappers = Children.map(children as any, (child: React.ReactElement<any>) => [
    child.props.name,
    (routeProps: RouteProps) => cloneElement(child, {
      // The context prop instruct the Resource component to
      // render itself as a standard component
      intent: 'route',
      ...props,
    })
  ]);

  const Dashboard = (routeProps: RouteProps) => (
    <WithPermissions
      authParams={defaultAuthParams}
      component={dashboard}
      {...routeProps}
    />
  );

  const CatchAll = (routeProps: RouteProps) =>
    createElement(catchAll, {
      ...routeProps,
      title,
    });

  return (
    <Routes>
      {customRoutes && customRoutes.map((route, key) => cloneElement(route, { key }))}
      {wrappers.map(([name, Wrapper]) => (
        <Route key={name} path={name} element={<Wrapper />} />
      ))}
      {dashboard ? (<Route path="/" element={<Dashboard />} />)
        : firstChild ? (<Route path="/" element={<Navigate to={`/${firstChild.props.name}`} />} />)
          : null}
      <Route element={<CatchAll />} />
    </Routes>
  );
};

export default RoutesWithLayout;
