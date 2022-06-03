import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import type { AutocompleteProps } from '@mui/material/Autocomplete';
import Autocomplete from '@mui/material/Autocomplete';
import Button, { ButtonProps } from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import MixedField, { ChangeEvent, FormEvent, MixedFieldProps } from '../../../components/MixedField';
import type { AutocompleteChangeReason, AutocompleteValue } from '@mui/material/useAutocomplete';
import React from 'react';
import { styled } from '@mui/material/styles';

const Option = styled('li')(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '&span': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Optional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & {
  [P in K]?: T[P];
};

export interface MoneyFieldProps<
  T, Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType<any> = 'div'
  > extends Optional<
  Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'color' | 'onClick'>, 'renderInput'>,
  Pick<MixedFieldProps, 'children' | 'color' | 'label' | 'onClick' | 'variant'> {
  translations?: Record<string, string>;
}

function MoneyField<T extends string,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType<any> = 'div'
>({
  children,
  color,
  label,
  onClick,
  translations,
  value: initialValue,
  variant,
  ...props
}: MoneyFieldProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>) {
  const freeSolo = Array.isArray(props.options) && props.options.length === 0;
  const handleChange = React.useCallback(
    (
      event: ChangeEvent,
      value: any,
    ) => {
      if (freeSolo && props.onChange) {
        props.onChange(event, value, 'createOption');
      }
    },
    [freeSolo, props.onChange]
  );
  const handleInput = React.useCallback(
    (event: FormEvent) => {
      if (freeSolo && props.onInput) {
        props.onInput(event);
      }
    },
    [freeSolo, props.onInput]
  );
  const extendedProps = React.useMemo(
    () => {
      let internalProps: Optional<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'renderInput'> = {
        ...props
      };
      if (freeSolo) {
        Object.assign(internalProps, { freeSolo });
      }
      if (props.multiple) {
        const multipleProps: Partial<Optional<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'renderInput'>> = {
          renderOption: (props, option, { selected }) => (
            <Option {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </Option>
          ),
          renderTags: (tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
              />
            ))
        };

        Object.assign(
          internalProps,
          multipleProps
        );
      }

      return internalProps;
    },
    [props]
  );

  const isOptionEqualToValue = (option: any, value: any) => {
    if (!props.options.includes(option)) {
      return false;
    }
    return option === value;
  };

  const getOptionLabel = (option: any) => {
    // this works to clear when there is an option change
    if (!props.options.includes(option)) {
      return '';
    }
    return translations ? translations[option] || option : option;
  };

  return (
    <Autocomplete
      autoComplete={true}
      freeSolo={freeSolo}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params: any) => {
        const onChange = (...args: any[]) => {
          // @ts-ignore
          handleChange(...args);
          if (params.onChange) {
            params.onChange(...args);
          }
        };
        const onInput = (...args: any[]) => {
          // @ts-ignore
          handleInput(...args);
          if (params.onInput) {
            params.onInput(...args);
          }
        };
        return (
          <MixedField
            {...params}
            buttonSx={{ marginLeft: 0 }}
            color={color}
            label={label}
            onChange={onChange}
            onClick={onClick}
            onInput={onInput}
          >{children}</MixedField>
        );
      }}
      {...extendedProps}
    />
  );
};

export default MoneyField;
