import CountryIcon from '@mui/icons-material/PublicOutlined';
import { Optional } from '../../../components/MixedAutocomplete';
import convertCountryCodeToFlag from './convertCountryCodeToFlag';
import DomainPicker, { DomainPickerProps } from '../DomainPicker';
import useCountryContext from './useCountryContext';

export const countryTransformFn = ({ code, ...spread }: any) => ({
  ...spread,
  code,
  icon: code ? convertCountryCodeToFlag(code) : null
});

export const COUNTRY_OPTION_TEMPLATE = `<span>{icon}</span>
&nbsp;<span>{name} ({code}) +{phone}<span>
`;

const CountryPicker = ({ children, domain, onChange, ...spreadProps }: Optional<DomainPickerProps, 'domain'>) => {
  const { code, set, ...spread } = useCountryContext();
  const handleChange = (country?: any) =>
    set({ ...spread, ...country });
  return (
    <DomainPicker
      domain={domain || 'location/country'}
      labelKey="name"
      onChange={onChange || handleChange}
      optionTemplate={COUNTRY_OPTION_TEMPLATE}
      transformFn={countryTransformFn}
      value={spreadProps.value || code || ''}
      {...spreadProps}
    >{(<><CountryIcon fontSize={spreadProps.onClick ? 'small' : 'medium'} />{children}</>)}</DomainPicker>
  );
};

export default CountryPicker;
