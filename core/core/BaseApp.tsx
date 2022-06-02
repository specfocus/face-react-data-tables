import * as React from 'react';
import { ComponentType } from 'react';

import BaseAppContext from './BaseAppContext';
import BaseAppUI from './BaseAppUI';
import { AppProps } from '../types';

export type ChildrenFunction = () => ComponentType[];

/**
 * Main admin component, entry point to the application.
 *
 * Initializes the various contexts (auth, data, i18n, redux, router)
 * and defines the main routes.
 *
 * Expects a list of resources as children, or a function returning a list of
 * resources based on the permissions.
 *
 * @example
 *
 * // static list of resources
 *
 * import {
 *     CoreAdmin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from '../../core';
 *
 * const App = () => (
 *     <Core dataProvider={myDataProvider}>
 *         <Resource name="posts" list={ListGuesser} />
 *     </Core>
 * );
 *
 * // dynamic list of resources based on permissions
 *
 * import {
 *     CoreAdmin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from '../../core';
 *
 * const App = () => (
 *     <CoreAdmin dataProvider={myDataProvider}>
 *         {permissions => [
 *             <Resource name="posts" key="posts" list={ListGuesser} />,
 *         ]}
 *     </CoreAdmin>
 * );
 *
 * // If you have to build a dynamic list of resources using a side effect,
 * // you can't use <CoreAdmin>. But as it delegates to sub components,
 * // it's relatively straightforward to replace it:
 *
 * import * as React from 'react';
 * import { useEffect, useState } from 'react';
 * import {
 *     BaseAppContext,
 *     BaseAppUI,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from '../../core';
 *
 * const App = () => (
 *     <BaseAppContext dataProvider={myDataProvider}>
 *         <UI />
 *     </BaseAppContext>
 * );
 *
 * const UI = () => {
 *     const [resources, setResources] = useState([]);
 *     const dataProvider = useDataProvider();
 *     useEffect(() => {
 *         dataProvider.introspect().then(r => setResources(r));
 *     }, []);
 *
 *     return (
 *         <BaseAppUI>
 *             {resources.map(resource => (
 *                 <Resource name={resource.name} key={resource.key} list={ListGuesser} />
 *             ))}
 *         </BaseAppUI>
 *     );
 * };
 */
const BaseApp = (props: AppProps) => {
    const {
        appLayout,
        authProvider,
        catchAll,
        children,
        customReducers,
        customRoutes = [],
        customSagas,
        dashboard,
        dataProvider,
        disableTelemetry,
        history,
        i18nProvider,
        initialState,
        layout,
        loading,
        loginPage,
        logoutButton,
        menu, // deprecated, use a custom layout instead
        theme,
        title = 'React Admin',
    } = props;
    return (
        <BaseAppContext
            authProvider={authProvider}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            // history={history}
            // customReducers={customReducers}
            // customSagas={customSagas}
            // initialState={initialState}
        >
            <BaseAppUI
                layout={appLayout || layout}
                customRoutes={customRoutes}
                dashboard={dashboard}
                disableTelemetry={disableTelemetry}
                menu={menu}
                catchAll={catchAll}
                theme={theme}
                title={title}
                loading={loading}
                loginPage={loginPage}
                logout={authProvider ? logoutButton : undefined}
            >
                {children}
            </BaseAppUI>
        </BaseAppContext>
    );
};

export default BaseApp;
