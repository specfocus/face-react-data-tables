import { ThemeOptions } from '@mui/material';
import { History } from 'history';
import { ComponentType, ReactElement, ReactNode } from 'react';
import { Location, PathMatch, RouteProps } from 'react-router';
import { AuthActionType } from '../auth/types';

/**
 * data types
 */

export type Identifier = string | number;
export interface Record {
    id: Identifier;
    [key: string]: any;
}

export interface RecordMap<RecordType = Record> {
    // Accept strings and numbers as identifiers
    [id: string]: RecordType;
    [id: number]: RecordType;
}

export interface SortPayload {
    field: string;
    order: string;
}
export interface FilterPayload {
    [k: string]: any;
}
export interface PaginationPayload {
    page: number;
    perPage: number;
}
export type ValidUntil = Date;
/**
 * i18nProvider types
 */

export const I18N_TRANSLATE = 'I18N_TRANSLATE';
export const I18N_CHANGE_LOCALE = 'I18N_CHANGE_LOCALE';

export type Translate = (key: string, options?: any) => string;

export type I18nProvider = {
    translate: Translate;
    changeLocale: (locale: string, options?: any) => Promise<void>;
    getLocale: () => string;
    [key: string]: any;
};

/**
 * dataProvider types
 */


export interface ResourceDefinition {
    readonly name: string;
    readonly options?: any;
    readonly hasList?: boolean;
    readonly hasEdit?: boolean;
    readonly hasShow?: boolean;
    readonly hasCreate?: boolean;
    readonly icon?: any;
}

/**
 * Redux state type
 */
export interface ReduxState {
    admin: {
        ui: {
            automaticRefreshEnabled: boolean;
            optimistic: boolean;
            sidebarOpen: boolean;
            viewVersion: number;
        };
        resources: {
            [name: string]: {
                props: ResourceDefinition;
                data: RecordMap;
                list: {
                    cachedRequests?: {
                        ids: Identifier[];
                        total: number;
                        validity: Date;
                    };
                    expanded: Identifier[];
                    ids: Identifier[];
                    loadedOnce: boolean;
                    params: any;
                    selectedIds: Identifier[];
                    total: number;
                };
                validity: {
                    [key: string]: Date;
                    [key: number]: Date;
                };
            };
        };
        references: {
            oneToMany: {
                [relatedTo: string]: { ids: Identifier[]; total: number };
            };
        };
        loading: number;
        customQueries: {
            [key: string]: any;
        };
    };
    router: {
        location: Location;
    };

    // leave space for custom reducers
    [key: string]: any;
}

export type InitialState = object | (() => object);

/**
 * Misc types
 */

export type Dispatch<T> = T extends (...args: infer A) => any
    ? (...args: A) => void
    : never;

export type ResourceElement = ReactElement<ResourceProps>;
export type RenderResourcesFunction = (
    permissions: any
) => ResourceElement[] | Promise<ResourceElement[]>;
export type ResourceChildren = RenderResourcesFunction | ReactNode;

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
