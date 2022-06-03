import { ComponentType } from 'react';
import { PathMatch, RouteProps } from 'react-router';

export interface ResourceComponentInjectedProps {
  basePath?: string;
  permissions?: any;
  resource?: string;
  options?: any;
  hasList?: boolean;
  hasEdit?: boolean;
  hasShow?: boolean;
  hasCreate?: boolean;
}

export interface ResourceComponentProps<
  Params extends { [K in keyof Params]?: string } = {},
  C = any, // extends StaticContext = StaticContext,
  S = any // LocationState
> extends Partial<RouteProps>,
      ResourceComponentInjectedProps {}

// deprecated name, use ResourceComponentProps instead
export type ReactAdminComponentProps = ResourceComponentProps;

export interface ResourceComponentPropsWithId<
  Params extends { id?: string } = {},
  C = any, // StaticContext,
  S = any // LocationState
> extends Partial<RouteProps>,
      ResourceComponentInjectedProps {
  id?: string;
}

// deprecated name, use ResourceComponentPropsWithId instead
export type ReactAdminComponentPropsWithId = ResourceComponentPropsWithId;

export type ResourceMatch = PathMatch<'id'>;

export interface ResourceProps {
  intent?: 'route' | 'registration';
  match?: ResourceMatch;
  name: string;
  list?: ComponentType<ResourceComponentProps>;
  create?: ComponentType<ResourceComponentProps>;
  edit?: ComponentType<ResourceComponentPropsWithId>;
  show?: ComponentType<ResourceComponentPropsWithId>;
  icon?: ComponentType<any>;
  options?: object;
}