import type { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import Autocomplete, { MixedAutocompleteProps } from '../../components/MixedAutocomplete';
import React from 'react';
import type { Domain } from './Domain';
import { useDomain, useDomains } from './store';
import { supplant } from '@specfocus/spec-focus/string';
import { SxProps } from '@mui/material/styles';

export interface DomainPickerProps<T extends {} = any> extends
  Omit<MixedAutocompleteProps<string, false, true, true>, 'onChange' | 'options' | 'renderInput'> {
  buttonSx?: SxProps;
  domain: string;
  labelKey?: string;
  onChange?: (value: T) => void;
  optionTemplate?: string;
  template?: string;
  transformFn?: (option: any) => any;
  valueKey?: string;
}

const getOptions = (domain: Domain, key: string): [string[], Record<string, any>] => {
  if (Array.isArray(domain?.values) && key) {
    const map = domain.values.reduce(
      (acc: any, item: any) =>
        item instanceof Object ? Object.assign(acc, { [item[key]]: item }) : acc,
      {}
    );
    return [Object.keys(map), map];
  }

  return [Object.keys(domain?.values || {}), domain?.values || {}];
};

const DomainPicker: React.FC<DomainPickerProps<any>> = ({
  domain: key,
  labelKey,
  onChange,
  optionTemplate,
  template,
  transformFn,
  value: initialValue,
  valueKey,
  ...spread
}) => {
  React.useEffect(
    () => {
      if (!key && !initialValue) {
        if (onChange) {
          onChange(undefined);
        }
      }
    },
    [initialValue, key, onChange]
  );
  const domain = useDomain(key);
  /*
  const domains = useDomains([key]);
  const { [key]: domain } = domains;
  */
  const [options, map] = React.useMemo(
    () => getOptions(domain, valueKey),
    [domain]
  );
  const handleChange = React.useCallback(
    (
      event: React.SyntheticEvent<Element, Event>,
      value: string,
      reason: AutocompleteChangeReason
    ) => {
      if (onChange) {
        const { [value]: data } = map;
        if (data) {
          onChange({ ...data, value });
        } else {
          onChange(value);
        }
      }
    },
    [map, onChange]
  );
  const translations = React.useMemo(
    () => {
      if (!labelKey) {
        return;
      }
      return Object.entries(map).reduce((acc, [key, value]) => {
        const label = value[labelKey];
        return !label ? acc : Object.assign(acc, { [key]: label });
      }, {});
    },
    [labelKey, map]
  );
  const props = React.useMemo(
    () => {
      const internalProps = {
        ...spread,
        disabled: !key,
        onChange: handleChange,
        options,
        translations,
        value: key ? initialValue : undefined
      };

      if (optionTemplate) {
        Object.assign(internalProps, {
          renderOption: (params: any, option: any) => {
            let data = map[option];
            if (!data) {
              return option;
            }
            if (transformFn) {
              data = transformFn(data);
            }
            return data ? (
              <li {...params} dangerouslySetInnerHTML={{ __html: supplant(optionTemplate, data) }} />
            ) : option;
          }
        });
      }

      return internalProps;
    },
    [initialValue, key, spread, translations]
  );
  return (
    <Autocomplete {...props} />
  );
};

export default DomainPicker;
