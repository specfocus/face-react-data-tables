import BaseApp from './BaseApp';
import BaseAppContext, { AppContextProps } from './BaseAppContext';
import BaseAppRouter, { AppRouterProps } from './BaseAppRouter';
import BaseAppUI, { AppUIProps } from './BaseAppUI';
import createAdminStore from './createReduxStore';
import RoutesWithLayout, { RoutesWithLayoutProps } from './RoutesWithLayout';
import Resource from './Resource';

export type {
    AppContextProps as AppContextProps,
    AppRouterProps as AppRouterProps,
    AppUIProps as AppUIProps,
    RoutesWithLayoutProps,
};

export {
    BaseApp as CoreAdmin,
    BaseAppContext as BaseAppContext,
    BaseAppRouter as BaseAppRouter,
    BaseAppUI,
    createAdminStore,
    RoutesWithLayout,
    Resource,
};
