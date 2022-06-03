import convertCountryCodeToFlag from './convertCountryCodeToFlag';
import DomainPicker, { DomainPickerProps } from '../DomainPicker';

export const countryTransformFn = ({ country, ...spread }: any) => ({
  ...spread,
  country,
  icon: convertCountryCodeToFlag(country)
});

export const LANGUAGE_OPTION_TEMPLATE = `<span>{icon}</span>
&nbsp;<span>{name} ({code}) +{phone}<span>
`;

const LanguagePicker = (props: DomainPickerProps) => {
  return (
    <DomainPicker
      domain="locale/language"
      labelKey="name"
      optionTemplate={LANGUAGE_OPTION_TEMPLATE}
      transformFn={countryTransformFn}
      {...props}
    />
  );
};

export default LanguagePicker;
