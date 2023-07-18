import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumberIntl } from 'react-phone-number-input';
import './App.css';
import { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { formatPhoneNumber } from 'react-phone-number-input';

import {
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';
import parsePhoneNumber, { formatNumber } from 'libphonenumber-js';
import { AsYouType } from 'libphonenumber-js';

const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={(event) => onChange(event.target.value || undefined)}
  >
    {getCountries().map((country) => (
      <option key={country} value={country}>
        {labels[country]} +{getCountryCallingCode(country)}
      </option>
    ))}
  </select>
);

function App() {
  const [value, setValue] = useState('');
  const [country, setCountry] = useState('US');

  const handleChange = (e) => {
    if (isValidPhoneNumber(e.target.value)) {
      const newVal = parsePhoneNumber(e.target.value);
      setCountry(newVal.country);
      setValue(newVal.formatNational());
      return;
    }
    const formated = new AsYouType(country).input(e.target.value);
    setValue(formated);
  };

  const handleBlur = () => {
    const newVal = parsePhoneNumber(value, country);
    if (newVal?.number) {
      const isValid = isValidPhoneNumber(newVal.number);
      if (!isValid) {
        const ele = document.querySelector('.PhoneInput input');
        ele.style.border = '1px solid red';
      } else {
        const ele = document.querySelector('.PhoneInput input');
        ele.style.border = '1px solid var(--gray-g-6, #E2E2E2)';
      }
    }
  };

  return (
    <div className='container'>
      <form className='PhoneInput'>
        <CountrySelect
          className='PhoneInputCountry'
          labels={en}
          value={country}
          onChange={setCountry}
        />
        <input
          value={value}
          autoComplete='tel'
          type='tel'
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='Enter phone number'
        />
      </form>
    </div>
  );
}

export default App;
