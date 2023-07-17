import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import './App.css';
import { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import {
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';

const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={(event) => onChange(event.target.value || undefined)}
  >
    <option value=''>{labels['ZZ']}</option>
    {getCountries().map((country) => (
      <option key={country} value={country}>
        {labels[country]} +{getCountryCallingCode(country)}
      </option>
    ))}
  </select>
);

function App() {
  const [value, setValue] = useState('');

  const handleCountryChange = (country) => {
    console.log(country);
  };

  const handleChange = (e) => {
    console.log(e);
    setValue(e);
  };

  const handleBlur = () => {
    if (value) {
      const isValid = isValidPhoneNumber(value);
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
      <form>
        <PhoneInput
          international={false}
          placeholder='Enter phone number'
          value={value}
          onBlur={handleBlur}
          defaultCountry='IN'
          onCountryChange={handleCountryChange}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}

export default App;
