import 'react-phone-number-input/style.css';
import './App.css';
import { useEffect, useState, useRef } from 'react';

import {
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';
import parsePhoneNumber from 'libphonenumber-js';
import { AsYouType } from 'libphonenumber-js';
import { checkBrowser, getOS } from './utils';
import formatIncompletePhoneNumber from 'libphonenumber-js';

const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <div {...rest}>
    <div>
      <img
        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}
        alt={value}
      />
      <span>+{getCountryCallingCode(value)}</span>
    </div>
    <img src={`/Down.svg`} alt={value} />
  </div>
);

function App() {
  const [value, setValue] = useState('');
  const [country, setCountry] = useState('IN');
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const [isAutocomplete, setAutocomplete] = useState(false);

  useEffect(() => {
    const ele = document.querySelector('.PhoneInput input');
    ele.addEventListener('keydown', (e) => {
      if (e.key) {
        setAutocomplete(false);
      } else {
        setAutocomplete(true);
      }
    });
    setCountryList(getCountries());
  }, []);

  const handleBlur = () => {
    const newVal = parsePhoneNumber(value, country);
    console.log(newVal?.number);
    if (newVal?.number) {
      const isValid = newVal.isValid();
      if (!isValid) {
        const ele = document.querySelector('.PhoneInput input');
        ele.style.border = '1px solid red';
      } else {
        const ele = document.querySelector('.PhoneInput input');
        ele.style.border = '1px solid var(--gray-g-6, #E2E2E2)';
      }
    } else {
      const ele = document.querySelector('.PhoneInput input');
      ele.style.border = '1px solid red';
    }
  };

  const handleAutocomplete = (value) => {
    const withCountryCode = `+${getCountryCallingCode(country)}${value.replace(
      /\D+/g,
      ''
    )}`;
    const withoutCountryCode = `+${value.replace(/\D+/g, '')}`;
    const parsedNumberWithcc = parsePhoneNumber(withCountryCode);
    const parsedNumber = parsePhoneNumber(withoutCountryCode);
    if (parsedNumber?.isValid()) {
      setCountry(parsedNumber.country);
      setValue(parsedNumber.formatNational());
    } else if (parsedNumberWithcc?.isValid()) {
      setValue(parsedNumberWithcc.formatNational());
    } else {
      setValue(value);
    }
  };

  const handleChange = (event) => {
    const value = `${event.target.value.replace(/\D+/g, '')}`;
    if (isAutocomplete) {
      if (
        getOS().toUpperCase() !== 'IOS' &&
        checkBrowser() !== 'Apple Safari'
      ) {
        handleAutocomplete(value);
      } else {
        setValue(value);
      }
    } else {
      if (event.target.value === '') event.target.blur();
      setValue(value);
    }
  };

  const inputRef = useRef(null);

  return (
    <div className='container'>
      <input
        className='select-input'
        autoComplete='tel-country-code'
        type='tel-country-code'
        onBlur={() => {
          setTimeout(() => setShow(false), 500);
        }}
        ref={inputRef}
      />
      <form className='PhoneInput'>
        <CountrySelect
          className='PhoneInputCountry'
          labels={en}
          value={country}
          onChange={setCountry}
          onClick={() => {
            show ? inputRef.current.blur() : inputRef.current.focus();
            setShow((prev) => !prev);
          }}
        />
        <input
          value={value}
          autoComplete='tel'
          type='tel'
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='Enter phone number'
        />
        {show && (
          <div className='list'>
            <div
              onClick={() => {
                setCountry(country);
              }}
              className='flagItem active'
            >
              <img
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
                alt={country}
              />
              <span>{en[country]}</span>
              <span className='countryCode'>
                +{getCountryCallingCode(country)}
              </span>
            </div>
            {countryList.map((item) => {
              return (
                item !== country && (
                  <div
                    onClick={() => {
                      setCountry(item);
                      setShow(false);
                    }}
                    className='flagItem'
                  >
                    <img
                      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${item}.svg`}
                      alt={item}
                    />
                    <span>{en[item]}</span>
                    <span className='countryCode'>
                      +{getCountryCallingCode(item)}
                    </span>
                  </div>
                )
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
