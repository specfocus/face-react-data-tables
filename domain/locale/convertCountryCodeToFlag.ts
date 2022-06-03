// ISO 3166-1 alpha-2
// ⚠️ No support for IE11
const convertCountryCodeToFlag = (isoCode: string): string =>
  typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;

export default convertCountryCodeToFlag;
