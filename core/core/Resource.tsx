import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { matchPath, Route, RouteProps, Routes, useParams } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import { registerResource, unregisterResource } from '../actions';
import { ResourceProps, ResourceMatch, ReduxState } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';

const defaultOptions = {};

const ResourceRegister = (props: ResourceProps) => {
  const {
    name,
    list,
    create,
    edit,
    show,
    icon,
    options = defaultOptions,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      registerResource({
        name,
        options,
        hasList: !!list,
        hasEdit: !!edit,
        hasShow: !!show,
        hasCreate: !!create,
        icon,
      })
    );
    return () => {
      console.log('UNREGISTER_RESOURCE', name);
      dispatch(unregisterResource(name));
    };
  }, [dispatch, name, create, edit, icon, list, show, options]);
  return null;
};

const ResourceRoutes = (props: ResourceProps) => {
  const {
    name,
    match,
    list,
    create,
    edit,
    show,
    options = defaultOptions,
  } = props;
  const isRegistered = useSelector(
    (state: ReduxState) => {
      return !!state.admin.resources[name];
    }
  );

  const basePath = match || '';

  const resourceData = useMemo(
    () => ({
      resource: name,
      options,
      hasList: !!list,
      hasEdit: !!edit,
      hasShow: !!show,
      hasCreate: !!create,
    }),
    [name, options, create, edit, list, show]
  );

  // match tends to change even on the same route ; using memo to avoid an extra render
  return useMemo(() => {
    // if the registration hasn't finished, no need to render
    if (!isRegistered) {
      console.log(`if ${name} registration hasn't finished, no need to render`);
      return null;
    }

    const Create = (routeProps: RouteProps) => (
      <WithPermissions
        component={create}
        basePath={basePath}
        {...routeProps}
        {...resourceData}
      />
    );

    const Detail = (routeProps: RouteProps) => {
      const params = useParams<{ id: string; }>();
      return (
        <WithPermissions
          component={edit}
          basePath={basePath}
          id={decodeURIComponent(params.id!)}
          {...routeProps}
          {...resourceData}
        />
      );

    };
    const Show = (routeProps: RouteProps) => {
      const params = useParams<{ id: string; }>();
      return (
        <WithPermissions
          component={show}
          basePath={basePath}
          id={decodeURIComponent(params.id!)}
          {...routeProps}
          {...resourceData}
        />
      );
    };

    const List = (routeProps: RouteProps) => (
      <WithPermissions
        component={list}
        basePath={basePath}
        {...routeProps}
        {...resourceData}
        syncWithLocation
      />
    );

    return (
      <ResourceContextProvider value={name}>
        <Routes>
          {create && (<Route path="create" element={<Create />} />)}
          {show && (<Route path=":id/show" element={<Show />} />)}
          {edit && (<Route path=":id" element={<Detail />} />)}
          {list && (<Route path="" element={<List />} />)}
        </Routes>
      </ResourceContextProvider>
    );
  }, [basePath, name, create, edit, list, show, options, isRegistered]); // eslint-disable-line react-hooks/exhaustive-deps
};

const Resource = (props: ResourceProps) => {
  const { intent = 'route', ...rest } = props;
  return intent === 'registration' ? (
    <ResourceRegister {...rest} />
  ) : (
    <ResourceRoutes {...rest} />
  );
};

export default Resource;
