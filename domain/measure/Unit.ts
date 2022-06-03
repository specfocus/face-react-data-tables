import type { CountryCode } from '../locale/Country';
export interface BaseUnit<Type extends string = string, System extends string = string> {
  type: Type; // 'area' | 'emergy' | 'length' | 'physical' | 'money' // https://en.wikipedia.org/wiki/System_of_measurement
  system: System; // 'imperial', 'metric'
}

export interface Area extends BaseUnit<'area', 'imperial' | 'metric'> {
}

export interface Currency extends BaseUnit<'money', CountryCode> {
}

export interface Energy extends BaseUnit<'energy'> {
}

export interface Length extends BaseUnit<'area', 'imperial' | 'metric'> {
}

export interface Physical extends BaseUnit<'physical'> {
  constant: number;
  constantName: string;
  constantSymbol: string;
}
export interface Volume extends BaseUnit<'volume', 'imperial' | 'metric'> {
}

export type Unit = Area | Currency | Energy | Length | Physical | Volume;
/*
let unit: Unit = <any>{ type: 'energy', system: 'anything' };

switch (unit.type) {
  case 'physical':
    unit.constant = 324.234;
    unit.system = 'anything';
    break;
  case 'volume':
    unit.system = 'imperial';
    break;
}
*/
