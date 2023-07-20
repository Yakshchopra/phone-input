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
import {
  checkBrowser,
  getOS,
  isNumber,
  stripSpecialCharactersFromEnd,
} from './utils';

const CountrySelect = ({ country, setCountry, labels, ...rest }) => {
  const [show, setShow] = useState();
  const [countryList, setCountryList] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    setCountryList(getCountries());
  }, []);

  const handleClick = () => {
    show ? inputRef.current.blur() : inputRef.current.focus();
    setShow((prev) => !prev);
  };

  return (
    <>
      <input
        className='select-input'
        autoComplete='tel-country-code'
        type='tel-country-code'
        onBlur={() => {
          setTimeout(() => setShow(false), 500);
        }}
        ref={inputRef}
      />
      <div onClick={handleClick} {...rest}>
        <div>
          <img
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
            alt={country}
          />
          <span>+{getCountryCallingCode(country)}</span>
        </div>
        <img src={`/Down.svg`} alt={country} />
      </div>
      {/* list */}
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
    </>
  );
};

const PhoneInput = ({
  defaultCountry,
  autoFormat,
  autoComplete,
  flagImages,
  ref,
  placeholder,
  onChange,
  onBlur,
  ...rest
}) => {
  const [isChar, setChar] = useState(false);
  const [value, setValue] = useState('');
  const [country, setCountry] = useState(defaultCountry || 'IN');
  const [isAutocomplete, setAutocomplete] = useState(false);

  // ---------------------------------------------------------------------------------------------
  // HELPERS - helper functions used in undermentioned functions
  // ---------------------------------------------------------------------------------------------

  // handler for valid interntional phone numbers
  const handleValidNumber = (event) => {
    const number = parsePhoneNumber(
      `+${event.target.value.replace(/\D+/g, '')}`
    );
    setCountry(number.country);
    setValue(number.formatNational());
  };

  // formats a number in national format of the currentlt selected country
  const formatValue = (value) => {
    if (isChar) {
      const editedVal = stripSpecialCharactersFromEnd(value);
      setValue(editedVal);
      setChar(false);
      return;
    }
    const formatedNum = new AsYouType(country).input(value);
    if (!isNumber(formatedNum.charAt(formatedNum.length - 1))) {
      setChar(true);
    }
    setValue(formatedNum);
  };

  useEffect(() => {
    const ele = document.querySelector('.tel-input-field');
    function keyHandler(e) {
      if (e.key) {
        setAutocomplete(false);
      } else {
        setAutocomplete(true);
      }
    }
    ele.addEventListener('keydown', keyHandler);
    // cleanup for event listener
    return () => ele.removeEventListener('keydown', keyHandler);
  }, []);

  // -----------------------------------------------------------------------------------------------------------------------------------
  // AUTOCOMPLETE HANDLER - checks validity of number withExistingCountryCode and without it and updated input field accordingly
  // -----------------------------------------------------------------------------------------------------------------------------------
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
      formatValue(value);
    }
  };

  // -------------------------------------------------------------------------
  // CHANGE HANDLER - passes formated value to the onChange from props
  // -------------------------------------------------------------------------
  const handleChange = (event) => {
    if (event.target.value.includes('+')) {
      handleValidNumber(event);
      return;
    }
    const stripedValue = `${event.target.value.replace(/\D+/g, '')}`;
    if (
      isAutocomplete &&
      getOS().toUpperCase() !== 'IOS' &&
      checkBrowser() !== 'Apple Safari'
    ) {
      console.log('here');
      handleAutocomplete(stripedValue);
    } else {
      formatValue(event.target.value);
    }
    onChange && onChange(value);
  };

  // -------------------------------------------------------------------------
  // BLUR HANDLER - passes formated value to the onChange from props
  // -------------------------------------------------------------------------
  const handleBlur = (event) => {
    const { value } = event.target;

    if (value && country) {
      const newVal = parsePhoneNumber(value, country);
      onBlur && onBlur(newVal.number);
    } else {
      onBlur && onBlur('');
    }
  };

  return (
    <div className='PhoneInput' {...rest}>
      {/* custom dropdown for country selection */}
      <CountrySelect
        className='PhoneInputCountry'
        labels={en}
        country={country}
        setCountry={setCountry}
      />
      {/* input managing phone number */}
      <input
        value={value}
        className='tel-input-field'
        autoComplete={'tel'}
        placeholder={placeholder || '+91 99999 99999'}
        onChange={handleChange}
        onBlur={handleBlur}
        type='tel'
      />
    </div>
  );
};

export default PhoneInput;
