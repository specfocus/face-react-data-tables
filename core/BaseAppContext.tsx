import React, { Fragment } from 'react';
import { ComponentType, useContext, useState } from 'react';
// import { Provider, ReactReduxContext } from 'react-redux';
import { History } from 'history';
import { createBrowserHistory } from 'history';
// import { ConnectedRouter } from 'connected-react-router';

import { AuthContext, convertLegacyAuthProvider } from '../../auth';
import {
    DataProviderContext,
    convertLegacyDataProvider,
} from '../dataProvider';
// import createReduxStore from './createReduxStore';
import TranslationProvider from '../i18n/TranslationProvider';
import {
    AuthProvider,
    LegacyAuthProvider,
    I18nProvider,
    DataProvider,
    ResourceChildren,
    CustomRoutes,
    DashboardComponent,
    LegacyDataProvider,
    // InitialState,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

export interface AppContextProps {
    authProvider?: AuthProvider | LegacyAuthProvider;
    children?: ResourceChildren;
    // customSagas?: any[];
    // customReducers?: object;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    dataProvider: DataProvider | LegacyDataProvider;
    // history?: History;
    i18nProvider?: I18nProvider;
    // initialState?: InitialState;
    theme?: object;
}

const BaseAppContext = (props: AppContextProps) => {
    const {
        authProvider,
        dataProvider,
        i18nProvider,
        children,
        // history,
        // customReducers,
        // customSagas,
        // initialState,
    } = props;
    // const reduxIsAlreadyInitialized = !!useContext(ReactReduxContext);

    if (!dataProvider) {
        throw new Error(`Missing dataProvider prop.
React-admin requires a valid dataProvider function to work.`);
    }

    const finalAuthProvider =
        authProvider instanceof Function
            ? convertLegacyAuthProvider(authProvider)
            : authProvider;

    const finalDataProvider =
        dataProvider instanceof Function
            ? convertLegacyDataProvider(dataProvider)
            : dataProvider;

    const finalHistory = history || createBrowserHistory();

    const renderCore = () => {
        return (
            <AuthContext.Provider value={finalAuthProvider!}>
                <DataProviderContext.Provider value={finalDataProvider}>
                    <TranslationProvider i18nProvider={i18nProvider!}>
                        <Fragment>
                            {/*typeof window !== 'undefined' ? (
                            <ConnectedRouter history={finalHistory}>
                                {children}
                            </ConnectedRouter>
                        ) : (
                            */children/*
                        )*/}
                        </Fragment>
                    </TranslationProvider>
                </DataProviderContext.Provider>
            </AuthContext.Provider>
        );
    };
    /*
        const [store] = useState(() =>
            !reduxIsAlreadyInitialized
                ? createReduxStore({
                      authProvider: finalAuthProvider,
                      customReducers,
                      customSagas,
                      dataProvider: finalDataProvider,
                      initialState,
                      history: finalHistory,
                  })
                : undefined
        );
    
        if (reduxIsAlreadyInitialized) {
            if (!history) {
                throw new Error(`Missing history prop.
    When integrating ../../app inside an existing redux Provider, you must provide the same 'history' prop to the <Admin> as the one used to bootstrap your routerMiddleware.
    React-admin uses this history for its own ConnectedRouter.`);
            }*/
    return renderCore();/*
    } else {
        return <Provider store={store!}>{renderCore()}</Provider>;
    }*/
};

export default BaseAppContext;
