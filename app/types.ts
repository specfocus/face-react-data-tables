
import { ThemeOptions } from '@mui/material';
import { AuthProvider, LegacyAuthProvider } from 'auth/types';
import { DataProvider, LegacyDataProvider } from 'dataProvider/types';
import { History } from 'history';
import { ComponentType, ReactElement, ReactNode } from 'react';
import { RouteProps } from 'react-router';
import { ResourceChildren } from 'resource/types';

export interface CustomRoute extends RouteProps {
noLayout?: boolean;
[key: string]: any;
}

export type CustomRoutes = Array<ReactElement<CustomRoute>>;

export type TitleComponent = string | ReactElement<any>;
export type CatchAllComponent = ComponentType<{ title?: TitleComponent }>;

interface LoginComponentProps extends RouteProps {
title?: TitleComponent;
theme?: object;
}
export type LoginComponent = ComponentType<LoginComponentProps>;
export type DashboardComponent = ComponentType<any>;

export interface CoreLayoutProps {
children?: ReactNode;
dashboard?: DashboardComponent;
logout?: ReactNode;
menu?: ComponentType<{
    logout?: ReactNode;
    hasDashboard?: boolean;
}>;
theme?: ThemeOptions;
title?: TitleComponent;
}

export type LayoutComponent = ComponentType<CoreLayoutProps>;
export type LoadingComponent = ComponentType<{
theme?: ThemeOptions;
loadingPrimary?: string;
loadingSecondary?: string;
}>;

export interface AppProps {
appLayout?: LayoutComponent;
authProvider?: AuthProvider | LegacyAuthProvider;
catchAll?: CatchAllComponent;
children?: ResourceChildren;
customReducers?: object;
customRoutes?: CustomRoutes;
customSagas?: any[];
dashboard?: DashboardComponent;
dataProvider: DataProvider | LegacyDataProvider;
disableTelemetry?: boolean;
history?: History;
i18nProvider?: I18nProvider;
initialState?: InitialState;
layout?: LayoutComponent;
loading?: ComponentType;
locale?: string;
loginPage?: LoginComponent | boolean;
logoutButton?: ComponentType;
menu?: ComponentType;
ready?: ComponentType;
theme?: ThemeOptions;
title?: TitleComponent;
}
