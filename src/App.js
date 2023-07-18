import 'react-phone-number-input/style.css';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import {
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';
import parsePhoneNumber from 'libphonenumber-js';
import { AsYouType } from 'libphonenumber-js';

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

  useEffect(() => {
    const ele = document.querySelector('.PhoneInput input');
    ele.addEventListener('keydown', (e) => {
      if (e.key) {
        sessionStorage.setItem('atc', 'false');
      } else {
        sessionStorage.setItem('atc', 'true');
      }
    });

    setCountryList(getCountries());
  }, []);

  useEffect(() => {
    if (country && value) {
      const formated = new AsYouType(country).input(value);
      setValue(formated);
    }
  }, [country]);

  const handleChange = (e) => {
    if (sessionStorage.getItem('atc') === 'true') {
      const phoneval = `+${e.target.value.replace(/\D+/g, '')}`;
      const phoneValCc = `+${getCountryCallingCode(
        country
      )}${e.target.value.replace(/\D+/g, '')}`;

      if (isValidPhoneNumber(phoneval) || isValidPhoneNumber(phoneValCc)) {
        if (isValidPhoneNumber(phoneval)) {
          const newVal = parsePhoneNumber(phoneval);
          setCountry(newVal.country);
          setValue(newVal.nationalNumber);
        } else {
          console.log('there');
          const newVal = parsePhoneNumber(phoneValCc);
          setCountry(newVal.country);
          setValue(newVal.nationalNumber);
        }
      } else {
        const formated = new AsYouType(country).input(e.target.value);
        console.log(formated);
        formated === value ? setValue(e.target.value) : setValue(formated);
      }
    } else {
      const formated = new AsYouType(country).input(e.target.value);
      console.log(formated);
      formated === value ? setValue(e.target.value) : setValue(formated);
    }
  };

  const handleBlur = () => {
    const newVal = parsePhoneNumber(value, country);
    if (newVal?.number) {
      console.log(newVal?.number);
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
                // setShow(false);
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
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
