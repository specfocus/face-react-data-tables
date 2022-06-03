import type { Identifier, RecordMap } from 'core/types';
import type { ResourceDefinition } from 'resource/types';

export type Dispatch<T> = T extends (...args: infer A) => any
? (...args: A) => void
: never;

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

