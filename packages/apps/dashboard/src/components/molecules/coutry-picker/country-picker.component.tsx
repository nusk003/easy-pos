import React, { useRef, useState } from 'react';
import { Inputs } from '..';
import { SearchItem } from '@src/components/molecules/inputs/search.component';
import countryData from '@src/components/templates/create-account/country-data.json';
import Fuse from 'fuse.js';
import _ from 'lodash';

const fuse = new Fuse(countryData, {
  keys: ['name', 'synonyms'],
});

const specificCountryList = countryData.map((country) => country.name);

interface SearchCountry extends SearchItem {
  payload?: { name: string; countryCode: string };
}

type Props = {
  name: string;
  label?: string;
  disabled?: boolean;
  embedded?: boolean;
  labelStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  fontWeight?: string;
  minDropdownWidth?: string;
};

export const CountryPicker: React.FC<Props> = ({
  name,
  label,
  disabled,
  embedded,
  labelStyle,
  wrapperStyle,
  fontWeight,
  minDropdownWidth,
}) => {
  const [searchCountries, setSearchCountries] = useState<SearchCountry[]>([]);
  const countrySearchRef = useRef<HTMLInputElement>(null);

  const handleCountryChange = _.debounce(async (query: string) => {
    if (!query) {
      return setSearchCountries([]);
    }

    const searchResponse = fuse.search(query);

    if (searchResponse) {
      setSearchCountries(
        searchResponse.slice(0, 3).map((country) => {
          return {
            title: country.item.name,
            payload: {
              name: country.item.name,
              countryCode: country.item.countryCode,
            },
          };
        })
      );
    }
  }, 700);

  const handleCountryClick = (country: SearchCountry) => {
    if (!country) {
      return;
    }

    if (countrySearchRef?.current) {
      countrySearchRef.current.value = country.payload?.name || '';
    }

    setSearchCountries([]);
  };

  return (
    <Inputs.Search
      fontWeight={fontWeight}
      embedded={embedded}
      wrapperStyle={wrapperStyle}
      labelStyle={labelStyle}
      disabled={disabled}
      ref={countrySearchRef}
      data={searchCountries}
      label={label}
      onClick={handleCountryClick}
      onChange={(e) => handleCountryChange(e.target.value)}
      name={name}
      placeholder="Country"
      allowedValues={specificCountryList}
      autoComplete="none"
      minDropdownWidth={minDropdownWidth}
    />
  );
};
