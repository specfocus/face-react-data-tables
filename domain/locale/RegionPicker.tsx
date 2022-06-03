import RegionIcon from '@mui/icons-material/LocationOnOutlined';
import type { Optional } from '../../../components/MixedAutocomplete';
import DomainPicker, { DomainPickerProps } from '../DomainPicker';
import useCountryContext from './useCountryContext';

const RegionPicker = ({ children, domain, labelKey, ...spreadProps }: Optional<DomainPickerProps, 'domain'>) => {
  const { set, ...country } = useCountryContext();
  const defaultDomain = country.code ? `location/country/${country.code}`.toLocaleLowerCase() : null;
  return (
    <DomainPicker
      domain={domain || defaultDomain}
      labelKey={labelKey || 'name'}
      buttonSx={{ justifyContent: 'flex-start' }}
      {...spreadProps}
    >{(<><RegionIcon fontSize={ spreadProps.onClick ? 'small' : 'medium' } />{children}</>)}</DomainPicker>
  );
};

export default RegionPicker;
