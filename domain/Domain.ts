import type { SimpleObject } from '@specfocus/spec-focus/object';
export declare type DomainValue = number | string | SimpleObject;
export declare interface Domain {
  type: string;
  values: Array<DomainValue> | Record<string, DomainValue>;
  expireTime?: number;
}