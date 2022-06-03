import type { Identifier, PaginationPayload, Record, SortPayload, ValidUntil } from '../core/types';

export type MutationMode = 'pessimistic' | 'optimistic' | 'undoable';
export type OnSuccess = (response?: any) => void;
export type OnFailure = (error?: any) => void;

export type DataProvider = {
  getList: <RecordType extends Record = Record>(
      resource: string,
      params: GetListParams
  ) => Promise<GetListResult<RecordType>>;

  getOne: <RecordType extends Record = Record>(
      resource: string,
      params: GetOneParams
  ) => Promise<GetOneResult<RecordType>>;

  getMany: <RecordType extends Record = Record>(
      resource: string,
      params: GetManyParams
  ) => Promise<GetManyResult<RecordType>>;

  getManyReference: <RecordType extends Record = Record>(
      resource: string,
      params: GetManyReferenceParams
  ) => Promise<GetManyReferenceResult<RecordType>>;

  update: <RecordType extends Record = Record>(
      resource: string,
      params: UpdateParams
  ) => Promise<UpdateResult<RecordType>>;

  updateMany: (
      resource: string,
      params: UpdateManyParams
  ) => Promise<UpdateManyResult>;

  create: <RecordType extends Record = Record>(
      resource: string,
      params: CreateParams
  ) => Promise<CreateResult<RecordType>>;

  delete: <RecordType extends Record = Record>(
      resource: string,
      params: DeleteParams
  ) => Promise<DeleteResult<RecordType>>;

  deleteMany: (
      resource: string,
      params: DeleteManyParams
  ) => Promise<DeleteManyResult>;

  [key: string]: any;
};

export interface GetListParams {
  pagination: PaginationPayload;
  sort: SortPayload;
  filter: any;
}
export interface GetListResult<RecordType = Record> {
  data: RecordType[];
  total: number;
  validUntil?: ValidUntil;
}

export interface GetOneParams {
  id: Identifier;
}
export interface GetOneResult<RecordType = Record> {
  data: RecordType;
  validUntil?: ValidUntil;
}

export interface GetManyParams {
  ids: Identifier[];
}
export interface GetManyResult<RecordType = Record> {
  data: RecordType[];
  validUntil?: ValidUntil;
}

export interface GetManyReferenceParams {
  target: string;
  id: Identifier;
  pagination: PaginationPayload;
  sort: SortPayload;
  filter: any;
}
export interface GetManyReferenceResult<RecordType = Record> {
  data: RecordType[];
  total: number;
  validUntil?: ValidUntil;
}

export interface UpdateParams<T = any> {
  id: Identifier;
  data: T;
  previousData: Record;
}
export interface UpdateResult<RecordType = Record> {
  data: RecordType;
  validUntil?: ValidUntil;
}

export interface UpdateManyParams<T = any> {
  ids: Identifier[];
  data: T;
}
export interface UpdateManyResult {
  data?: Identifier[];
  validUntil?: ValidUntil;
}

export interface CreateParams<T = any> {
  data: T;
}
export interface CreateResult<RecordType = Record> {
  data: RecordType;
  validUntil?: ValidUntil;
}

export interface DeleteParams {
  id: Identifier;
  previousData: Record;
}
export interface DeleteResult<RecordType = Record> {
  data: RecordType;
}

export interface DeleteManyParams {
  ids: Identifier[];
}
export interface DeleteManyResult {
  data?: Identifier[];
}

export type DataProviderResult<RecordType = Record> =
  | CreateResult<RecordType>
  | DeleteResult<RecordType>
  | DeleteManyResult
  | GetListResult<RecordType>
  | GetManyResult<RecordType>
  | GetManyReferenceResult<RecordType>
  | GetOneResult<RecordType>
  | UpdateResult<RecordType>
  | UpdateManyResult;

export interface UseDataProviderOptions {
    action?: string;
    fetch?: string;
    meta?: object;
    // @deprecated use mode: 'undoable' instead
    undoable?: boolean;
    mutationMode?: MutationMode;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    enabled?: boolean;
}

export type LegacyDataProvider = (
    type: string,
    resource: string,
    params: any
) => Promise<any>;

export type DataProviderProxy = {
  getList: <RecordType extends Record = Record>(
      resource: string,
      params: GetListParams,
      options?: UseDataProviderOptions
  ) => Promise<GetListResult<RecordType>>;

  getOne: <RecordType extends Record = Record>(
      resource: string,
      params: GetOneParams,
      options?: UseDataProviderOptions
  ) => Promise<GetOneResult<RecordType>>;

  getMany: <RecordType extends Record = Record>(
      resource: string,
      params: GetManyParams,
      options?: UseDataProviderOptions
  ) => Promise<GetManyResult<RecordType>>;

  getManyReference: <RecordType extends Record = Record>(
      resource: string,
      params: GetManyReferenceParams,
      options?: UseDataProviderOptions
  ) => Promise<GetManyReferenceResult<RecordType>>;

  update: <RecordType extends Record = Record>(
      resource: string,
      params: UpdateParams,
      options?: UseDataProviderOptions
  ) => Promise<UpdateResult<RecordType>>;

  updateMany: (
      resource: string,
      params: UpdateManyParams,
      options?: UseDataProviderOptions
  ) => Promise<UpdateManyResult>;

  create: <RecordType extends Record = Record>(
      resource: string,
      params: CreateParams,
      options?: UseDataProviderOptions
  ) => Promise<CreateResult<RecordType>>;

  delete: <RecordType extends Record = Record>(
      resource: string,
      params: DeleteParams,
      options?: UseDataProviderOptions
  ) => Promise<DeleteResult<RecordType>>;

  deleteMany: (
      resource: string,
      params: DeleteManyParams,
      options?: UseDataProviderOptions
  ) => Promise<DeleteManyResult>;

  [key: string]: any;
};