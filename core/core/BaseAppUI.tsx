import * as React from 'react';
import { createElement, ComponentType, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import BaseAppRouter from './BaseAppRouter';
import { Ready } from '../util';
import {
  TitleComponent,
  LoginComponent,
  LayoutComponent,
  CoreLayoutProps,
  ResourceChildren,
  CatchAllComponent,
  CustomRoutes,
  DashboardComponent,
  LoadingComponent,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

const DefaultLayout = ({ children }: CoreLayoutProps) => <>{children}</>;

export interface AppUIProps {
  catchAll?: CatchAllComponent;
  children?: ResourceChildren;
  customRoutes?: CustomRoutes;
  dashboard?: DashboardComponent;
  disableTelemetry?: boolean;
  layout?: LayoutComponent;
  loading?: LoadingComponent;
  loginPage?: LoginComponent | boolean;
  logout?: ComponentType;
  menu?: ComponentType;
  ready?: ComponentType;
  theme?: object;
  title?: TitleComponent;
}

// for BC
export type BaseAppUIProps = AppUIProps;

const BaseAppUI = (props: AppUIProps) => {
  const {
    catchAll = Noop,
    children,
    customRoutes = [],
    dashboard,
    disableTelemetry = false,
    layout = DefaultLayout,
    loading = Noop,
    loginPage = false,
    logout,
    menu, // deprecated, use a custom layout instead
    ready = Ready,
    theme,
    title = 'React Admin',
  } = props;

  const logoutElement = useMemo(() => logout && createElement(logout), [
    logout,
  ]);

  useEffect(() => {
    if (
      disableTelemetry ||
      process.env.NODE_ENV !== 'production' ||
      typeof window === 'undefined' ||
      typeof window.location === 'undefined' ||
      typeof Image === 'undefined'
    ) {
      return;
    }
    const img = new Image();
    img.src = `https://../../app-telemetry.marmelab.com/../../app-telemetry?domain=${window.location.hostname}`;
  }, [disableTelemetry]);

  return (
    <Routes>
      {loginPage !== false && loginPage !== true ? (
        <Route
          path="/login"
          element={props =>
            createElement(loginPage, {
              ...props,
              title,
              theme,
            })
          }
        />
      ) : null}
      <Route
        path="/"
        element={props => (
          <BaseAppRouter
            catchAll={catchAll}
            customRoutes={customRoutes}
            dashboard={dashboard}
            layout={layout}
            loading={loading}
            logout={logoutElement}
            menu={menu}
            ready={ready}
            theme={theme}
            title={title}
            {...props}
          >
            {children}
          </BaseAppRouter>
        )}
      />
    </Routes>
  );
};

const Noop = () => null;

export default BaseAppUI;
